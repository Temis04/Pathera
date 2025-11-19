import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` }),
    };
  }

  console.log('Received webhook event:', stripeEvent.type);

  try {
    // Handle the event
    switch (stripeEvent.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(stripeEvent.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(stripeEvent.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(stripeEvent.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(stripeEvent.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook processing failed' }),
    };
  }
};

async function handleSubscriptionUpdate(subscription) {
  const userId = subscription.metadata.supabase_user_id;
  if (!userId) {
    console.error('No supabase_user_id in subscription metadata');
    return;
  }

  const subscriptionData = {
    subscription_tier: 'premium',
    subscription_status: subscription.status,
    subscription_start_date: new Date(subscription.current_period_start * 1000).toISOString(),
    subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
    stripe_customer_id: subscription.customer,
    stripe_subscription_id: subscription.id,
  };

  // Update profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update(subscriptionData)
    .eq('id', userId);

  if (profileError) {
    console.error('Error updating profile:', profileError);
    throw profileError;
  }

  // Upsert subscription record
  const { error: subError } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      stripe_price_id: subscription.items.data[0].price.id,
      status: subscription.status,
      tier: 'premium',
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'stripe_subscription_id',
    });

  if (subError) {
    console.error('Error upserting subscription:', subError);
    throw subError;
  }

  console.log(`Subscription updated for user ${userId}`);
}

async function handleSubscriptionDeleted(subscription) {
  const userId = subscription.metadata.supabase_user_id;
  if (!userId) {
    console.error('No supabase_user_id in subscription metadata');
    return;
  }

  // Downgrade to free tier
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      subscription_tier: 'free',
      subscription_status: 'cancelled',
      subscription_end_date: new Date().toISOString(),
    })
    .eq('id', userId);

  if (profileError) {
    console.error('Error updating profile:', profileError);
    throw profileError;
  }

  // Update subscription record
  const { error: subError } = await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (subError) {
    console.error('Error updating subscription:', subError);
  }

  console.log(`Subscription cancelled for user ${userId}`);
}

async function handlePaymentSucceeded(invoice) {
  console.log(`Payment succeeded for invoice ${invoice.id}`);
  // Additional logic if needed (e.g., send confirmation email)
}

async function handlePaymentFailed(invoice) {
  console.log(`Payment failed for invoice ${invoice.id}`);

  const customerId = invoice.customer;

  // Get user from customer ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('stripe_customer_id', customerId)
    .single();

  if (profile) {
    // TODO: Send payment failed email notification
    console.log(`Payment failed for user ${profile.id} (${profile.email})`);
  }
}
