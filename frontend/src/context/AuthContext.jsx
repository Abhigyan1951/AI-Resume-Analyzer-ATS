import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Fetch latest user profile from backend using stored token
  const fetchProfile = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return null;
    }

    try {
      const response = await api.get('/auth/profile');
      if (response.data?.success && response.data?.data?.user) {
        const fetchedUser = response.data.data.user;
        setUser(fetchedUser);
        localStorage.setItem('user', JSON.stringify(fetchedUser));
        return fetchedUser;
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Clear invalid session on 401/403 or network failure
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  // Run initial session validation on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token: jwtToken } = response.data.data;

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(jwtToken);
      setUser(userData);

      return userData;
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid email or password. Please try again.';
      throw new Error(message);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { user: userData, token: jwtToken } = response.data.data;

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(jwtToken);
      setUser(userData);

      return userData;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Email may already be registered.';
      throw new Error(message);
    }
  };

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        fetchProfile,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
