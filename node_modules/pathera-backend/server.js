import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Initialize Supabase Admin Client (optional)
// We'll lazy-initialize Supabase to avoid crashing at module load when env vars are missing
let supabase = null;
async function initSupabase() {
  const rawUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!rawUrl || !serviceKey) {
    console.warn('Supabase credentials not found in environment; Supabase is disabled. Create pathera-backend/.env with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable.');
    return;
  }

  const url = String(rawUrl).trim();
  try {
    if (!/^https?:\/\//i.test(url)) {
      throw new Error('SUPABASE_URL must start with http:// or https://');
    }

    // Dynamic import to avoid any initialization side-effects during top-level module load
    const { createClient } = await import('@supabase/supabase-js');
    supabase = createClient(url, String(serviceKey).trim());
    console.log('Supabase client initialized');
  } catch (err) {
    console.warn('Supabase not initialized:', err?.message || err);
    supabase = null;
  }
}

// Start initialization but don't let failures block the server
(async () => {
  try {
    await initSupabase();
  } catch (err) {
    console.warn('Unexpected error initializing Supabase:', err?.message || err);
    supabase = null;
  }
})();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Webhook endpoint (MUST be before express.json() middleware)
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Received webhook event:', event.type);

  try {
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Parse JSON for other routes
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pathera Backend API is running' });
});

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { userId, priceId } = req.body;

    if (!userId || !priceId) {
      return res.status(400).json({ error: 'Missing userId or priceId' });
    }

    if (!supabase) {
      return res.status(503).json({ error: 'Supabase not configured on server. Checkout unavailable.' });
    }

    // Get user from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, stripe_customer_id')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return res.status(404).json({ error: 'User not found' });
    }

    let customerId = profile.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email,
        metadata: {
          supabase_user_id: userId,
        },
      });
      customerId = customer.id;

      // Update profile with customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard?cancelled=true`,
      metadata: {
        supabase_user_id: userId,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: userId,
        },
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create Stripe Customer Portal Session
app.post('/api/create-portal-session', async (req, res) => {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({ error: 'Missing customerId' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription (at period end)
app.post('/api/cancel-subscription', async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'Missing subscriptionId' });
    }

    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    res.json({ success: true, subscription });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get subscription details
app.get('/api/subscription/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!supabase) {
      return res.status(503).json({ error: 'Supabase not configured on server.' });
    }

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.json({ subscription });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook Handler Functions
async function handleSubscriptionUpdate(subscription) {
  if (!supabase) {
    console.warn('Supabase not configured; skipping subscription update processing');
    return;
  }

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
  if (!supabase) {
    console.warn('Supabase not configured; skipping subscription deletion processing');
    return;
  }

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

  if (!supabase) {
    console.warn('Supabase not configured; cannot lookup user for failed payment');
    return;
  }

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Pathera Backend API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
