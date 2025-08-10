import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Edit3, Shield, MapPin, Phone } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/colors';
import type { User } from '@/types';

interface ProfileHeaderProps {
  user: User;
  onUpdateProfile: (updates: Partial<User>) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onUpdateProfile }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarPress = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Feature not available', 'Image upload is not available on web');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setIsUploading(true);
      try {
        // In a real app, upload to your storage service here
        const newAvatarUrl = result.assets[0].uri;
        onUpdateProfile({ avatar_url: newAvatarUrl });
      } catch {
        Alert.alert('Upload failed', 'Please try again');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Card style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleAvatarPress} style={styles.avatarContainer}>
            <Image 
              source={{ uri: user.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }} 
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.cameraOverlay}>
              <Camera size={16} color={Colors.white} />
            </View>
            {isUploading && (
              <View style={styles.uploadingOverlay}>
                <Text style={styles.uploadingText}>Uploading...</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.name}</Text>
            {user.email_verified && (
              <Shield size={16} color={Colors.primary} />
            )}
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={14} color={Colors.gray500} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.email}>{user.email}</Text>
          
          <View style={styles.roleContainer}>
            <Text style={styles.role}>
              {user.role === 'provider' ? 'Service Provider' : 'Client'}
            </Text>
          </View>

          {user.bio && (
            <Text style={styles.bio}>{user.bio}</Text>
          )}

          <View style={styles.detailsRow}>
            {user.location && (
              <View style={styles.detailItem}>
                <MapPin size={12} color={Colors.gray400} />
                <Text style={styles.detailText}>{user.location}</Text>
              </View>
            )}
            {user.phone && (
              <View style={styles.detailItem}>
                <Phone size={12} color={Colors.gray400} />
                <Text style={styles.detailText}>{user.phone}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarSection: {
    marginRight: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '600' as const,
  },
  userInfo: {
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
    fontWeight: '700' as const,
    color: Colors.text,
    flex: 1,
  },
  editButton: {
    padding: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.gray500,
    marginBottom: 8,
  },
  roleContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.primary + '20',
    borderRadius: 12,
    marginBottom: 8,
  },
  role: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  bio: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: Colors.gray500,
  },
});