import React from 'react';
import { ScrollView, View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { HeroSection } from '@/components/HeroSection';
import { ServiceCard } from '@/components/ServiceCard';
import { ProviderCard } from '@/components/ProviderCard';
import { HowItWorks } from '@/components/HowItWorks';
import { TestimonialCard } from '@/components/TestimonialCard';
import { services, providers, testimonials } from '@/data/mockData';

export default function HomeScreen() {
  const featuredProviders = providers.slice(0, 3);

  const handleGetStarted = () => {
    router.push('/(tabs)/explore');
  };

  const handleServicePress = (serviceId: string) => {
    router.push({ pathname: '/(tabs)/explore', params: { category: serviceId } });
  };

  const handleProviderPress = (providerId: string) => {
    router.push(`/provider/${providerId}` as any);
  };

  const renderService = ({ item }: { item: typeof services[0] }) => (
    <View style={styles.serviceItem}>
      <ServiceCard
        service={item}
        onPress={() => handleServicePress(item.id)}
      />
    </View>
  );

  const renderTestimonial = ({ item }: { item: typeof testimonials[0] }) => (
    <TestimonialCard
      name={item.name}
      role={item.role}
      content={item.content}
      avatar={item.avatar}
      rating={item.rating}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeroSection onGetStarted={handleGetStarted} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <FlatList
            data={services}
            renderItem={renderService}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.servicesGrid}
          />
        </View>

        <HowItWorks />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Providers</Text>
          {featuredProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onPress={() => handleProviderPress(provider.id)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What our users say</Text>
          <FlatList
            data={testimonials}
            renderItem={renderTestimonial}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testimonialsList}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Join thousands of people making meaningful connections
          </Text>
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
  section: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 20,
  },
  servicesGrid: {
    gap: 16,
  },
  serviceItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  testimonialsList: {
    paddingLeft: 24,
  },
  footer: {
    backgroundColor: Colors.backgroundSecondary,
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 18,
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 24,
  },
});