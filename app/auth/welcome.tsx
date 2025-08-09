import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/colors';
import { User } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const handleSignIn = () => {
    router.push('/auth/login');
  };

  const handleCreateAccount = () => {
    router.push('/auth/register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <User size={48} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Welcome to ConnectTime</Text>
          <Text style={styles.subtitle}>
            Sign in to access your profile and manage your bookings
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Sign In"
            onPress={handleSignIn}
            style={styles.signInButton}
          />
          
          <Button
            title="Create Account"
            onPress={handleCreateAccount}
            variant="outline"
            style={styles.createAccountButton}
          />
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.8,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  signInButton: {
    width: '100%',
  },
  createAccountButton: {
    width: '100%',
  },
});