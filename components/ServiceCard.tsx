import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  MessageCircle, 
  Target, 
  MapPin, 
  Globe, 
  Heart, 
  Users 
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Service } from '@/types';

const iconMap = {
  MessageCircle,
  Target,
  MapPin,
  Globe,
  Heart,
  Users,
};

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
  const IconComponent = iconMap[service.icon as keyof typeof iconMap];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        <View style={[styles.iconContainer, { backgroundColor: service.color + '20' }]}>
          <IconComponent size={24} color={service.color} />
        </View>
        <Text style={styles.title}>{service.title}</Text>
        <Text style={styles.description}>{service.description}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 16,
  },
});