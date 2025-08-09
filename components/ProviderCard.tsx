import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star, MapPin, Shield } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Provider } from '@/types';

interface ProviderCardProps {
  provider: Provider;
  onPress: () => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Image source={{ uri: provider.avatar }} style={styles.avatar} />
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{provider.name}</Text>
              {provider.verified && (
                <Shield size={16} color={Colors.primary} />
              )}
            </View>
            <View style={styles.locationRow}>
              <MapPin size={14} color={Colors.gray400} />
              <Text style={styles.location}>{provider.location}</Text>
            </View>
            <View style={styles.ratingRow}>
              <Star size={14} color={Colors.warning} fill={Colors.warning} />
              <Text style={styles.rating}>{provider.rating}</Text>
              <Text style={styles.reviewCount}>({provider.reviewCount})</Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${provider.hourlyRate}</Text>
            <Text style={styles.priceUnit}>/hour</Text>
          </View>
        </View>
        
        <Text style={styles.bio} numberOfLines={2}>
          {provider.bio}
        </Text>
        
        <View style={styles.categories}>
          {provider.categories.slice(0, 3).map((category, index) => (
            <View key={index} style={styles.categoryTag}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: Colors.gray500,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  reviewCount: {
    fontSize: 14,
    color: Colors.gray400,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  priceUnit: {
    fontSize: 12,
    color: Colors.gray400,
  },
  bio: {
    fontSize: 14,
    color: Colors.gray600,
    lineHeight: 20,
    marginBottom: 12,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTag: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.gray600,
    fontWeight: '500' as const,
  },
});