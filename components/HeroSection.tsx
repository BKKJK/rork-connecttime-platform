import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(37, 99, 235, 0.8)', 'rgba(37, 99, 235, 0.6)']}
          style={styles.overlay}
        >
          <View style={styles.content}>
            <Text style={styles.headline}>Find your perfect connection</Text>
            <Text style={styles.subheadline}>
              Connect with verified professionals for meaningful conversations, 
              coaching, companionship, and more.
            </Text>
            <Button
              title="Get Started"
              onPress={onGetStarted}
              variant="primary"
              size="large"
              style={styles.ctaButton}
            />
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 400,
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  headline: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  subheadline: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    opacity: 0.9,
  },
  ctaButton: {
    backgroundColor: Colors.white,
    minWidth: 160,
  },
});