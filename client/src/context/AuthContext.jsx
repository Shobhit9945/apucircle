import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    try {
      const { data } = await api.get('/users/me');
      setUser(data.user);
      return data.user;
    } catch (_error) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMe();
  }, []);

  async function login(payload) {
    const { data } = await api.post('/auth/login', payload);
    setUser(data.user);
    return data.user;
  }

  async function staffLogin(payload) {
    const { data } = await api.post('/auth/staff/login', payload);
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload);
    return data;
  }

  async function resendVerification(email) {
    const { data } = await api.post('/auth/resend-verification', { email });
    return data;
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
    }
  }

  async function updateProfile(payload) {
    const { data } = await api.put('/users/me', payload);
    setUser(data.user);
    return data.user;
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isStaff: user?.role === 'staff',
      login,
      staffLogin,
      register,
      resendVerification,
      logout,
      updateProfile,
      refreshUser: loadMe
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
