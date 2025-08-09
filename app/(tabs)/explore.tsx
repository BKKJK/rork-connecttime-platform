import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { SearchBar } from '@/components/ui/SearchBar';
import { ProviderCard } from '@/components/ProviderCard';
import { providers } from '@/data/mockData';

export default function ExploreScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProviders = useMemo(() => {
    let filtered = providers;

    if (searchQuery) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.categories.some(cat => 
          cat.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (category) {
      // Map category ID to category name
      const categoryMap: { [key: string]: string } = {
        '1': 'Conversation',
        '2': 'Coaching',
        '3': 'Local Tours',
        '4': 'Language Practice',
        '5': 'Companionship',
        '6': 'Mentoring',
      };
      
      const categoryName = categoryMap[category];
      if (categoryName) {
        filtered = filtered.filter(provider =>
          provider.categories.includes(categoryName)
        );
      }
    }

    return filtered;
  }, [searchQuery, category]);

  const handleProviderPress = (providerId: string) => {
    router.push(`/provider/${providerId}`);
  };

  const renderProvider = ({ item }: { item: typeof providers[0] }) => (
    <ProviderCard
      provider={item}
      onPress={() => handleProviderPress(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Providers</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, service, or location..."
        />
      </View>

      <FlatList
        data={filteredProviders}
        renderItem={renderProvider}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No providers found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search criteria or browse all providers
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
    marginBottom: 16,
  },
  list: {
    padding: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 20,
  },
});