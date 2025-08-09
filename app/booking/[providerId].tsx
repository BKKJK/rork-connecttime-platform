import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Phone, Video, Users, ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { providers } from '@/data/mockData';

type SessionType = 'in-person' | 'video' | 'phone';

const sessionTypeOptions = [
  { type: 'in-person' as SessionType, icon: Users, label: 'In Person', description: 'Meet face to face' },
  { type: 'video' as SessionType, icon: Video, label: 'Video Call', description: 'Online video session' },
  { type: 'phone' as SessionType, icon: Phone, label: 'Phone Call', description: 'Voice call only' },
];

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM',
];

const durations = [
  { value: 1, label: '1 hour' },
  { value: 1.5, label: '1.5 hours' },
  { value: 2, label: '2 hours' },
  { value: 3, label: '3 hours' },
];

export default function BookingScreen() {
  const { providerId } = useLocalSearchParams<{ providerId: string }>();
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType>('video');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(1);

  const provider = providers.find(p => p.id === providerId);

  if (!provider) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Provider not found</Text>
      </SafeAreaView>
    );
  }

  const totalAmount = provider.hourlyRate * selectedDuration;

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Missing Information', 'Please select a date and time for your session.');
      return;
    }

    Alert.alert(
      'Confirm Booking',
      `Book a ${selectedDuration} hour ${selectedSessionType} session with ${provider.name} on ${selectedDate} at ${selectedTime} for $${totalAmount}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            // In a real app, this would process the payment and create the booking
            Alert.alert('Success', 'Your booking has been confirmed!', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          }
        },
      ]
    );
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
      });
    }
    return dates;
  };

  const availableDates = generateDates();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Book Session',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.providerCard}>
          <Text style={styles.providerName}>{provider.name}</Text>
          <Text style={styles.providerRate}>${provider.hourlyRate}/hour</Text>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Session Type</Text>
          <View style={styles.sessionTypes}>
            {sessionTypeOptions
              .filter(option => provider.sessionTypes.includes(option.type))
              .map((option) => (
                <TouchableOpacity
                  key={option.type}
                  style={[
                    styles.sessionTypeOption,
                    selectedSessionType === option.type && styles.selectedSessionType
                  ]}
                  onPress={() => setSelectedSessionType(option.type)}
                >
                  <option.icon 
                    size={20} 
                    color={selectedSessionType === option.type ? Colors.primary : Colors.gray400} 
                  />
                  <View style={styles.sessionTypeInfo}>
                    <Text style={[
                      styles.sessionTypeLabel,
                      selectedSessionType === option.type && styles.selectedSessionTypeText
                    ]}>
                      {option.label}
                    </Text>
                    <Text style={styles.sessionTypeDescription}>{option.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dateOptions}>
              {availableDates.map((date) => (
                <TouchableOpacity
                  key={date.value}
                  style={[
                    styles.dateOption,
                    selectedDate === date.value && styles.selectedDate
                  ]}
                  onPress={() => setSelectedDate(date.value)}
                >
                  <Text style={[
                    styles.dateText,
                    selectedDate === date.value && styles.selectedDateText
                  ]}>
                    {date.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeSlots}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.selectedTime
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[
                  styles.timeText,
                  selectedTime === time && styles.selectedTimeText
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <View style={styles.durations}>
            {durations.map((duration) => (
              <TouchableOpacity
                key={duration.value}
                style={[
                  styles.durationOption,
                  selectedDuration === duration.value && styles.selectedDuration
                ]}
                onPress={() => setSelectedDuration(duration.value)}
              >
                <Text style={[
                  styles.durationText,
                  selectedDuration === duration.value && styles.selectedDurationText
                ]}>
                  {duration.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Provider:</Text>
            <Text style={styles.summaryValue}>{provider.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Session Type:</Text>
            <Text style={styles.summaryValue}>
              {sessionTypeOptions.find(opt => opt.type === selectedSessionType)?.label}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration:</Text>
            <Text style={styles.summaryValue}>{selectedDuration} hour(s)</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rate:</Text>
            <Text style={styles.summaryValue}>${provider.hourlyRate}/hour</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${totalAmount}</Text>
          </View>
        </Card>
      </ScrollView>

      <View style={styles.bookingBar}>
        <View style={styles.bookingInfo}>
          <Text style={styles.totalAmount}>${totalAmount}</Text>
          <Text style={styles.totalDescription}>Total for {selectedDuration} hour(s)</Text>
        </View>
        <Button
          title="Book & Pay"
          onPress={handleBooking}
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
  content: {
    flex: 1,
    padding: 24,
    paddingBottom: 100,
  },
  providerCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  providerName: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  providerRate: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  sessionTypes: {
    gap: 12,
  },
  sessionTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  selectedSessionType: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  sessionTypeInfo: {
    marginLeft: 12,
    flex: 1,
  },
  sessionTypeLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  selectedSessionTypeText: {
    color: Colors.primary,
  },
  sessionTypeDescription: {
    fontSize: 14,
    color: Colors.gray500,
  },
  dateOptions: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 24,
  },
  dateOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedDate: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  dateText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
  selectedDateText: {
    color: Colors.white,
    fontWeight: '600' as const,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedTime: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  timeText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedTimeText: {
    color: Colors.white,
    fontWeight: '600' as const,
  },
  durations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  durationOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  selectedDuration: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  durationText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedDurationText: {
    color: Colors.white,
    fontWeight: '600' as const,
  },
  summaryCard: {
    backgroundColor: Colors.backgroundSecondary,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.gray600,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
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
  totalAmount: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  totalDescription: {
    fontSize: 14,
    color: Colors.gray500,
  },
  bookButton: {
    minWidth: 120,
  },
});