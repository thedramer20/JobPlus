import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On app start, check if JWT token exists and is valid
    const token = localStorage.getItem('jp_token');
    if (token) {
      authAPI.getMe(token)
        .then(data => setUser(data))
        .catch(() => localStorage.removeItem('jp_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signOut = () => {
    localStorage.removeItem('jp_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);