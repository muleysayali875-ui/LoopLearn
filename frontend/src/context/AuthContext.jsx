import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  loginApi,
  registerApi,
  logoutApi,
  getMeApi,
} from '../services/auth.api.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check initial authentication on mount
  const checkAuth = useCallback(async () => {
    try {
      const data = await getMeApi();
      if (data?.data?.user) {
        setUser(data.data.user);
      }
    } catch {
      // Session not active, user is unauthenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await loginApi({ email, password });
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      setError(err.message || 'Login failed.');
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await registerApi({ name, email, password });
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      setError(err.message || 'Registration failed.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.warn('Logout error:', err.message);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
