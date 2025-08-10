import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import { User, RegisterPayload, LoginPayload } from '@/types';
import { authApi } from '@/lib/auth-api';
import { healthCheck } from '@/lib/api';

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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from API on startup
  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log('Loading user on app startup...');
        
        // Check if backend is available
        const isBackendHealthy = await healthCheck();
        if (isBackendHealthy) {
          console.log('Backend is healthy, attempting to load user');
        } else {
          console.log('Backend health check failed, will use mock auth if needed');
        }
        
        const userData = await authApi.me();
        setUser(userData);
        console.log('User loaded from API:', userData.email);
      } catch (error: any) {
        console.log('No authenticated user found or backend unavailable:', error.message);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<void> => {
    setError(null);
    setIsLoading(true);
    try {
      console.log('Attempting login for:', payload.email);
      const response = await authApi.login(payload);
      setUser(response.user);
      console.log('Login successful:', response.user.email);
    } catch (err: any) {
      let errorMessage = 'Login failed';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
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
      console.log('Attempting registration for:', payload.email);
      const response = await authApi.register(payload);
      setUser(response.user);
      console.log('Registration successful:', response.user.email);
    } catch (err: any) {
      let errorMessage = 'Registration failed';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
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
      console.log('Attempting logout...');
      await authApi.logout();
      setUser(null);
      console.log('Logout successful');
    } catch (err: any) {
      let errorMessage = 'Logout failed';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo((): AuthContextValue => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    error,
    clearError,
  }), [user, isLoading, login, register, logout, error, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};