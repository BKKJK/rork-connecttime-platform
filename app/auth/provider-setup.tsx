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
import { 
  User, 
  MapPin, 
  Globe, 
  Clock, 
  Camera, 
  ArrowLeft, 
  DollarSign,
  FileText,
  Tag,
  Video,
  Phone,
  Users
} from 'lucide-react-native';

interface FormData {
  bio: string;
  language: string;
  city: string;
  country: string;
  timeZone: string;
  hourlyRate: string;
  categories: string[];
  sessionTypes: string[];
  headline: string;
  description: string;
}

interface FormErrors {
  bio?: string;
  language?: string;
  city?: string;
  country?: string;
  timeZone?: string;
  hourlyRate?: string;
  categories?: string;
  sessionTypes?: string;
  headline?: string;
  description?: string;
}

const AVAILABLE_CATEGORIES = [
  'Coaching', 'Consulting', 'Therapy', 'Tutoring', 'Fitness', 'Music', 'Art', 'Business'
];

const SESSION_TYPES = [
  { id: 'in-person', label: 'In Person', icon: Users },
  { id: 'video', label: 'Video Call', icon: Video },
  { id: 'phone', label: 'Phone Call', icon: Phone },
];

export default function ProviderSetupScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    bio: '',
    language: 'English',
    city: '',
    country: '',
    timeZone: 'UTC',
    hourlyRate: '',
    categories: [],
    sessionTypes: [],
    headline: '',
    description: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      if (!formData.country.trim()) {
        newErrors.country = 'Country is required';
      }
    } else if (step === 2) {
      if (!formData.hourlyRate.trim()) {
        newErrors.hourlyRate = 'Hourly rate is required';
      } else if (isNaN(Number(formData.hourlyRate)) || Number(formData.hourlyRate) <= 0) {
        newErrors.hourlyRate = 'Please enter a valid hourly rate';
      }
      if (formData.categories.length === 0) {
        newErrors.categories = 'Please select at least one category';
      }
      if (formData.sessionTypes.length === 0) {
        newErrors.sessionTypes = 'Please select at least one session type';
      }
      if (!formData.headline.trim()) {
        newErrors.headline = 'Headline is required';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.trim().length < 50) {
        newErrors.description = 'Description must be at least 50 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // TODO: Save provider profile data to backend
      console.log('Saving provider profile:', formData);
      
      // Navigate to completion screen
      router.push('/auth/completion');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: undefined }));
    }
  };

  const toggleSessionType = (sessionType: string) => {
    setFormData(prev => ({
      ...prev,
      sessionTypes: prev.sessionTypes.includes(sessionType)
        ? prev.sessionTypes.filter(s => s !== sessionType)
        : [...prev.sessionTypes, sessionType]
    }));
    if (errors.sessionTypes) {
      setErrors(prev => ({ ...prev, sessionTypes: undefined }));
    }
  };

  const renderStep1 = () => (
    <>
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
            placeholder="Tell clients about your background..."
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
    </>
  );

  const renderStep2 = () => (
    <>
      {/* Hourly Rate */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Hourly Rate (USD)</Text>
        <View style={styles.inputContainer}>
          <DollarSign size={20} color={Colors.gray400} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, errors.hourlyRate && styles.inputError]}
            value={formData.hourlyRate}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, hourlyRate: text }));
              if (errors.hourlyRate) setErrors(prev => ({ ...prev, hourlyRate: undefined }));
            }}
            placeholder="50"
            keyboardType="numeric"
          />
        </View>
        {errors.hourlyRate && <Text style={styles.errorText}>{errors.hourlyRate}</Text>}
      </View>

      {/* Categories */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Categories</Text>
        <View style={styles.chipContainer}>
          {AVAILABLE_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.chip,
                formData.categories.includes(category) && styles.chipSelected,
              ]}
              onPress={() => toggleCategory(category)}
            >
              <Text style={[
                styles.chipText,
                formData.categories.includes(category) && styles.chipTextSelected,
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.categories && <Text style={styles.errorText}>{errors.categories}</Text>}
      </View>

      {/* Session Types */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Session Types</Text>
        <View style={styles.sessionTypeContainer}>
          {SESSION_TYPES.map((type) => {
            const IconComponent = type.icon;
            return (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.sessionTypeCard,
                  formData.sessionTypes.includes(type.id) && styles.sessionTypeCardSelected,
                ]}
                onPress={() => toggleSessionType(type.id)}
              >
                <IconComponent 
                  size={24} 
                  color={formData.sessionTypes.includes(type.id) ? Colors.primary : Colors.gray400} 
                />
                <Text style={[
                  styles.sessionTypeText,
                  formData.sessionTypes.includes(type.id) && styles.sessionTypeTextSelected,
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.sessionTypes && <Text style={styles.errorText}>{errors.sessionTypes}</Text>}
      </View>

      {/* Headline */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Professional Headline</Text>
        <View style={styles.inputContainer}>
          <Tag size={20} color={Colors.gray400} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, errors.headline && styles.inputError]}
            value={formData.headline}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, headline: text }));
              if (errors.headline) setErrors(prev => ({ ...prev, headline: undefined }));
            }}
            placeholder="e.g., Certified Life Coach & Wellness Expert"
          />
        </View>
        {errors.headline && <Text style={styles.errorText}>{errors.headline}</Text>}
      </View>

      {/* Description */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Service Description</Text>
        <View style={styles.inputContainer}>
          <FileText size={20} color={Colors.gray400} style={styles.inputIcon} />
          <TextInput
            style={[styles.textArea, errors.description && styles.inputError]}
            value={formData.description}
            onChangeText={(text) => {
              setFormData(prev => ({ ...prev, description: text }));
              if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
            }}
            placeholder="Describe your services, experience, and what clients can expect..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </View>
    </>
  );

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
            <Text style={styles.title}>
              {currentStep === 1 ? 'Personal Information' : 'Service Details'}
            </Text>
            <Text style={styles.subtitle}>
              Step {currentStep} of 2
            </Text>
            
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(currentStep / 2) * 100}%` }]} />
              </View>
            </View>
          </View>

          <View style={styles.form}>
            {currentStep === 1 ? renderStep1() : renderStep2()}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleNext}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? 'Saving...' : currentStep === 2 ? 'Complete Setup' : 'Next'}
              </Text>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
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
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: Colors.text,
  },
  chipTextSelected: {
    color: Colors.white,
  },
  sessionTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sessionTypeCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
    gap: 8,
  },
  sessionTypeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.gray50,
  },
  sessionTypeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  sessionTypeTextSelected: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  buttonContainer: {
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
});