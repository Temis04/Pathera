// Database service for Supabase integration
import { supabase } from '../lib/supabase';

/**
 * Get user profile from database
 * @param {string} userId - User's ID
 * @returns {Promise<{profile: Object|null, error: Error|null}>}
 */
export const getUserProfile = async (userId) => {
  try {
    // TODO: Fetch user profile from Supabase 'profiles' table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { profile: null, error };
  }
};

/**
 * Update user profile in database
 * @param {string} userId - User's ID
 * @param {Object} updates - Profile updates
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    // TODO: Update user profile in Supabase 'profiles' table
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { data: null, error };
  }
};

/**
 * Update user progress (increment counter)
 * @param {string} userId - User's ID
 * @param {string} progressType - Type of progress (cv_reviews_completed, interviews_completed, personal_statements_reviewed)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateUserProgress = async (userId, progressType) => {
  try {
    // TODO: Increment progress counter in Supabase 'profiles' table
    // First, get current value
    const { profile, error: fetchError } = await getUserProfile(userId);
    if (fetchError) throw fetchError;

    const currentValue = profile[progressType] || 0;
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ [progressType]: currentValue + 1 })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user progress:', error);
    return { data: null, error };
  }
};

/**
 * Save CV review result
 * @param {string} userId - User's ID
 * @param {Object} reviewData - CV review data
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const saveCVReview = async (userId, reviewData) => {
  try {
    // TODO: Save CV review to Supabase 'cv_reviews' table
    const { data, error } = await supabase
      .from('cv_reviews')
      .insert([
        {
          user_id: userId,
          ...reviewData,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    
    // Update progress counter
    await updateUserProgress(userId, 'cv_reviews_completed');
    
    return { data, error: null };
  } catch (error) {
    console.error('Error saving CV review:', error);
    return { data: null, error };
  }
};

/**
 * Get user's CV reviews
 * @param {string} userId - User's ID
 * @param {number} limit - Number of reviews to fetch
 * @returns {Promise<{reviews: Array|null, error: Error|null}>}
 */
export const getCVReviews = async (userId, limit = 10) => {
  try {
    // TODO: Fetch CV reviews from Supabase 'cv_reviews' table
    const { data, error } = await supabase
      .from('cv_reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { reviews: data, error: null };
  } catch (error) {
    console.error('Error fetching CV reviews:', error);
    return { reviews: null, error };
  }
};

/**
 * Save interview session
 * @param {string} userId - User's ID
 * @param {Object} interviewData - Interview session data
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const saveInterviewSession = async (userId, interviewData) => {
  try {
    // TODO: Save interview session to Supabase 'interview_sessions' table
    const { data, error } = await supabase
      .from('interview_sessions')
      .insert([
        {
          user_id: userId,
          ...interviewData,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    
    // Update progress counter
    await updateUserProgress(userId, 'interviews_completed');
    
    return { data, error: null };
  } catch (error) {
    console.error('Error saving interview session:', error);
    return { data: null, error };
  }
};

/**
 * Get user's interview sessions
 * @param {string} userId - User's ID
 * @param {number} limit - Number of sessions to fetch
 * @returns {Promise<{sessions: Array|null, error: Error|null}>}
 */
export const getInterviewSessions = async (userId, limit = 10) => {
  try {
    // TODO: Fetch interview sessions from Supabase 'interview_sessions' table
    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { sessions: data, error: null };
  } catch (error) {
    console.error('Error fetching interview sessions:', error);
    return { sessions: null, error };
  }
};

/**
 * Save personal statement review
 * @param {string} userId - User's ID
 * @param {Object} statementData - Personal statement data
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const savePersonalStatement = async (userId, statementData) => {
  try {
    // TODO: Save personal statement to Supabase 'personal_statements' table
    const { data, error } = await supabase
      .from('personal_statements')
      .insert([
        {
          user_id: userId,
          ...statementData,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    
    // Update progress counter
    await updateUserProgress(userId, 'personal_statements_reviewed');
    
    return { data, error: null };
  } catch (error) {
    console.error('Error saving personal statement:', error);
    return { data: null, error };
  }
};

/**
 * Get user's personal statements
 * @param {string} userId - User's ID
 * @param {number} limit - Number of statements to fetch
 * @returns {Promise<{statements: Array|null, error: Error|null}>}
 */
export const getPersonalStatements = async (userId, limit = 10) => {
  try {
    // TODO: Fetch personal statements from Supabase 'personal_statements' table
    const { data, error } = await supabase
      .from('personal_statements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { statements: data, error: null };
  } catch (error) {
    console.error('Error fetching personal statements:', error);
    return { statements: null, error };
  }
};

/**
 * Get work experience opportunities
 * @param {Object} filters - Filter options (location, industry, etc.)
 * @param {number} limit - Number of opportunities to fetch
 * @returns {Promise<{opportunities: Array|null, error: Error|null}>}
 */
export const getWorkExperienceOpportunities = async (filters = {}, limit = 20) => {
  try {
    // TODO: Fetch work experience opportunities from Supabase 'work_opportunities' table
    let query = supabase
      .from('work_opportunities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Apply filters if provided
    if (filters.location) {
      query = query.eq('location', filters.location);
    }
    if (filters.industry) {
      query = query.eq('industry', filters.industry);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { opportunities: data, error: null };
  } catch (error) {
    console.error('Error fetching work experience opportunities:', error);
    return { opportunities: null, error };
  }
};

/**
 * Save user's application for work experience
 * @param {string} userId - User's ID
 * @param {string} opportunityId - Work opportunity ID
 * @param {Object} applicationData - Application data
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const saveWorkExperienceApplication = async (userId, opportunityId, applicationData) => {
  try {
    // TODO: Save application to Supabase 'work_applications' table
    const { data, error } = await supabase
      .from('work_applications')
      .insert([
        {
          user_id: userId,
          opportunity_id: opportunityId,
          ...applicationData,
          created_at: new Date().toISOString(),
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving work experience application:', error);
    return { data: null, error };
  }
};
