import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

const mockMessages = [
  {
    id: '1',
    providerName: 'Sarah Chen',
    providerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'Looking forward to our session tomorrow!',
    timestamp: '2 hours ago',
    unread: true,
  },
  {
    id: '2',
    providerName: 'Marcus Johnson',
    providerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'Thanks for the great conversation today.',
    timestamp: '1 day ago',
    unread: false,
  },
];

export default function MessagesScreen() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.authPrompt}>
          <MessageCircle size={64} color={Colors.gray300} />
          <Text style={styles.authTitle}>Sign in to view messages</Text>
          <Text style={styles.authText}>
            Connect with providers and manage your conversations
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderMessage = ({ item }: { item: typeof mockMessages[0] }) => (
    <TouchableOpacity activeOpacity={0.8}>
      <Card style={styles.messageCard}>
        <View style={styles.messageHeader}>
          <Image source={{ uri: item.providerAvatar }} style={styles.avatar} />
          <View style={styles.messageInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.providerName}>{item.providerName}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
            <Text 
              style={[styles.lastMessage, item.unread && styles.unreadMessage]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>
          </View>
          {item.unread && <View style={styles.unreadDot} />}
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      <FlatList
        data={mockMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MessageCircle size={64} color={Colors.gray300} />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyText}>
              Start a conversation with a provider to see messages here
            </Text>
          </View>
        }
      />
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
  list: {
    padding: 24,
  },
  messageCard: {
    marginBottom: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  messageInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.gray400,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.gray600,
  },
  unreadMessage: {
    fontWeight: '600' as const,
    color: Colors.text,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 20,
  },
  authPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  authText: {
    fontSize: 14,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 20,
  },
});