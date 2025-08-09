import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { 
  Star, 
  MapPin, 
  Shield, 
  Phone, 
  Video, 
  Users,
  ArrowLeft
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { providers, reviews } from '@/data/mockData';

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const provider = providers.find(p => p.id === id);

  if (!provider) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Provider not found</Text>
      </SafeAreaView>
    );
  }

  const sessionTypeIcons = {
    'in-person': Users,
    'video': Video,
    'phone': Phone,
  };

  const handleBookNow = () => {
    router.push(`/booking/${provider.id}`);
  };

  const renderGalleryImage = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      onPress={() => setSelectedImageIndex(index)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item }}
        style={[
          styles.galleryImage,
          selectedImageIndex === index && styles.selectedGalleryImage
        ]}
      />
    </TouchableOpacity>
  );



  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: provider.name,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Image
            source={{ uri: provider.gallery[selectedImageIndex] || provider.avatar }}
            style={styles.heroImage}
          />
          {provider.gallery.length > 1 && (
            <FlatList
              data={provider.gallery}
              renderItem={renderGalleryImage}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.gallery}
            />
          )}
        </View>

        <View style={styles.content}>
          <Card style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Image source={{ uri: provider.avatar }} style={styles.avatar} />
              <View style={styles.profileInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{provider.name}</Text>
                  {provider.verified && (
                    <Shield size={20} color={Colors.primary} />
                  )}
                </View>
                <View style={styles.locationRow}>
                  <MapPin size={16} color={Colors.gray400} />
                  <Text style={styles.location}>{provider.location}</Text>
                </View>
                <View style={styles.ratingRow}>
                  <Star size={16} color={Colors.warning} fill={Colors.warning} />
                  <Text style={styles.rating}>{provider.rating}</Text>
                  <Text style={styles.reviewCount}>({provider.reviewCount} reviews)</Text>
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>${provider.hourlyRate}</Text>
                <Text style={styles.priceUnit}>/hour</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{provider.description}</Text>
          </Card>

          <Card style={styles.servicesCard}>
            <Text style={styles.sectionTitle}>Services</Text>
            <View style={styles.categories}>
              {provider.categories.map((category, index) => (
                <View key={index} style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{category}</Text>
                </View>
              ))}
            </View>
          </Card>

          <Card style={styles.sessionTypesCard}>
            <Text style={styles.sectionTitle}>Session Types</Text>
            <View style={styles.sessionTypes}>
              {provider.sessionTypes.map((type, index) => {
                const IconComponent = sessionTypeIcons[type];
                return (
                  <View key={index} style={styles.sessionType}>
                    <IconComponent size={20} color={Colors.primary} />
                    <Text style={styles.sessionTypeText}>
                      {type === 'in-person' ? 'In Person' : 
                       type === 'video' ? 'Video Call' : 'Phone Call'}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Card>

          <Card style={styles.reviewsCard}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {reviews.slice(0, 3).map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>{review.clientName}</Text>
                  <View style={styles.reviewRating}>
                    {[...Array(review.rating)].map((_, index) => (
                      <Star key={index} size={14} color={Colors.warning} fill={Colors.warning} />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.date).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>

      <View style={styles.bookingBar}>
        <View style={styles.bookingInfo}>
          <Text style={styles.bookingPrice}>${provider.hourlyRate}/hour</Text>
          <Text style={styles.bookingAvailability}>Available today</Text>
        </View>
        <Button
          title="Book Now"
          onPress={handleBookNow}
          variant="primary"
          style={styles.bookButton}
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
  heroSection: {
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  gallery: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  galleryImage: {
    width: 60,
    height: 40,
    borderRadius: 8,
    marginRight: 8,
    opacity: 0.7,
  },
  selectedGalleryImage: {
    opacity: 1,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: Colors.gray500,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  reviewCount: {
    fontSize: 16,
    color: Colors.gray400,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  priceUnit: {
    fontSize: 14,
    color: Colors.gray400,
  },
  descriptionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.gray700,
    lineHeight: 24,
  },
  servicesCard: {
    marginBottom: 16,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTag: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  sessionTypesCard: {
    marginBottom: 16,
  },
  sessionTypes: {
    gap: 12,
  },
  sessionType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sessionTypeText: {
    fontSize: 16,
    color: Colors.text,
  },
  reviewsCard: {
    marginBottom: 16,
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  reviewCard: {
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: Colors.gray700,
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.gray400,
  },
  bookingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingPrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  bookingAvailability: {
    fontSize: 14,
    color: Colors.success,
  },
  bookButton: {
    minWidth: 120,
  },
});