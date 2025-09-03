import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../types';
import { UI_CONSTANTS } from '../constants';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  style?: ViewStyle;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  style,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: event.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        <View style={styles.dateTimeContainer}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={UI_CONSTANTS.COLORS.TEXT_SECONDARY}
          />
          <Text style={styles.dateTime}>
            {formatDate(event.date)} • {formatTime(event.time)}
          </Text>
        </View>
        <View style={styles.locationContainer}>
          <Ionicons
            name="location-outline"
            size={16}
            color={UI_CONSTANTS.COLORS.TEXT_SECONDARY}
          />
          <Text style={styles.location} numberOfLines={1}>
            {event.location}
          </Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(event.price)}</Text>
          </View>
          <View style={styles.spotsContainer}>
            <Ionicons
              name="people-outline"
              size={16}
              color={UI_CONSTANTS.COLORS.TEXT_SECONDARY}
            />
            <Text style={styles.spots}>
              {event.availableSpots} spots left
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: UI_CONSTANTS.COLORS.SURFACE,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.LG,
    marginBottom: UI_CONSTANTS.SPACING.MD,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: UI_CONSTANTS.BORDER_RADIUS.LG,
    borderTopRightRadius: UI_CONSTANTS.BORDER_RADIUS.LG,
    resizeMode: 'cover',
  },
  content: {
    padding: UI_CONSTANTS.SPACING.MD,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: UI_CONSTANTS.COLORS.TEXT_PRIMARY,
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: UI_CONSTANTS.SPACING.XS,
  },
  dateTime: {
    fontSize: 14,
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    marginLeft: UI_CONSTANTS.SPACING.XS,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: UI_CONSTANTS.SPACING.MD,
  },
  location: {
    fontSize: 14,
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    marginLeft: UI_CONSTANTS.SPACING.XS,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
    paddingHorizontal: UI_CONSTANTS.SPACING.MD,
    paddingVertical: UI_CONSTANTS.SPACING.XS,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.SM,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  spotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spots: {
    fontSize: 14,
    color: UI_CONSTANTS.COLORS.TEXT_SECONDARY,
    marginLeft: UI_CONSTANTS.SPACING.XS,
  },
});
