import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await api.getProfile();
      setUser(profile);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      // If profile fetch fails, token might be expired
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchProfile();
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, [token, fetchProfile]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.login(email, password);
      // Response contains accessToken directly
      setToken(response.accessToken);
      return response;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signup = async (email, password, name) => {
    setLoading(true);
    try {
      const newUser = await api.signup(email, password, name);
      // Automatically log in after signup by calling login
      await login(email, password);
      return newUser;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const refreshProfile = async () => {
    if (token) {
      await fetchProfile();
    }
  };

  const isManager = user?.roles?.includes('HOTEL_MANAGER') || user?.roles?.some(r => r === 'HOTEL_MANAGER') || false;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isManager,
        login,
        signup,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
