import { Event, Registration, PaginatedResponse } from '../types';
import { API_BASE_URL, API_ENDPOINTS } from '../constants';

class EventService {
  private baseURL = API_BASE_URL;

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async getEvents(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Event>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    return this.makeRequest<PaginatedResponse<Event>>(
      `${API_ENDPOINTS.EVENTS}?${params}`
    );
  }

  async getEventById(id: string): Promise<Event> {
    return this.makeRequest<Event>(API_ENDPOINTS.EVENT_DETAILS(id));
  }

  async registerForEvent(eventId: string, token: string): Promise<Registration> {
    return this.makeRequest<Registration>(API_ENDPOINTS.REGISTER_EVENT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId }),
    });
  }

  async getUserRegistrations(userId: string, token: string): Promise<Registration[]> {
    return this.makeRequest<Registration[]>(API_ENDPOINTS.USER_REGISTRATIONS(userId), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async cancelRegistration(registrationId: string, token: string): Promise<void> {
    return this.makeRequest<void>(`${API_ENDPOINTS.REGISTRATIONS}/${registrationId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async searchEvents(query: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Event>> {
    const params = new URLSearchParams({
      search: query,
      page: page.toString(),
      limit: limit.toString(),
    });
    
    return this.makeRequest<PaginatedResponse<Event>>(
      `${API_ENDPOINTS.EVENTS}/search?${params}`
    );
  }
}

export const eventService = new EventService();
