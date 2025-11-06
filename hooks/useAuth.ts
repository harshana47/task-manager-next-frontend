'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/auth';
import { User, LoginRequest } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authApi.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials);
      const newUser: User = {
        id: 0,
        username: response.username,
        email: response.email,
        role: response.role,
      };
      setUser(newUser);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    router.push('/login');
  }, [router]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
  };
}
