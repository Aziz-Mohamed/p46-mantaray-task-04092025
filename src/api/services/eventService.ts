import { apiClient } from '../client';
import { API_ENDPOINTS } from '../../constants';
import { buildQueryParams, EventFilters } from '../endpoints';
import { Event, PaginatedResponse } from '../../types';
import { EventTransformer, ApiEvent } from '../transformers';

/**
 * Event Service
 * Handles all event-related API operations with clean data transformation
 */
export class EventService {
  async getEvents(filters: EventFilters = {}): Promise<PaginatedResponse<Event>> {
    const queryString = buildQueryParams(filters);
    const endpoint = queryString 
      ? `${API_ENDPOINTS.EVENTS}?${queryString}`
      : API_ENDPOINTS.EVENTS;
    
    const rawEvents = await apiClient.get<ApiEvent[]>(endpoint);
    const transformedEvents = EventTransformer.toEventArray(rawEvents);
    
    return {
      data: transformedEvents,
      total: transformedEvents.length,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  }

  async getEventById(id: string): Promise<Event> {
    const rawEvent = await apiClient.get<ApiEvent>(`${API_ENDPOINTS.EVENTS}/${id}`);
    return EventTransformer.toEvent(rawEvent);
  }

  async searchEvents(query: string, filters: Omit<EventFilters, 'search'> = {}): Promise<PaginatedResponse<Event>> {
    // MockAPI doesn't have search endpoint, so we filter client-side
    const allEvents = await this.getEvents();
    
    const filteredEvents = allEvents.data.filter(event => 
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase()) ||
      event.location.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      data: filteredEvents,
      total: filteredEvents.length,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  }

  async getFeaturedEvents(limit: number = 5): Promise<Event[]> {
    const allEvents = await this.getEvents();
    return allEvents.data.slice(0, limit);
  }

  async getUpcomingEvents(limit: number = 10): Promise<Event[]> {
    const allEvents = await this.getEvents();
    const now = new Date();
    
    const upcomingEvents = allEvents.data.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate > now;
    });
    
    return upcomingEvents
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit);
  }

  async getEventsByCategory(category: string, filters: Omit<EventFilters, 'category'> = {}): Promise<PaginatedResponse<Event>> {
    const allEvents = await this.getEvents();
    
    const categoryEvents = allEvents.data.filter(event => 
      event.title.toLowerCase().includes(category.toLowerCase()) ||
      event.description.toLowerCase().includes(category.toLowerCase())
    );
    
    return {
      data: categoryEvents,
      total: categoryEvents.length,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  }

  async createEvent(eventData: Omit<Event, 'id' | 'createdAt'>): Promise<Event> {
    const apiEventData = EventTransformer.toApiEvent(eventData);
    const rawEvent = await apiClient.post<ApiEvent>(API_ENDPOINTS.EVENTS, apiEventData);
    return EventTransformer.toEvent(rawEvent);
  }

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    const apiEventData = EventTransformer.toApiEvent(eventData);
    const rawEvent = await apiClient.put<ApiEvent>(`${API_ENDPOINTS.EVENTS}/${id}`, apiEventData);
    return EventTransformer.toEvent(rawEvent);
  }

  async deleteEvent(id: string): Promise<void> {
    return apiClient.delete<void>(`${API_ENDPOINTS.EVENTS}/${id}`);
  }
}

export const eventService = new EventService();