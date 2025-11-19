import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUser, 
  onAuthStateChange 
} from '../services/authService';
import { getUserProfile } from '../services/databaseService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile from database
  const fetchUserProfile = useCallback(async (userId) => {
    try {
      // TODO: Uncomment when Supabase is configured
      // const { profile: userProfile, error } = await getUserProfile(userId);
      // if (error) throw error;
      // setProfile(userProfile);
      
      // Temporary: Use localStorage for now
      const storedUser = localStorage.getItem('patheraUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setProfile(userData);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // TODO: Uncomment when Supabase is configured
        // const { user: currentUser } = await getCurrentUser();
        // if (currentUser && mounted) {
        //   setUser(currentUser);
        //   await fetchUserProfile(currentUser.id);
        // }
        
        // Temporary: Check localStorage
        const storedUser = localStorage.getItem('patheraUser');
        if (storedUser && mounted) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setProfile(userData);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err.message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // TODO: Uncomment when Supabase is configured
    // Listen to auth state changes
    // const { data: { subscription } } = onAuthStateChange(async (event, session) => {
    //   if (session?.user && mounted) {
    //     setUser(session.user);
    //     await fetchUserProfile(session.user.id);
    //   } else if (mounted) {
    //     setUser(null);
    //     setProfile(null);
    //   }
    //   setLoading(false);
    // });

    return () => {
      mounted = false;
      // TODO: Uncomment when Supabase is configured
      // subscription?.unsubscribe();
    };
  }, [fetchUserProfile]);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      // TODO: Uncomment when Supabase is configured
      // const { user: authUser, error: authError } = await signIn(email, password);
      // if (authError) throw authError;
      // if (authUser) {
      //   await fetchUserProfile(authUser.id);
      // }
      // return { success: true, error: null };

      // Temporary: Use localStorage
      const userData = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        joinedDate: new Date().toISOString(),
        progress: {
          cvReviewsCompleted: 0,
          interviewsCompleted: 0,
          personalStatementsReviewed: 0,
        }
      };
      localStorage.setItem('patheraUser', JSON.stringify(userData));
      setUser(userData);
      setProfile(userData);
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to login';
      setError(errorMessage);
      console.error('Login error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name, email, password) => {
    try {
      setError(null);
      setLoading(true);

      // TODO: Uncomment when Supabase is configured
      // const { user: authUser, error: authError } = await signUp(email, password, name);
      // if (authError) throw authError;
      // if (authUser) {
      //   await fetchUserProfile(authUser.id);
      // }
      // return { success: true, error: null };

      // Temporary: Use localStorage
      const userData = {
        id: Date.now().toString(),
        email,
        name,
        joinedDate: new Date().toISOString(),
        progress: {
          cvReviewsCompleted: 0,
          interviewsCompleted: 0,
          personalStatementsReviewed: 0,
        }
      };
      localStorage.setItem('patheraUser', JSON.stringify(userData));
      setUser(userData);
      setProfile(userData);
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to sign up';
      setError(errorMessage);
      console.error('Signup error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError(null);
      
      // TODO: Uncomment when Supabase is configured
      // const { error: signOutError } = await signOut();
      // if (signOutError) throw signOutError;

      // Temporary: Remove from localStorage
      localStorage.removeItem('patheraUser');
      setUser(null);
      setProfile(null);
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err.message || 'Failed to logout';
      setError(errorMessage);
      console.error('Logout error:', err);
      return { success: false, error: errorMessage };
    }
  };

  // Update progress function
  const updateProgress = useCallback((type) => {
    if (profile) {
      // TODO: Uncomment when Supabase is configured
      // updateUserProgress(user.id, type);

      // Temporary: Update localStorage
      const updatedProfile = {
        ...profile,
        progress: {
          ...profile.progress,
          [type]: profile.progress[type] + 1
        }
      };
      setProfile(updatedProfile);
      localStorage.setItem('patheraUser', JSON.stringify(updatedProfile));
    }
  }, [profile]);

  const value = {
    user: profile, // Use profile which includes all user data
    loading,
    error,
    login,
    signup,
    logout,
    updateProgress,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
