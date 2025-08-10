import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { CheckCircle, ArrowRight } from 'lucide-react-native';

export default function CompletionScreen() {
  const [progress] = useState(new Animated.Value(0));
  const [completionPercentage] = useState(85); // Mock completion percentage

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progress, {
      toValue: completionPercentage / 100,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [progress, completionPercentage]);

  const handleGoToDashboard = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <CheckCircle size={64} color={Colors.success} />
          </View>
          <Text style={styles.title}>Profile Ready!</Text>
          <Text style={styles.subtitle}>
            Your ConnectTime profile has been created successfully
          </Text>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Profile Completion</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  {
                    width: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{completionPercentage}%</Text>
          </View>
          
          <View style={styles.completionDetails}>
            <View style={styles.completionItem}>
              <CheckCircle size={16} color={Colors.success} />
              <Text style={styles.completionItemText}>Account created</Text>
            </View>
            <View style={styles.completionItem}>
              <CheckCircle size={16} color={Colors.success} />
              <Text style={styles.completionItemText}>Role selected</Text>
            </View>
            <View style={styles.completionItem}>
              <CheckCircle size={16} color={Colors.success} />
              <Text style={styles.completionItemText}>Profile information added</Text>
            </View>
            <View style={styles.completionItem}>
              <View style={styles.pendingIcon} />
              <Text style={styles.completionItemTextPending}>Email verification pending</Text>
            </View>
          </View>
        </View>

        <View style={styles.nextSteps}>
          <Text style={styles.nextStepsTitle}>What&apos;s Next?</Text>
          <View style={styles.nextStepsList}>
            <Text style={styles.nextStepItem}>• Complete email verification</Text>
            <Text style={styles.nextStepItem}>• Upload profile photos</Text>
            <Text style={styles.nextStepItem}>• Set your availability</Text>
            <Text style={styles.nextStepItem}>• Start connecting with others</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={handleGoToDashboard}
        >
          <Text style={styles.dashboardButtonText}>Go to Dashboard</Text>
          <ArrowRight size={20} color={Colors.white} style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  progressSection: {
    marginBottom: 40,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.success,
    minWidth: 40,
  },
  completionDetails: {
    gap: 12,
  },
  completionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  completionItemText: {
    fontSize: 14,
    color: Colors.text,
  },
  completionItemTextPending: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  pendingIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.gray300,
  },
  nextSteps: {
    marginBottom: 40,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  nextStepsList: {
    gap: 8,
  },
  nextStepItem: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  dashboardButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  dashboardButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  buttonIcon: {
    marginLeft: 8,
  },
});