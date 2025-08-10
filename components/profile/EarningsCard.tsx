import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, DollarSign, Star } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/colors';
import type { EarningsData } from '@/types';

interface EarningsCardProps {
  earnings: EarningsData;
}

export const EarningsCard: React.FC<EarningsCardProps> = ({ earnings }) => {
  const monthlyChange = earnings.thisMonth - earnings.lastMonth;
  const changePercentage = earnings.lastMonth > 0 ? (monthlyChange / earnings.lastMonth) * 100 : 0;
  const isPositive = monthlyChange >= 0;

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <DollarSign size={20} color={Colors.primary} />
          <Text style={styles.title}>Earnings Overview</Text>
        </View>
        <View style={[styles.changeIndicator, { backgroundColor: isPositive ? Colors.success + '20' : Colors.error + '20' }]}>
          <TrendingUp size={12} color={isPositive ? Colors.success : Colors.error} />
          <Text style={[styles.changeText, { color: isPositive ? Colors.success : Colors.error }]}>
            {isPositive ? '+' : ''}{changePercentage.toFixed(1)}%
          </Text>
        </View>
      </View>

      <View style={styles.mainAmount}>
        <Text style={styles.totalEarnings}>${earnings.totalEarnings.toLocaleString()}</Text>
        <Text style={styles.totalLabel}>Total Earnings</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${earnings.thisMonth.toLocaleString()}</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${earnings.pendingPayouts.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{earnings.completedSessions}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.ratingRow}>
            <Star size={14} color={Colors.warning} fill={Colors.warning} />
            <Text style={styles.statValue}>{earnings.averageRating}</Text>
          </View>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  mainAmount: {
    alignItems: 'center',
    marginBottom: 24,
  },
  totalEarnings: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.gray500,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray500,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
});