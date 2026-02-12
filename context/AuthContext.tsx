'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  _id?: string;
  id?: string;
  email: string;
  name?: string;
  picture?: string;
  description?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await authAPI.getProfile();
      console.log('PROFILE RESPONSE:', data);
      setUser(data.user ?? data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await authAPI.login(email, password);
      await checkAuth();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

const signup = async (email: string, password: string, name?: string) => {
  try {
    await authAPI.register(email, password, name);

    // Ensure we load the authenticated user exactly like login does
    await checkAuth();

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Signup failed' };
  }
};

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}