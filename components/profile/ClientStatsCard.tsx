import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, Heart, DollarSign, Star } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/colors';
import type { ProfileStats } from '@/types';

interface ClientStatsCardProps {
  stats: ProfileStats;
}

export const ClientStatsCard: React.FC<ClientStatsCardProps> = ({ stats }) => {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Calendar size={20} color={Colors.primary} />
          <Text style={styles.title}>Your Activity</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Calendar size={16} color={Colors.primary} />
          </View>
          <Text style={styles.statValue}>{stats.totalBookings}</Text>
          <Text style={styles.statLabel}>Total Bookings</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <DollarSign size={16} color={Colors.success} />
          </View>
          <Text style={styles.statValue}>${stats.totalSpent.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Spent</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Heart size={16} color={Colors.error} />
          </View>
          <Text style={styles.statValue}>{stats.favoriteProviders}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        
        {stats.averageRating && (
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Star size={16} color={Colors.warning} />
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.statValue}>{stats.averageRating}</Text>
              <Star size={12} color={Colors.warning} fill={Colors.warning} />
            </View>
            <Text style={styles.statLabel}>Your Rating</Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
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