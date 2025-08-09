import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Star } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  content,
  avatar,
  rating,
}) => {
  return (
    <Card style={styles.card}>
      <View style={styles.rating}>
        {[...Array(rating)].map((_, index) => (
          <Star key={index} size={16} color={Colors.warning} fill={Colors.warning} />
        ))}
      </View>
      <Text style={styles.content}>&ldquo;{content}&rdquo;</Text>
      <View style={styles.author}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginRight: 16,
    width: 280,
  },
  rating: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 12,
  },
  content: {
    fontSize: 14,
    color: Colors.gray700,
    lineHeight: 20,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  name: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  role: {
    fontSize: 12,
    color: Colors.gray500,
  },
});