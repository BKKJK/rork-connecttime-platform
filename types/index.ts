export interface Provider {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  description: string;
  categories: string[];
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  location: string;
  verified: boolean;
  availability: string[];
  sessionTypes: ('in-person' | 'video' | 'phone')[];
  gallery: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface Booking {
  id: string;
  providerId: string;
  provider: Provider;
  date: string;
  time: string;
  duration: number;
  sessionType: 'in-person' | 'video' | 'phone';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
}

export interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: 'client' | 'provider';
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  bio?: string;
  location?: string;
  phone?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  created_at: string;
}

export interface EarningsData {
  totalEarnings: number;
  thisMonth: number;
  lastMonth: number;
  pendingPayouts: number;
  completedSessions: number;
  averageRating: number;
  monthlyData: {
    month: string;
    earnings: number;
    sessions: number;
  }[];
}

export interface ProfileStats {
  totalBookings: number;
  completedSessions: number;
  totalSpent: number;
  favoriteProviders: number;
  averageRating?: number;
  reviewCount?: number;
}

// Auth API Types
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'provider';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserResponse {
  user: User;
}

export interface AuthError {
  message: string;
  field?: string;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface RequestResetPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}