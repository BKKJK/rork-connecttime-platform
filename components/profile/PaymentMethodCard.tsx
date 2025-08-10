import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { CreditCard, Smartphone, MoreVertical, Check } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/colors';
import type { PaymentMethod } from '@/types';

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ 
  paymentMethod, 
  onSetDefault, 
  onRemove 
}) => {
  const getIcon = () => {
    switch (paymentMethod.type) {
      case 'apple_pay':
        return <Smartphone size={20} color={Colors.text} />;
      case 'google_pay':
        return <Smartphone size={20} color={Colors.text} />;
      default:
        return <CreditCard size={20} color={Colors.text} />;
    }
  };

  const getDisplayName = () => {
    switch (paymentMethod.type) {
      case 'apple_pay':
        return 'Apple Pay';
      case 'google_pay':
        return 'Google Pay';
      default:
        return `${paymentMethod.brand?.toUpperCase()} •••• ${paymentMethod.last4}`;
    }
  };

  const getSubtitle = () => {
    if (paymentMethod.type === 'card' && paymentMethod.expiryMonth && paymentMethod.expiryYear) {
      return `Expires ${paymentMethod.expiryMonth.toString().padStart(2, '0')}/${paymentMethod.expiryYear}`;
    }
    return paymentMethod.type === 'apple_pay' ? 'Touch ID or Face ID' : 'Fingerprint or PIN';
  };

  const handleMoreOptions = () => {
    if (Platform.OS === 'web') {
      const action = window.confirm('Remove this payment method?');
      if (action) {
        onRemove(paymentMethod.id);
      }
    } else {
      Alert.alert(
        'Payment Method Options',
        '',
        [
          ...(!paymentMethod.isDefault ? [{
            text: 'Set as Default',
            onPress: () => onSetDefault(paymentMethod.id)
          }] : []),
          {
            text: 'Remove',
            style: 'destructive' as const,
            onPress: () => onRemove(paymentMethod.id)
          },
          {
            text: 'Cancel',
            style: 'cancel' as const
          }
        ]
      );
    }
  };

  return (
    <Card style={[styles.container, paymentMethod.isDefault && styles.defaultCard]}>
      <View style={styles.content}>
        <View style={styles.left}>
          <View style={styles.iconContainer}>
            {getIcon()}
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{getDisplayName()}</Text>
            <Text style={styles.subtitle}>{getSubtitle()}</Text>
          </View>
        </View>
        
        <View style={styles.right}>
          {paymentMethod.isDefault && (
            <View style={styles.defaultBadge}>
              <Check size={12} color={Colors.primary} />
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
          <TouchableOpacity 
            onPress={handleMoreOptions}
            style={styles.moreButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MoreVertical size={16} color={Colors.gray400} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  defaultCard: {
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    backgroundColor: Colors.primary + '05',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.gray500,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.primary + '20',
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  moreButton: {
    padding: 4,
  },
});