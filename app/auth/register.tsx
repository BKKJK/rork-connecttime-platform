import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';
import { Eye, EyeOff, Mail, User, Lock, ArrowLeft } from 'lucide-react-native';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { register, isLoading, error, clearError } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.termsAccepted) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: 'client', // Default to client, will be changed in role selection
      });
      router.replace('/(tabs)'); // Temporary redirect until role selection is created
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleLoginPress = () => {
    router.push('/auth/login');
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('Registration Failed', error);
      clearError();
    }
  }, [error, clearError]);

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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join ConnectTime and start connecting</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <User size={20} color={Colors.gray400} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={formData.name}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, name: text }));
                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                  autoCorrect={false}
    
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color={Colors.gray400} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  value={formData.email}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, email: text }));
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
    
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color={Colors.gray400} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  value={formData.password}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, password: text }));
                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  placeholder="Create a strong password"
                  secureTextEntry={!showPassword}
    
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={Colors.gray400} />
                  ) : (
                    <Eye size={20} color={Colors.gray400} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color={Colors.gray400} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.confirmPassword && styles.inputError]}
                  value={formData.confirmPassword}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, confirmPassword: text }));
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                  }}
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirmPassword}
    
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={Colors.gray400} />
                  ) : (
                    <Eye size={20} color={Colors.gray400} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            <View style={styles.termsContainer}>
              <TouchableOpacity
                onPress={() => {
                  setFormData(prev => ({ ...prev, termsAccepted: !prev.termsAccepted }));
                  if (errors.terms) setErrors(prev => ({ ...prev, terms: undefined }));
                }}
                style={styles.checkboxContainer}
              >
                <View style={[styles.checkbox, formData.termsAccepted && styles.checkboxChecked]}>
                  {formData.termsAccepted && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
              {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
            </View>

            <Button
              title={isLoading ? 'Creating Account...' : 'Continue'}
              onPress={handleRegister}
              disabled={isLoading}
              style={styles.registerButton}

            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Button
              title="Sign In"
              onPress={handleLoginPress}
              variant="outline"
              style={styles.loginButton}
            />
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
    fontSize: 32,
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
  inputError: {
    borderColor: Colors.error,
  },
  eyeIcon: {
    padding: 16,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginTop: 4,
  },
  termsContainer: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  registerButton: {
    marginBottom: 24,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
  },
  footerText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  loginButton: {
    width: '100%',
  },
});