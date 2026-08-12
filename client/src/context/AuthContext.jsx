import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('aidocpad_token');
      if (token) {
        try {
          const res = await api.me();
          if (res.success) {
            setUser(res.user);
          } else {
            localStorage.removeItem('aidocpad_token');
          }
        } catch (err) {
          console.warn('Auth check failed:', err.message);
          localStorage.removeItem('aidocpad_token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (identifier, password) => {
    setError(null);
    try {
      const res = await api.login({ identifier, password });
      if (res.success) {
        localStorage.setItem('aidocpad_token', res.token);
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('aidocpad_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
