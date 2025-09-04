import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEvent, useRegisterEvent, useUserRegistrations, useCancelRegistration } from '../../src/hooks/useEvents';
import { Button, LoadingSpinner } from '../../src/components';
import { useAuth } from '../../src/providers/authProvider';
import { UI_CONSTANTS } from '../../src/constants';
import { normalize } from '../../src/utils/normalize';
import { formatEventDateLong, formatTime, formatPrice, formatAvailableSpots } from '../../src/utils';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  const {
    data: event,
    isLoading: isLoadingEvent,
    isError: isEventError,
  } = useEvent(id!);

  const {
    data: userRegistrations,
    isLoading: isLoadingRegistrations,
  } = useUserRegistrations();

  const registerEventMutation = useRegisterEvent();
  const cancelRegistrationMutation = useCancelRegistration();

  const isRegistered = userRegistrations?.some((item: any) => item?.event?.id === id);

  const handleRegister = async () => {
    if (!event || !user) return;

    if (event.availableSpots <= 0) {
      Alert.alert('Event Full', 'Sorry, this event is fully booked.');
      return;
    }

    try {
      setIsRegistering(true);
      await registerEventMutation.mutateAsync(event.id);
      Alert.alert(
        'Registration Successful!',
        `You have successfully registered for ${event.title}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCancel = async () => {
    if (!event || !user) return;

    Alert.alert(
      'Cancel Registration',
      `Are you sure you want to cancel your registration for "${event.title}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelRegistrationMutation.mutateAsync(event.id);
              Alert.alert('Cancelled', 'Your registration has been cancelled.', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } catch (error) {
              Alert.alert('Cancellation Failed', error instanceof Error ? error.message : 'Something went wrong');
            }
          },
        },
      ]
    );
  };

  if (isLoadingEvent) {
    return <LoadingSpinner fullScreen text="Loading event details..." />;
  }

  if (isEventError || !event) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={normalize(64)}
          color={UI_CONSTANTS.COLORS.ERROR}
        />
        <Text style={styles.errorTitle}>Event Not Found</Text>
        <Text style={styles.errorSubtitle}>
          The event you're looking for doesn't exist or has been removed.
        </Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: event.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateTimeItem}>
            <Ionicons
              name="calendar-outline"
              size={normalize(20)}
              color={UI_CONSTANTS.COLORS.PRIMARY}
            />
            <Text style={styles.dateTimeText}>
              {formatEventDateLong(event.date)}
            </Text>
          </View>
          <View style={styles.dateTimeItem}>
            <Ionicons
              name="time-outline"
              size={normalize(20)}
              color={UI_CONSTANTS.COLORS.PRIMARY}
            />
            <Text style={styles.dateTimeText}>
              {formatTime(event.time)}
            </Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons
            name="location-outline"
            size={normalize(20)}
            color={UI_CONSTANTS.COLORS.PRIMARY}
          />
          <Text style={styles.locationText}>{event.location}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>{formatPrice(event.price)}</Text>
        </View>

        <View style={styles.capacityContainer}>
          <View style={styles.capacityItem}>
            <Text style={styles.capacityLabel}>Capacity</Text>
            <Text style={styles.capacityValue}>{event.capacity}</Text>
          </View>
          <View style={styles.capacityItem}>
            <Text style={styles.capacityLabel}>Available Spots</Text>
            <Text style={[
              styles.capacityValue,
              event.availableSpots <= 5 && styles.lowSpots
            ]}>
              {event.availableSpots}
            </Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>About This Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {event.speakers && event.speakers.length > 0 && (
          <View style={styles.speakersContainer}>
            <Text style={styles.speakersTitle}>Speakers</Text>
            {event.speakers.map((speaker) => (
              <View key={speaker.id} style={styles.speakerItem}>
                <View style={styles.speakerInfo}>
                  <Text style={styles.speakerName}>{speaker.name}</Text>
                  <Text style={styles.speakerTitle}>{speaker.title}</Text>
                  {speaker.bio && (
                    <Text style={styles.speakerBio}>{speaker.bio}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actionContainer}>
          {isRegistered ? (
            <View style={[styles.registerButton, { backgroundColor: UI_CONSTANTS.COLORS.ERROR, borderRadius: 12 }]}>
              <Button
                title="Cancel Registration"
                onPress={handleCancel}
                loading={cancelRegistrationMutation.isPending}
                style={{}}
                textStyle={{ color: '#FFFFFF' }}
              />
            </View>
          ) : (
            <Button
              title={
                event.availableSpots <= 0
                  ? 'Event Full'
                  : `Register for ${formatPrice(event.price)}`
              }
              onPress={handleRegister}
              loading={isRegistering || registerEventMutation.isPending}
              disabled={event.availableSpots <= 0}
              style={styles.registerButton}
            />
          )}
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONSTANTS.COLORS.BACKGROUND,
  },
  safeArea: {
    flex: 1,
    backgroundColor: UI_CONSTANTS.COLORS.BACKGROUND,
  },
  image: {
    width: '100%',
    height: normalize(250),
    resizeMode: 'cover',
  },
  content: {
    padding: UI_CONSTANTS.SPACING.LG,
  },
  title: {
    fontSize: normalize(28),
    fontWeight: 'bold',
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
    marginBottom: UI_CONSTANTS.SPACING.MD,
  },
  dateTimeContainer: {
    marginBottom: UI_CONSTANTS.SPACING.MD,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  dateTimeText: {
    fontSize: normalize(16),
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
    marginLeft: UI_CONSTANTS.SPACING.SM,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: UI_CONSTANTS.SPACING.LG,
  },
  locationText: {
    fontSize: normalize(16),
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
    marginLeft: UI_CONSTANTS.SPACING.SM,
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: UI_CONSTANTS.COLORS.SURFACE,
    padding: UI_CONSTANTS.SPACING.MD,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MD,
    marginBottom: UI_CONSTANTS.SPACING.LG,
  },
  priceLabel: {
    fontSize: normalize(16),
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
  },
  price: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: UI_CONSTANTS.COLORS.PRIMARY,
  },
  capacityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: UI_CONSTANTS.SPACING.LG,
  },
  capacityItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: UI_CONSTANTS.COLORS.SURFACE,
    padding: UI_CONSTANTS.SPACING.MD,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MD,
    marginHorizontal: UI_CONSTANTS.SPACING.XS,
  },
  capacityLabel: {
    fontSize: normalize(14),
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    marginBottom: UI_CONSTANTS.SPACING.XS,
  },
  capacityValue: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
  },
  lowSpots: {
    color: UI_CONSTANTS.COLORS.WARNING,
  },
  descriptionContainer: {
    marginBottom: UI_CONSTANTS.SPACING.LG,
  },
  descriptionTitle: {
    fontSize: normalize(20),
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  description: {
    fontSize: normalize(16),
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    lineHeight: normalize(24),
  },
  speakersContainer: {
    marginBottom: UI_CONSTANTS.SPACING.LG,
  },
  speakersTitle: {
    fontSize: normalize(20),
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
    marginBottom: UI_CONSTANTS.SPACING.MD,
  },
  speakerItem: {
    backgroundColor: UI_CONSTANTS.COLORS.SURFACE,
    padding: UI_CONSTANTS.SPACING.MD,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MD,
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  speakerInfo: {
    flex: 1,
  },
  speakerName: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
    marginBottom: UI_CONSTANTS.SPACING.XS,
  },
  speakerTitle: {
    fontSize: normalize(14),
    color: UI_CONSTANTS.COLORS.PRIMARY,
    marginBottom: UI_CONSTANTS.SPACING.XS,
  },
  speakerBio: {
    fontSize: normalize(14),
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    lineHeight: normalize(20),
  },
  actionContainer: {
    marginTop: UI_CONSTANTS.SPACING.LG,
    marginBottom: UI_CONSTANTS.SPACING.XL,
  },
  registerButton: {
    marginBottom: 0,
  },
  registeredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E8',
    padding: UI_CONSTANTS.SPACING.MD,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MD,
  },
  registeredText: {
    fontSize: normalize(16),
    color: UI_CONSTANTS.COLORS.SUCCESS,
    marginLeft: UI_CONSTANTS.SPACING.SM,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: UI_CONSTANTS.SPACING.LG,
  },
  errorTitle: {
    fontSize: normalize(20),
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
    marginTop: UI_CONSTANTS.SPACING.MD,
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  errorSubtitle: {
    fontSize: normalize(16),
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: UI_CONSTANTS.SPACING.LG,
  },
  backButton: {
    marginTop: UI_CONSTANTS.SPACING.MD,
  },
});
