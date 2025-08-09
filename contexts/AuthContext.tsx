import { useState, useEffect, useMemo, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { User, RegisterPayload, LoginPayload } from '@/types';
import { authApi } from '@/lib/auth-api';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from API on startup
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await authApi.me();
        setUser(userData);
        console.log('User loaded from API:', userData.email);
      } catch (error) {
        console.log('No authenticated user found');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (payload: LoginPayload): Promise<void> => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await authApi.login(payload);
      setUser(response.user);
      console.log('Login successful:', response.user.email);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await authApi.register(payload);
      setUser(response.user);
      console.log('Registration successful:', response.user.email);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      console.error('Registration error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setError(null);
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      console.log('Logout successful');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Logout failed';
      setError(errorMessage);
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return useMemo((): AuthContextValue => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    error,
    clearError,
  }), [user, isLoading, login, register, logout, error, clearError]);
});