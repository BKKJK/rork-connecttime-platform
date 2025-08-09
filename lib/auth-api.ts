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
      const response = await api.post('/api/auth/register', payload);
      return response.data;
    } catch (error: any) {
      console.log('Backend unavailable, using mock auth:', error.message);
      return await mockAuth.register(payload);
    }
  },

  // Login user
  login: async (payload: LoginPayload): Promise<UserResponse> => {
    try {
      const response = await api.post('/api/auth/login', payload);
      return response.data;
    } catch (error: any) {
      console.log('Backend unavailable, using mock auth:', error.message);
      return await mockAuth.login(payload);
    }
  },

  // Get current user (from JWT cookie)
  me: async (): Promise<User> => {
    try {
      const response = await api.get('/api/auth/me');
      return response.data.user;
    } catch (error: any) {
      console.log('Backend unavailable, using mock auth:', error.message);
      return await mockAuth.me();
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post('/api/auth/logout');
    } catch (error: any) {
      console.log('Backend unavailable, using mock auth:', error.message);
    }
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