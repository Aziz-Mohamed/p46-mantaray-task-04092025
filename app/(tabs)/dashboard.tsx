import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserRegistrations, useCancelRegistration } from '../../src/hooks/useEvents';
import { EventCard, LoadingSpinner } from '../../src/components';
import { useAuth } from '../../src/providers/authProvider';
import { UI_CONSTANTS } from '../../src/constants';
import { normalize } from '../../src/utils/normalize';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  
  const {
    data: registrations,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useUserRegistrations();

  const cancelRegistrationMutation = useCancelRegistration();

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const handleCancelRegistration = (registrationId: string, eventTitle: string) => {
    Alert.alert(
      'Cancel Registration',
      `Are you sure you want to cancel your registration for "${eventTitle}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelRegistrationMutation.mutateAsync(registrationId);
              Alert.alert('Success', 'Your registration has been cancelled.');
            } catch (error) {
              Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'Failed to cancel registration'
              );
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderRegistration = ({ item }: { item: any }) => (
    <View style={styles.registrationCard}>
      <EventCard
        event={item.event}
        onPress={() => handleEventPress(item.event.id)}
      />
      <View style={styles.registrationActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleCancelRegistration(item.id, item.event.title)}
          disabled={cancelRegistrationMutation.isPending}
        >
          <Ionicons name="close-circle-outline" size={normalize(20)} color={UI_CONSTANTS.COLORS.ERROR} />
          <Text style={styles.cancelButtonText}>Cancel Registration</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="calendar-outline"
        size={normalize(64)}
        color={UI_CONSTANTS.COLORS.TEXT_SECONDARY}
      />
      <Text style={styles.emptyTitle}>No Registered Events</Text>
      <Text style={styles.emptySubtitle}>
        You haven't registered for any events yet.{'\n'}
        Browse events to get started!
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push('/(tabs)/events')}
      >
        <Text style={styles.browseButtonText}>Browse Events</Text>
      </TouchableOpacity>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Ionicons
        name="alert-circle-outline"
        size={normalize(64)}
        color={UI_CONSTANTS.COLORS.ERROR}
      />
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorSubtitle}>
        Unable to load your registrations. Please try again.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading your events..." />;
  }

  if (isError) {
    return renderError();
  }

  const registrationList = registrations || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Hello, {user?.name}</Text>
          <Text style={styles.subtitle}>Your registered events</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={normalize(24)} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={registrationList}
        renderItem={renderRegistration}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={UI_CONSTANTS.COLORS.PRIMARY}
          />
        }
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONSTANTS.COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: UI_CONSTANTS.SPACING.LG,
    paddingVertical: UI_CONSTANTS.SPACING.MD,
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: normalize(14),
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: UI_CONSTANTS.SPACING.XS,
  },
  logoutButton: {
    padding: UI_CONSTANTS.SPACING.SM,
  },
  listContent: {
    padding: UI_CONSTANTS.SPACING.LG,
  },
  registrationCard: {
    marginBottom: UI_CONSTANTS.SPACING.LG,
  },
  registrationActions: {
    marginTop: UI_CONSTANTS.SPACING.SM,
    alignItems: 'center',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: UI_CONSTANTS.SPACING.SM,
    paddingHorizontal: UI_CONSTANTS.SPACING.MD,
  },
  cancelButtonText: {
    fontSize: normalize(14),
    color: UI_CONSTANTS.COLORS.ERROR,
    marginLeft: UI_CONSTANTS.SPACING.XS,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: UI_CONSTANTS.SPACING.XL * 2,
    paddingHorizontal: UI_CONSTANTS.SPACING.LG,
  },
  emptyTitle: {
    fontSize: normalize(20),
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
    marginTop: UI_CONSTANTS.SPACING.MD,
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  emptySubtitle: {
    fontSize: normalize(16),
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: UI_CONSTANTS.SPACING.LG,
  },
  browseButton: {
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
    paddingHorizontal: UI_CONSTANTS.SPACING.LG,
    paddingVertical: UI_CONSTANTS.SPACING.MD,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MD,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: UI_CONSTANTS.SPACING.XL * 2,
    paddingHorizontal: UI_CONSTANTS.SPACING.LG,
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
  retryButton: {
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
    paddingHorizontal: UI_CONSTANTS.SPACING.LG,
    paddingVertical: UI_CONSTANTS.SPACING.MD,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MD,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '600',
  },
});
