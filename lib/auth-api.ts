import { api } from './api';
import { 
  RegisterPayload, 
  LoginPayload, 
  UserResponse, 
  VerifyEmailPayload,
  RequestResetPayload,
  ResetPasswordPayload,
  User 
} from '@/types';

export const authApi = {
  // Register a new user
  register: async (payload: RegisterPayload): Promise<UserResponse> => {
    const response = await api.post('/api/auth/register', payload);
    return response.data;
  },

  // Login user
  login: async (payload: LoginPayload): Promise<UserResponse> => {
    const response = await api.post('/api/auth/login', payload);
    return response.data;
  },

  // Get current user (from JWT cookie)
  me: async (): Promise<User> => {
    const response = await api.get('/api/auth/me');
    return response.data.user;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

  // Verify email
  verifyEmail: async (payload: VerifyEmailPayload): Promise<void> => {
    await api.post('/api/auth/verify-email', payload);
  },

  // Request password reset
  requestReset: async (payload: RequestResetPayload): Promise<void> => {
    await api.post('/api/auth/request-reset', payload);
  },

  // Reset password
  resetPassword: async (payload: ResetPasswordPayload): Promise<void> => {
    await api.post('/api/auth/reset-password', payload);
  },
};

export default authApi;