import { Event, Speaker } from '../../types';
import { ApiEvent } from './types';

/**
 * Event Data Transformer
 * Handles conversion between MockAPI format and app format
 */
export class EventTransformer {
  /**
   * Transform raw API event data to app format
   */
  static toEvent(apiEvent: ApiEvent): Event {
    return {
      id: apiEvent.id,
      title: apiEvent.title,
      description: apiEvent.description,
      date: this.extractDate(apiEvent.date),
      time: this.extractTime(apiEvent.time),
      location: apiEvent.location,
      price: this.parsePrice(apiEvent.price),
      image: apiEvent.image,
      capacity: this.parseCapacity(apiEvent.capacity),
      availableSpots: this.parseAvailableSpots(apiEvent.availableSpots, apiEvent.capacity),
      speakers: [this.createSpeaker(apiEvent)],
      createdAt: apiEvent.createdAt,
    };
  }

  /**
   * Transform app event data to API format
   */
  static toApiEvent(event: Partial<Event>): Partial<ApiEvent> {
    const apiEvent: Partial<ApiEvent> = {};

    if (event.title) apiEvent.title = event.title;
    if (event.description) apiEvent.description = event.description;
    if (event.location) apiEvent.location = event.location;
    if (event.image) apiEvent.image = event.image;
    if (event.createdAt) apiEvent.createdAt = event.createdAt;

    if (event.date) {
      apiEvent.date = this.formatDateToISO(event.date);
    }

    if (event.time) {
      apiEvent.time = this.formatTimeToISO(event.time);
    }

    if (event.price !== undefined) {
      apiEvent.price = event.price.toString();
    }

    if (event.capacity !== undefined) {
      apiEvent.capacity = event.capacity.toString();
    }

    if (event.availableSpots !== undefined) {
      apiEvent.availableSpots = event.availableSpots.toString();
    }

    if (event.speakers?.[0]) {
      const speaker = event.speakers[0];
      apiEvent.speakersName = speaker.name;
      apiEvent.speakerTitle = speaker.title;
      apiEvent.speakerBio = speaker.bio;
      apiEvent.speakerAvatar = speaker.avatar || '';
    }

    return apiEvent;
  }

  /**
   * Transform array of API events to app format
   */
  static toEventArray(apiEvents: ApiEvent[]): Event[] {
    return apiEvents.map(apiEvent => this.toEvent(apiEvent));
  }

  // Private helper methods
  private static extractDate(isoDate: string): string {
    return new Date(isoDate).toISOString().split('T')[0];
  }

  private static extractTime(isoTime: string): string {
    return new Date(isoTime).toTimeString().split(' ')[0].substring(0, 5);
  }

  private static parsePrice(priceString: string): number {
    const price = parseFloat(priceString);
    return isNaN(price) ? 0 : price;
  }

  private static parseCapacity(capacityString: string): number {
    const capacity = parseFloat(capacityString);
    return isNaN(capacity) ? 0 : Math.floor(capacity);
  }

  private static parseAvailableSpots(availableSpotsString: string, capacityString: string): number {
    const availableSpots = parseFloat(availableSpotsString);
    const capacity = this.parseCapacity(capacityString);
    
    if (isNaN(availableSpots)) return 0;
    
    // Ensure availableSpots doesn't exceed capacity
    return Math.min(Math.floor(availableSpots), capacity);
  }

  private static createSpeaker(apiEvent: ApiEvent): Speaker {
    return {
      id: '1', // Generate a default ID since we only have one speaker
      name: apiEvent.speakersName,
      title: apiEvent.speakerTitle,
      bio: apiEvent.speakerBio || 'No bio available',
      avatar: apiEvent.speakerAvatar,
    };
  }

  private static formatDateToISO(date: string): string {
    return new Date(date).toISOString();
  }

  private static formatTimeToISO(time: string): string {
    return new Date(`2000-01-01T${time}`).toISOString();
  }
}
