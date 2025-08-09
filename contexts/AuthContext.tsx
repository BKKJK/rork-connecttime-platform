import { useState, useEffect, useMemo, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from AsyncStorage on startup (fallback when API is not available)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Mock login function (fallback when API is not available)
  const mockLogin = useCallback(async (payload: LoginPayload) => {
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: payload.email,
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      role: 'client',
      email_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setError(null);
    console.log('Mock login successful:', mockUser.email);
  }, []);

  // Mock register function (fallback when API is not available)
  const mockRegister = useCallback(async (payload: RegisterPayload) => {
    const mockUser: User = {
      id: Date.now().toString(),
      name: payload.name,
      email: payload.email,
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      role: payload.role,
      email_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setError(null);
    console.log('Mock registration successful:', mockUser.email);
  }, []);

  // Mock logout function (fallback when API is not available)
  const mockLogout = useCallback(async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
    setError(null);
    console.log('Mock logout successful');
  }, []);



  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (payload: LoginPayload): Promise<void> => {
    setError(null);
    setIsLoading(true);
    try {
      await mockLogin(payload);
    } catch (err) {
      setError('Login failed');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [mockLogin]);

  const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
    setError(null);
    setIsLoading(true);
    try {
      await mockRegister(payload);
    } catch (err) {
      setError('Registration failed');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [mockRegister]);

  const logout = useCallback(async (): Promise<void> => {
    setError(null);
    setIsLoading(true);
    try {
      await mockLogout();
    } catch (err) {
      setError('Logout failed');
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [mockLogout]);

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