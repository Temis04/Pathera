// Subscription service for Stripe integration
import { supabase } from '../lib/supabase';

/**
 * Check if user has active premium subscription
 * @param {string} userId - User's ID
 * @returns {Promise<{isPremium: boolean, error: Error|null}>}
 */
export const checkPremiumStatus = async (userId) => {
  try {
    // TODO: Integrate with Supabase
    const { data, error } = await supabase
      .rpc('is_premium_user', { p_user_id: userId });

    if (error) throw error;
    return { isPremium: data, error: null };
  } catch (error) {
    console.error('Error checking premium status:', error);
    return { isPremium: false, error };
  }
};

/**
 * Get user's subscription details
 * @param {string} userId - User's ID
 * @returns {Promise<{subscription: Object|null, error: Error|null}>}
 */
export const getUserSubscription = async (userId) => {
  try {
    // TODO: Integrate with Supabase
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return { subscription: data, error: null };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return { subscription: null, error };
  }
};

/**
 * Check if user can upload more files based on subscription
 * @param {string} userId - User's ID
 * @param {string} uploadType - Type of upload ('cv', 'statement')
 * @returns {Promise<{canUpload: boolean, limit: number, current: number, error: Error|null}>}
 */
export const checkUploadLimit = async (userId, uploadType) => {
  try {
    // TODO: Integrate with Supabase
    const { isPremium } = await checkPremiumStatus(userId);
    
    if (isPremium) {
      return { 
        canUpload: true, 
        limit: -1, // Unlimited
        current: 0,
        error: null 
      };
    }

    // For free tier, check current uploads
    let tableName, currentCount;
    
    if (uploadType === 'cv') {
      const { data, error } = await supabase
        .from('cv_reviews')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (error) throw error;
      currentCount = data?.length || 0;
      
      return {
        canUpload: currentCount < 1,
        limit: 1,
        current: currentCount,
        error: null
      };
    }
    
    if (uploadType === 'statement') {
      const { data, error } = await supabase
        .from('personal_statements')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (error) throw error;
      currentCount = data?.length || 0;
      
      return {
        canUpload: currentCount < 1,
        limit: 1,
        current: currentCount,
        error: null
      };
    }

    return { 
      canUpload: false, 
      limit: 0, 
      current: 0,
      error: new Error('Invalid upload type') 
    };
  } catch (error) {
    console.error('Error checking upload limit:', error);
    return { canUpload: false, limit: 0, current: 0, error };
  }
};

/**
 * Create Stripe checkout session
 * @param {string} userId - User's ID
 * @param {string} priceId - Stripe price ID
 * @returns {Promise<{sessionId: string|null, url: string|null, error: Error|null}>}
 */
export const createCheckoutSession = async (userId, priceId) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const response = await fetch(`${apiUrl}/.netlify/functions/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        priceId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }
    
    const data = await response.json();
    return { sessionId: data.sessionId, url: data.url, error: null };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { sessionId: null, url: null, error };
  }
};

/**
 * Create Stripe customer portal session
 * @param {string} customerId - Stripe customer ID
 * @returns {Promise<{url: string|null, error: Error|null}>}
 */
export const createPortalSession = async (customerId) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const response = await fetch(`${apiUrl}/.netlify/functions/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create portal session');
    }
    
    const data = await response.json();
    return { url: data.url, error: null };
  } catch (error) {
    console.error('Error creating portal session:', error);
    return { url: null, error };
  }
};

/**
 * Cancel subscription at period end
 * @param {string} subscriptionId - Stripe subscription ID
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export const cancelSubscription = async (subscriptionId) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const response = await fetch(`${apiUrl}/.netlify/functions/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to cancel subscription');
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return { success: false, error };
  }
};

/**
 * Update user profile with Stripe subscription data (called by webhook)
 * @param {string} userId - User's ID
 * @param {Object} subscriptionData - Subscription data from Stripe
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export const updateUserSubscription = async (userId, subscriptionData) => {
  try {
    // TODO: Integrate with Supabase
    const {
      subscription_id,
      customer_id,
      price_id,
      status,
      current_period_start,
      current_period_end,
      cancel_at_period_end,
    } = subscriptionData;

    // Determine tier based on price_id
    const tier = price_id ? 'premium' : 'free';

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        subscription_tier: tier,
        subscription_status: status,
        subscription_start_date: current_period_start,
        subscription_end_date: current_period_end,
        stripe_customer_id: customer_id,
        stripe_subscription_id: subscription_id,
      })
      .eq('id', userId);

    if (profileError) throw profileError;

    // Insert or update subscription record
    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_subscription_id: subscription_id,
        stripe_customer_id: customer_id,
        stripe_price_id: price_id,
        status,
        tier,
        current_period_start,
        current_period_end,
        cancel_at_period_end,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'stripe_subscription_id',
      });

    if (subError) throw subError;

    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return { success: false, error };
  }
};

/**
 * Get subscription pricing plans
 * @returns {Array} Array of pricing plans
 */
export const getPricingPlans = () => {
  return [
    {
      name: 'Free',
      price: 0,
      interval: null,
      features: [
        '1 CV review',
        '1 Personal statement review',
        'Unlimited AI interviews',
        'Basic support',
      ],
      limits: {
        cv_uploads: 1,
        statement_uploads: 1,
        interviews: -1, // Unlimited
      },
      stripePriceId: null,
    },
    {
      name: 'Premium',
      price: 9.99, // TODO: Set your actual price
      interval: 'month',
      features: [
        'Unlimited CV reviews',
        'Unlimited personal statements',
        'Unlimited AI interviews',
        'Priority support',
        'Advanced analytics',
        'Supporting documents',
      ],
      limits: {
        cv_uploads: -1, // Unlimited
        statement_uploads: -1, // Unlimited
        interviews: -1, // Unlimited
        supporting_docs: -1, // Unlimited
      },
      stripePriceId: process.env.VITE_STRIPE_PREMIUM_PRICE_ID || 'price_xxx',
      recommended: true,
    },
  ];
};
