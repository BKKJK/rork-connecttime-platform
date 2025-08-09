import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '@/lib/auth-api';
import { User, RegisterPayload, LoginPayload } from '@/types';

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

export const [AuthProvider, useAuth] = createContextHook((): AuthContextValue => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Query to get current user
  const { 
    data: user, 
    isLoading, 
    error: queryError 
  } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.me,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['me'], data.user);
      setError(null);
      console.log('Login successful:', data.user.email);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      console.error('Login error:', message);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      queryClient.setQueryData(['me'], data.user);
      setError(null);
      console.log('Registration successful:', data.user.email);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      console.error('Registration error:', message);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['me'], null);
      queryClient.clear(); // Clear all cached data
      setError(null);
      console.log('Logout successful');
    },
    onError: (error: any) => {
      // Even if logout fails on server, clear local state
      queryClient.setQueryData(['me'], null);
      queryClient.clear();
      const message = error.response?.data?.message || 'Logout failed';
      console.error('Logout error:', message);
    },
  });

  // Store user in AsyncStorage for offline access
  useEffect(() => {
    if (user) {
      AsyncStorage.setItem('lastUser', JSON.stringify(user));
    } else {
      AsyncStorage.removeItem('lastUser');
    }
  }, [user]);

  // Load last user from storage on app start (for offline display)
  useEffect(() => {
    const loadLastUser = async () => {
      try {
        const lastUser = await AsyncStorage.getItem('lastUser');
        if (lastUser && !user && !isLoading) {
          // Only use cached user if we don't have fresh data
          console.log('Loaded cached user data');
        }
      } catch (error) {
        console.error('Error loading cached user:', error);
      }
    };
    
    loadLastUser();
  }, [user, isLoading]);

  // Combine loading states
  const combinedLoading = isLoading || 
    loginMutation.isPending || 
    registerMutation.isPending || 
    logoutMutation.isPending;

  // Combine errors
  const combinedError = error || 
    (queryError as any)?.response?.data?.message || 
    (queryError as any)?.message;

  const clearError = () => setError(null);

  const login = async (payload: LoginPayload): Promise<void> => {
    setError(null);
    await loginMutation.mutateAsync(payload);
  };

  const register = async (payload: RegisterPayload): Promise<void> => {
    setError(null);
    await registerMutation.mutateAsync(payload);
  };

  const logout = async (): Promise<void> => {
    setError(null);
    await logoutMutation.mutateAsync();
  };

  return {
    user: user || null,
    isLoading: combinedLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    error: combinedError,
    clearError,
  };
});