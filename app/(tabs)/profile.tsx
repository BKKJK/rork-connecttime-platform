import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Settings, 
  Calendar, 
  CreditCard, 
  Star, 
  Shield,
  LogOut,
  ChevronRight,
  Bell,
  HelpCircle,
  FileText
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { EarningsCard } from '@/components/profile/EarningsCard';
import { ClientStatsCard } from '@/components/profile/ClientStatsCard';
import { PaymentMethodsSection } from '@/components/profile/PaymentMethodsSection';
import { trpc } from '@/lib/trpc';
import type { PaymentMethod } from '@/types';

const menuItems = [
  { icon: Calendar, title: 'My Bookings', subtitle: 'View upcoming and past sessions' },
  { icon: CreditCard, title: 'Payment Methods', subtitle: 'Manage cards and billing' },
  { icon: Star, title: 'Reviews', subtitle: 'See reviews you\'ve received' },
  { icon: Shield, title: 'Verification', subtitle: 'Verify your identity' },
  { icon: Settings, title: 'Settings', subtitle: 'Privacy and notifications' },
];

export default function ProfileScreen() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.authPrompt}>
          <User size={64} color={Colors.gray300} />
          <Text style={styles.authTitle}>Welcome to ConnectTime</Text>
          <Text style={styles.authText}>
            Sign in to access your profile and manage your bookings
          </Text>
          <View style={styles.authButtons}>
            <Button
              title="Sign In"
              onPress={() => {/* Handle sign in */}}
              variant="primary"
              style={styles.authButton}
            />
            <Button
              title="Create Account"
              onPress={() => {/* Handle sign up */}}
              variant="outline"
              style={styles.authButton}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: user?.avatar_url }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{user?.name}</Text>
                {user?.email_verified && (
                  <Shield size={16} color={Colors.primary} />
                )}
              </View>
              <Text style={styles.email}>{user?.email}</Text>
              <Text style={styles.userType}>
                {user?.role === 'provider' ? 'Provider' : 'Client'}
              </Text>
            </View>
          </View>
        </Card>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} activeOpacity={0.8}>
              <Card style={styles.menuItem}>
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIconContainer}>
                      <item.icon size={20} color={Colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.menuTitle}>{item.title}</Text>
                      <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color={Colors.gray400} />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.8}>
            <Card style={styles.logoutCard}>
              <View style={styles.logoutContent}>
                <LogOut size={20} color={Colors.error} />
                <Text style={styles.logoutText}>Sign Out</Text>
              </View>
            </Card>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>ConnectTime v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  profileCard: {
    margin: 24,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  email: {
    fontSize: 14,
    color: Colors.gray500,
    marginBottom: 4,
  },
  userType: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500' as const,
    textTransform: 'uppercase',
  },
  menuSection: {
    paddingHorizontal: 24,
  },
  menuItem: {
    marginBottom: 8,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: Colors.gray500,
  },
  logoutSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  logoutCard: {
    backgroundColor: Colors.error + '10',
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  version: {
    fontSize: 12,
    color: Colors.gray400,
  },
  authPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  authText: {
    fontSize: 14,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  authButtons: {
    width: '100%',
    gap: 12,
  },
  authButton: {
    width: '100%',
  },
});