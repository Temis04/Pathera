// Authentication service for Supabase integration
import { supabase } from '../lib/supabase';

/**
 * Sign up a new user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} name - User's full name
 * @returns {Promise<{user: Object, error: Error|null}>}
 */
export const signUp = async (email, password, name) => {
  try {
    // TODO: Integrate with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw error;

    // TODO: Create user profile in database
    if (data.user) {
      await createUserProfile(data.user.id, {
        email,
        full_name: name,
      });
    }

    return { user: data.user, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { user: null, error };
  }
};

/**
 * Sign in a user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<{user: Object, session: Object, error: Error|null}>}
 */
export const signIn = async (email, password) => {
  try {
    // TODO: Integrate with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { user: null, session: null, error };
  }
};

/**
 * Sign out the current user
 * @returns {Promise<{error: Error|null}>}
 */
export const signOut = async () => {
  try {
    // TODO: Integrate with Supabase Auth
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
};

/**
 * Get the current user session
 * @returns {Promise<{session: Object|null, error: Error|null}>}
 */
export const getSession = async () => {
  try {
    // TODO: Integrate with Supabase Auth
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error) {
    console.error('Error getting session:', error);
    return { session: null, error };
  }
};

/**
 * Get the current user
 * @returns {Promise<{user: Object|null, error: Error|null}>}
 */
export const getCurrentUser = async () => {
  try {
    // TODO: Integrate with Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('Error getting user:', error);
    return { user: null, error };
  }
};

/**
 * Listen to auth state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Object} - Subscription object with unsubscribe method
 */
export const onAuthStateChange = (callback) => {
  // TODO: Integrate with Supabase Auth
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

/**
 * Create user profile in database
 * @param {string} userId - User's ID from Supabase Auth
 * @param {Object} profile - User profile data
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
const createUserProfile = async (userId, profile) => {
  try {
    // TODO: Create profile in Supabase database 'profiles' table
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          email: profile.email,
          full_name: profile.full_name,
          created_at: new Date().toISOString(),
          cv_reviews_completed: 0,
          interviews_completed: 0,
          personal_statements_reviewed: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { data: null, error };
  }
};

/**
 * Reset password for user
 * @param {string} email - User's email address
 * @returns {Promise<{error: Error|null}>}
 */
export const resetPassword = async (email) => {
  try {
    // TODO: Integrate with Supabase Auth
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { error };
  }
};

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<{error: Error|null}>}
 */
export const updatePassword = async (newPassword) => {
  try {
    // TODO: Integrate with Supabase Auth
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error updating password:', error);
    return { error };
  }
};
