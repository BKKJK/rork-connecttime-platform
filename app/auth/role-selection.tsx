import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/colors';
import { Users, UserCheck } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<'client' | 'provider' | null>(null);

  const handleContinue = () => {
    if (!selectedRole) return;
    
    if (selectedRole === 'client') {
      router.push('/auth/client-setup');
    } else {
      router.push('/auth/provider-setup');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>
            How would you like to use ConnectTime?
          </Text>
        </View>

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'client' && styles.roleCardSelected,
            ]}
            onPress={() => setSelectedRole('client')}
          >
            <View style={styles.roleIconContainer}>
              <Users size={32} color={selectedRole === 'client' ? Colors.primary : Colors.gray500} />
            </View>
            <Text style={[
              styles.roleTitle,
              selectedRole === 'client' && styles.roleTitleSelected,
            ]}>
              Client
            </Text>
            <Text style={styles.roleDescription}>
              Find & book providers for services, companionship, or consultation
            </Text>
            <View style={styles.roleFeatures}>
              <Text style={styles.featureText}>• Browse providers</Text>
              <Text style={styles.featureText}>• Book sessions</Text>
              <Text style={styles.featureText}>• Leave reviews</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'provider' && styles.roleCardSelected,
            ]}
            onPress={() => setSelectedRole('provider')}
          >
            <View style={styles.roleIconContainer}>
              <UserCheck size={32} color={selectedRole === 'provider' ? Colors.primary : Colors.gray500} />
            </View>
            <Text style={[
              styles.roleTitle,
              selectedRole === 'provider' && styles.roleTitleSelected,
            ]}>
              Provider
            </Text>
            <Text style={styles.roleDescription}>
              Offer your services, time, and expertise to earn money
            </Text>
            <View style={styles.roleFeatures}>
              <Text style={styles.featureText}>• Create your profile</Text>
              <Text style={styles.featureText}>• Set your rates</Text>
              <Text style={styles.featureText}>• Manage bookings</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedRole}
          style={[
            styles.continueButton,
            !selectedRole && styles.continueButtonDisabled,
          ]}
        />
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
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
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
  roleContainer: {
    gap: 16,
    marginBottom: 40,
  },
  roleCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  roleCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.gray50,
  },
  roleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  roleTitleSelected: {
    color: Colors.primary,
  },
  roleDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  roleFeatures: {
    alignSelf: 'stretch',
  },
  featureText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  continueButton: {
    marginTop: 'auto',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
});