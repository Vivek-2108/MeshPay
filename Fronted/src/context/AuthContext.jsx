import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getAccountDetails } from '../services/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accountLoading, setAccountLoading] = useState(false);

  // Clear authentication state
  const logout = useCallback(() => {
    localStorage.removeItem('meshpay_token');
    localStorage.removeItem('meshpay_user');
    setUser(null);
    setToken(null);
    setAccount(null);
  }, []);

  // Fetch account (balance, accountNumber, vpa, name)
  const refreshAccount = useCallback(async () => {
    if (!token) return;
    setAccountLoading(true);
    try {
      const data = await getAccountDetails();
      if (data.success) {
        setAccount({
          accountNumber: data.accountNumber,
          balance: data.balance,
          currency: data.currency,
          status: data.status,
          vpa: data.user.vpa,
        });
      }
    } catch (error) {
      console.error('Failed to fetch account details:', error.message);
    } finally {
      setAccountLoading(false);
    }
  }, [token]);

  // Load token from storage on startup
  useEffect(() => {
    const storedToken = localStorage.getItem('meshpay_token');
    const storedUser = localStorage.getItem('meshpay_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Fetch account when token changes
  useEffect(() => {
    if (token) {
      refreshAccount();
    }
  }, [token, refreshAccount]);

  // Listen to global 401 unauthorized trigger
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, [logout]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      const userProfile = {
        _id: data._id,
        name: data.name,
        email: data.email,
        vpa: data.vpa || `${data.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}@upimesh`,
      };
      
      localStorage.setItem('meshpay_token', data.token);
      localStorage.setItem('meshpay_user', JSON.stringify(userProfile));
      
      setToken(data.token);
      setUser(userProfile);
      return userProfile;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await registerUser(name, email, password);
      const userProfile = {
        _id: data._id,
        name: data.name,
        email: data.email,
        vpa: data.vpa,
      };

      localStorage.setItem('meshpay_token', data.token);
      localStorage.setItem('meshpay_user', JSON.stringify(userProfile));

      setToken(data.token);
      setUser(userProfile);
      return userProfile;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    account,
    loading,
    accountLoading,
    login,
    register,
    logout,
    refreshAccount,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
