import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

export const profileStatsProcedure = publicProcedure
  .query(() => {
    // Mock data for now - replace with real database queries
    const mockEarnings = {
      totalEarnings: 12450.00,
      thisMonth: 2340.00,
      lastMonth: 1890.00,
      pendingPayouts: 450.00,
      completedSessions: 87,
      averageRating: 4.8,
      monthlyData: [
        { month: 'Jan', earnings: 1200, sessions: 12 },
        { month: 'Feb', earnings: 1890, sessions: 18 },
        { month: 'Mar', earnings: 2340, sessions: 23 },
        { month: 'Apr', earnings: 2100, sessions: 20 },
        { month: 'May', earnings: 2450, sessions: 24 },
        { month: 'Jun', earnings: 2470, sessions: 25 },
      ]
    };

    const mockClientStats = {
      totalBookings: 24,
      completedSessions: 22,
      totalSpent: 3240.00,
      favoriteProviders: 8,
      averageRating: 4.9,
      reviewCount: 18
    };

    // Return different data based on user role
    return {
      earnings: mockEarnings,
      clientStats: mockClientStats
    };
  });

export const updateProfileProcedure = publicProcedure
  .input(z.object({
    name: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    phone: z.string().optional(),
    avatar_url: z.string().optional(),
  }))
  .mutation(({ input }) => {
    console.log('Updating profile with:', input);
    
    // Mock response - replace with real database update
    return {
      success: true,
      message: 'Profile updated successfully'
    };
  });