import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[AuthContext] Starting auth check...');
    
    // On app start, check if JWT token exists and is valid
    const token = localStorage.getItem('jp_token');
    
    // Set a hard timeout to prevent infinite loading
    // If nothing resolves within 5 seconds, force loading to false
    const timeoutId = setTimeout(() => {
      console.warn('[AuthContext] Auth check timed out after 5 seconds, forcing completion');
      setLoading(false);
    }, 5000);

    if (token) {
      console.log('[AuthContext] Token found, verifying with backend...');
      authAPI.getMe(token)
        .then(data => {
          console.log('[AuthContext] Auth verified successfully');
          setUser(data);
          setLoading(false);
          clearTimeout(timeoutId);
        })
        .catch(error => {
          console.warn('[AuthContext] Auth verification failed:', error.message);
          // Token is invalid or expired - clear it
          localStorage.removeItem('jp_token');
          setUser(null);
          setLoading(false);
          clearTimeout(timeoutId);
        });
    } else {
      // No token - user is not logged in
      console.log('[AuthContext] No token found, proceeding as unauthenticated');
      setLoading(false);
      clearTimeout(timeoutId);
    }

    // Cleanup timeout if component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const signOut = () => {
    console.log('[AuthContext] Signing out');
    localStorage.removeItem('jp_token');
    setUser(null);
  };

  const value = {
    user,
    setUser,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};