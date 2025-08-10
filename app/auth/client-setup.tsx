import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { User, MapPin, Globe, Clock, Camera, ArrowLeft } from 'lucide-react-native';

interface FormData {
  bio: string;
  language: string;
  city: string;
  country: string;
  timeZone: string;
}

interface FormErrors {
  bio?: string;
  language?: string;
  city?: string;
  country?: string;
  timeZone?: string;
}

export default function ClientSetupScreen() {
  const [formData, setFormData] = useState<FormData>({
    bio: '',
    language: 'English',
    city: '',
    country: '',
    timeZone: 'UTC',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.bio.trim() && formData.bio.trim().length < 10) {
      newErrors.bio = 'Bio must be at least 10 characters if provided';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAndContinue = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Save profile data to backend
      console.log('Saving client profile:', formData);
      
      // Navigate to completion screen
      router.push('/auth/completion');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Profile Setup?',
      'You can complete your profile later, but some features may be limited.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', onPress: () => router.push('/auth/completion') },
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>Help providers understand who you are</Text>
          </View>

          <View style={styles.form}>
            {/* Avatar Upload */}
            <View style={styles.avatarSection}>
              <TouchableOpacity style={styles.avatarContainer}>
                <View style={styles.avatarPlaceholder}>
                  <Camera size={24} color={Colors.gray400} />
                </View>
                <Text style={styles.avatarText}>Add Photo</Text>
              </TouchableOpacity>
            </View>

            {/* Bio */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio (Optional)</Text>
              <View style={styles.inputContainer}>
                <User size={20} color={Colors.gray400} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textArea, errors.bio && styles.inputError]}
                  value={formData.bio}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, bio: text }));
                    if (errors.bio) setErrors(prev => ({ ...prev, bio: undefined }));
                  }}
                  placeholder="Tell providers a bit about yourself..."
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
              {errors.bio && <Text style={styles.errorText}>{errors.bio}</Text>}
            </View>

            {/* Language */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preferred Language</Text>
              <View style={styles.inputContainer}>
                <Globe size={20} color={Colors.gray400} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.language}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, language: text }))}
                  placeholder="English"
                />
              </View>
            </View>

            {/* Location */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>City</Text>
                <View style={styles.inputContainer}>
                  <MapPin size={20} color={Colors.gray400} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.city && styles.inputError]}
                    value={formData.city}
                    onChangeText={(text) => {
                      setFormData(prev => ({ ...prev, city: text }));
                      if (errors.city) setErrors(prev => ({ ...prev, city: undefined }));
                    }}
                    placeholder="New York"
                  />
                </View>
                {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Country</Text>
                <View style={styles.inputContainer}>
                  <Globe size={20} color={Colors.gray400} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.country && styles.inputError]}
                    value={formData.country}
                    onChangeText={(text) => {
                      setFormData(prev => ({ ...prev, country: text }));
                      if (errors.country) setErrors(prev => ({ ...prev, country: undefined }));
                    }}
                    placeholder="United States"
                  />
                </View>
                {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
              </View>
            </View>

            {/* Time Zone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time Zone</Text>
              <View style={styles.inputContainer}>
                <Clock size={20} color={Colors.gray400} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.timeZone}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, timeZone: text }))}
                  placeholder="UTC"
                />
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSaveAndContinue}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? 'Saving...' : 'Save & Continue'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSkip}
            >
              <Text style={styles.secondaryButtonText}>Skip for Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    paddingLeft: 12,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    flex: 1,
    padding: 16,
    paddingLeft: 12,
    fontSize: 16,
    color: Colors.text,
    minHeight: 80,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 32,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '500' as const,
  },
});