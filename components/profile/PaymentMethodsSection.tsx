import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Plus, CreditCard, Smartphone } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PaymentMethodCard } from './PaymentMethodCard';
import { Colors } from '@/constants/colors';
import type { PaymentMethod } from '@/types';

interface PaymentMethodsSectionProps {
  paymentMethods: PaymentMethod[];
  onAddMethod: (method: Omit<PaymentMethod, 'id' | 'created_at'>) => void;
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
}

export const PaymentMethodsSection: React.FC<PaymentMethodsSectionProps> = ({
  paymentMethods,
  onAddMethod,
  onSetDefault,
  onRemove
}) => {
  const [showAddOptions, setShowAddOptions] = useState(false);

  const handleAddCard = () => {
    if (Platform.OS === 'web') {
      Alert.alert('Feature not available', 'Card management is not available on web');
      return;
    }
    
    // In a real app, integrate with Stripe or similar
    const mockCard: Omit<PaymentMethod, 'id' | 'created_at'> = {
      type: 'card',
      last4: '1234',
      brand: 'mastercard',
      expiryMonth: 12,
      expiryYear: 2028,
      isDefault: paymentMethods.length === 0,
    };
    
    onAddMethod(mockCard);
    setShowAddOptions(false);
  };

  const handleAddApplePay = () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Not available', 'Apple Pay is only available on iOS devices');
      return;
    }
    
    const mockApplePay: Omit<PaymentMethod, 'id' | 'created_at'> = {
      type: 'apple_pay',
      isDefault: paymentMethods.length === 0,
    };
    
    onAddMethod(mockApplePay);
    setShowAddOptions(false);
  };

  const handleAddGooglePay = () => {
    if (Platform.OS !== 'android') {
      Alert.alert('Not available', 'Google Pay is only available on Android devices');
      return;
    }
    
    const mockGooglePay: Omit<PaymentMethod, 'id' | 'created_at'> = {
      type: 'google_pay',
      isDefault: paymentMethods.length === 0,
    };
    
    onAddMethod(mockGooglePay);
    setShowAddOptions(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment Methods</Text>
        <TouchableOpacity 
          onPress={() => setShowAddOptions(!showAddOptions)}
          style={styles.addButton}
        >
          <Plus size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {paymentMethods.length === 0 ? (
        <Card style={styles.emptyCard}>
          <View style={styles.emptyContent}>
            <CreditCard size={32} color={Colors.gray300} />
            <Text style={styles.emptyTitle}>No payment methods</Text>
            <Text style={styles.emptyText}>Add a payment method to book services</Text>
          </View>
        </Card>
      ) : (
        <View style={styles.methodsList}>
          {paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              paymentMethod={method}
              onSetDefault={onSetDefault}
              onRemove={onRemove}
            />
          ))}
        </View>
      )}

      {showAddOptions && (
        <Card style={styles.addOptionsCard}>
          <Text style={styles.addOptionsTitle}>Add Payment Method</Text>
          
          <TouchableOpacity onPress={handleAddCard} style={styles.addOption}>
            <CreditCard size={20} color={Colors.text} />
            <Text style={styles.addOptionText}>Credit or Debit Card</Text>
          </TouchableOpacity>
          
          {Platform.OS === 'ios' && (
            <TouchableOpacity onPress={handleAddApplePay} style={styles.addOption}>
              <Smartphone size={20} color={Colors.text} />
              <Text style={styles.addOptionText}>Apple Pay</Text>
            </TouchableOpacity>
          )}
          
          {Platform.OS === 'android' && (
            <TouchableOpacity onPress={handleAddGooglePay} style={styles.addOption}>
              <Smartphone size={20} color={Colors.text} />
              <Text style={styles.addOptionText}>Google Pay</Text>
            </TouchableOpacity>
          )}
          
          <Button
            title="Cancel"
            onPress={() => setShowAddOptions(false)}
            variant="outline"
            style={styles.cancelButton}
          />
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray500,
    textAlign: 'center',
  },
  methodsList: {
    gap: 0,
  },
  addOptionsCard: {
    marginTop: 12,
  },
  addOptionsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  addOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  addOptionText: {
    fontSize: 16,
    color: Colors.text,
  },
  cancelButton: {
    marginTop: 16,
  },
});