import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

export const paymentMethodsProcedure = publicProcedure
  .query(() => {
    // Mock payment methods data
    return [
      {
        id: '1',
        type: 'card' as const,
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2027,
        isDefault: true,
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        type: 'apple_pay' as const,
        isDefault: false,
        created_at: '2024-02-01T10:00:00Z'
      }
    ];
  });

export const addPaymentMethodProcedure = publicProcedure
  .input(z.object({
    type: z.enum(['card', 'apple_pay', 'google_pay']),
    token: z.string().optional(),
    last4: z.string().optional(),
    brand: z.string().optional(),
    expiryMonth: z.number().optional(),
    expiryYear: z.number().optional(),
  }))
  .mutation(({ input }) => {
    console.log('Adding payment method:', input);
    
    return {
      success: true,
      paymentMethod: {
        id: Math.random().toString(36).substr(2, 9),
        ...input,
        isDefault: false,
        created_at: new Date().toISOString()
      }
    };
  });

export const removePaymentMethodProcedure = publicProcedure
  .input(z.object({
    id: z.string(),
  }))
  .mutation(({ input }) => {
    console.log('Removing payment method:', input.id);
    
    return {
      success: true,
      message: 'Payment method removed successfully'
    };
  });

export const setDefaultPaymentMethodProcedure = publicProcedure
  .input(z.object({
    id: z.string(),
  }))
  .mutation(({ input }) => {
    console.log('Setting default payment method:', input.id);
    
    return {
      success: true,
      message: 'Default payment method updated'
    };
  });