import { apiClient } from '../client';
import { API_ENDPOINTS, buildQueryParams, EventFilters } from '../endpoints';
import { Event, Registration, PaginatedResponse } from '../../types';

export class EventService {
  async getEvents(filters: EventFilters = {}): Promise<PaginatedResponse<Event>> {
    const queryString = buildQueryParams(filters);
    const endpoint = queryString 
      ? `${API_ENDPOINTS.EVENTS.BASE}?${queryString}`
      : API_ENDPOINTS.EVENTS.BASE;
    
    return apiClient.get<PaginatedResponse<Event>>(endpoint);
  }

  async getEventById(id: string): Promise<Event> {
    return apiClient.get<Event>(API_ENDPOINTS.EVENTS.BY_ID(id));
  }

  async searchEvents(query: string, filters: Omit<EventFilters, 'search'> = {}): Promise<PaginatedResponse<Event>> {
    const searchFilters = { ...filters, search: query };
    const queryString = buildQueryParams(searchFilters);
    const endpoint = `${API_ENDPOINTS.EVENTS.SEARCH}?${queryString}`;
    
    return apiClient.get<PaginatedResponse<Event>>(endpoint);
  }

  async getFeaturedEvents(limit: number = 5): Promise<Event[]> {
    const queryString = buildQueryParams({ limit });
    const endpoint = `${API_ENDPOINTS.EVENTS.FEATURED}?${queryString}`;
    
    return apiClient.get<Event[]>(endpoint);
  }

  async getUpcomingEvents(limit: number = 10): Promise<Event[]> {
    const queryString = buildQueryParams({ limit });
    const endpoint = `${API_ENDPOINTS.EVENTS.UPCOMING}?${queryString}`;
    
    return apiClient.get<Event[]>(endpoint);
  }

  async getEventsByCategory(category: string, filters: Omit<EventFilters, 'category'> = {}): Promise<PaginatedResponse<Event>> {
    const queryString = buildQueryParams(filters);
    const endpoint = queryString
      ? `${API_ENDPOINTS.EVENTS.BY_CATEGORY(category)}?${queryString}`
      : API_ENDPOINTS.EVENTS.BY_CATEGORY(category);
    
    return apiClient.get<PaginatedResponse<Event>>(endpoint);
  }

  async createEvent(eventData: Omit<Event, 'id' | 'createdAt'>): Promise<Event> {
    return apiClient.post<Event>(API_ENDPOINTS.EVENTS.BASE, eventData);
  }

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    return apiClient.put<Event>(API_ENDPOINTS.EVENTS.BY_ID(id), eventData);
  }

  async deleteEvent(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.EVENTS.BY_ID(id));
  }
}

export const eventService = new EventService();
