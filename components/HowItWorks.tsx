import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Search, Calendar, MessageCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

const steps = [
  {
    icon: Search,
    title: 'Find',
    description: 'Browse verified providers and find the perfect match for your needs',
  },
  {
    icon: Calendar,
    title: 'Book',
    description: 'Schedule a session at your convenience with secure payment',
  },
  {
    icon: MessageCircle,
    title: 'Connect',
    description: 'Meet in person, video call, or phone call - your choice',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How it works</Text>
      <View style={styles.steps}>
        {steps.map((step, index) => (
          <View key={index} style={styles.step}>
            <View style={styles.iconContainer}>
              <step.icon size={24} color={Colors.primary} />
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: Colors.backgroundSecondary,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  steps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  step: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 20,
  },
});