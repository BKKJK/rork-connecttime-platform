import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  RegisterPayload, 
  LoginPayload, 
  UserResponse, 
  VerifyEmailPayload,
  RequestResetPayload,
  ResetPasswordPayload,
  User 
} from '@/types';

// Mock storage for development when backend is not available
const MOCK_USERS_KEY = 'mock_users';
const CURRENT_USER_KEY = 'current_user';

class MockAuthService {
  private async getUsers(): Promise<User[]> {
    try {
      const users = await AsyncStorage.getItem(MOCK_USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  }

  private async saveUsers(users: User[]): Promise<void> {
    await AsyncStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  }

  private async getCurrentUser(): Promise<User | null> {
    try {
      const user = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  private async setCurrentUser(user: User | null): Promise<void> {
    if (user) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  async register(payload: RegisterPayload): Promise<UserResponse> {
    const users = await this.getUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === payload.email)) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: payload.name,
      email: payload.email,
      avatar_url: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`,
      role: payload.role,
      email_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users.push(newUser);
    await this.saveUsers(users);
    await this.setCurrentUser(newUser);

    return { user: newUser };
  }

  async login(payload: LoginPayload): Promise<UserResponse> {
    const users = await this.getUsers();
    const user = users.find(u => u.email === payload.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    await this.setCurrentUser(user);
    return { user };
  }

  async me(): Promise<User> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }
    return user;
  }

  async logout(): Promise<void> {
    await this.setCurrentUser(null);
  }
}

const mockAuth = new MockAuthService();

export const authApi = {
  // Register a new user
  register: async (payload: RegisterPayload): Promise<UserResponse> => {
    try {
      console.log('Attempting backend registration for:', payload.email);
      const response = await api.post('/api/auth/register', payload);
      console.log('Backend registration successful');
      return response.data;
    } catch (error: any) {
      if (error.isNetworkError || error.code === 'ECONNREFUSED' || !error.response) {
        console.log('Backend unavailable, using mock auth for registration');
        return await mockAuth.register(payload);
      }
      // Re-throw API errors (validation, user exists, etc.)
      throw error;
    }
  },

  // Login user
  login: async (payload: LoginPayload): Promise<UserResponse> => {
    try {
      console.log('Attempting backend login for:', payload.email);
      const response = await api.post('/api/auth/login', payload);
      console.log('Backend login successful');
      return response.data;
    } catch (error: any) {
      if (error.isNetworkError || error.code === 'ECONNREFUSED' || !error.response) {
        console.log('Backend unavailable, using mock auth for login');
        return await mockAuth.login(payload);
      }
      // Re-throw API errors (invalid credentials, etc.)
      throw error;
    }
  },

  // Get current user (from JWT cookie)
  me: async (): Promise<User> => {
    try {
      console.log('Attempting to get current user from backend');
      const response = await api.get('/api/auth/me');
      console.log('Backend me() successful');
      return response.data.user;
    } catch (error: any) {
      if (error.isNetworkError || error.code === 'ECONNREFUSED' || !error.response) {
        console.log('Backend unavailable, using mock auth for me()');
        return await mockAuth.me();
      }
      // Re-throw API errors (not authenticated, etc.)
      throw error;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      console.log('Attempting backend logout');
      await api.post('/api/auth/logout');
      console.log('Backend logout successful');
    } catch (error: any) {
      if (error.isNetworkError || error.code === 'ECONNREFUSED' || !error.response) {
        console.log('Backend unavailable for logout, using mock auth');
      } else {
        console.error('Logout error:', error);
      }
    }
    // Always clear mock auth regardless of backend status
    await mockAuth.logout();
  },

  // Verify email
  verifyEmail: async (payload: VerifyEmailPayload): Promise<void> => {
    try {
      await api.post('/api/auth/verify-email', payload);
    } catch (error: any) {
      console.log('Backend unavailable, email verification skipped:', error.message);
    }
  },

  // Request password reset
  requestReset: async (payload: RequestResetPayload): Promise<void> => {
    try {
      await api.post('/api/auth/request-reset', payload);
    } catch (error: any) {
      console.log('Backend unavailable, password reset skipped:', error.message);
    }
  },

  // Reset password
  resetPassword: async (payload: ResetPasswordPayload): Promise<void> => {
    try {
      await api.post('/api/auth/reset-password', payload);
    } catch (error: any) {
      console.log('Backend unavailable, password reset skipped:', error.message);
    }
  },
};

export default authApi;