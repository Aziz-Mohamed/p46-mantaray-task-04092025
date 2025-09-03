import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEvents } from '../../src/hooks/useEvents';
import { EventCard, Input, LoadingSpinner } from '../../src/components';
import { UI_CONSTANTS } from '../../src/constants';
import { normalize } from '../../src/utils/normalize';

export default function EventsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  
  const {
    data: eventsData,
    isLoading,
    isError,
    refetch,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useEvents(page, 10);

  const handleEventPress = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const handleRefresh = () => {
    setPage(1);
    refetch();
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      setPage(prev => prev + 1);
      fetchNextPage();
    }
  };

  const renderEvent = ({ item }: { item: any }) => (
    <EventCard
      event={item}
      onPress={() => handleEventPress(item.id)}
    />
  );

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return <LoadingSpinner text="Loading more events..." />;
    }
    return null;
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="calendar-outline"
        size={normalize(64)}
        color={UI_CONSTANTS.COLORS.TEXT_SECONDARY}
      />
      <Text style={styles.emptyTitle}>No Events Found</Text>
      <Text style={styles.emptySubtitle}>
        Check back later for new events
      </Text>
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
        Unable to load events. Please try again.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && !eventsData) {
    return <LoadingSpinner fullScreen text="Loading events..." />;
  }

  if (isError) {
    return renderError();
  }

  const events = eventsData?.data || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            // TODO: Implement logout
          }}
        >
          <Ionicons name="log-out-outline" size={normalize(24)} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="search-outline"
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={UI_CONSTANTS.COLORS.PRIMARY}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
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
  title: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoutButton: {
    padding: UI_CONSTANTS.SPACING.SM,
  },
  searchContainer: {
    paddingHorizontal: UI_CONSTANTS.SPACING.LG,
    paddingVertical: UI_CONSTANTS.SPACING.MD,
    backgroundColor: UI_CONSTANTS.COLORS.SURFACE,
  },
  searchInput: {
    marginBottom: 0,
  },
  listContent: {
    padding: UI_CONSTANTS.SPACING.LG,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: UI_CONSTANTS.SPACING.XL * 2,
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
