import { createContext, useContext, useState, useEffect } from 'react';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('patheraUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simple authentication - replace with your backend API later
    const userData = {
      id: Date.now(),
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
    return { success: true };
  };

  const signup = (name, email, password) => {
    // Simple signup - replace with your backend API later
    const userData = {
      id: Date.now(),
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
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('patheraUser');
    setUser(null);
  };

  const updateProgress = (type) => {
    if (user) {
      const updatedUser = {
        ...user,
        progress: {
          ...user.progress,
          [type]: user.progress[type] + 1
        }
      };
      setUser(updatedUser);
      localStorage.setItem('patheraUser', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProgress,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
