import { apiClient } from '../client';
import { API_ENDPOINTS, buildQueryParams, PaginationParams } from '../endpoints';
import { Registration } from '../../types';

export class RegistrationService {
  async registerForEvent(eventId: string): Promise<Registration> {
    return apiClient.post<Registration>(
      API_ENDPOINTS.REGISTRATIONS.REGISTER,
      { eventId }
    );
  }

  async getUserRegistrations(userId: string, params: PaginationParams = {}): Promise<Registration[]> {
    const queryString = buildQueryParams({ ...params, userId });
    const endpoint = `${API_ENDPOINTS.REGISTRATIONS.BASE}?${queryString}`;
    
    return apiClient.get<Registration[]>(endpoint);
  }

  async getEventRegistrations(eventId: string, params: PaginationParams = {}): Promise<Registration[]> {
    const queryString = buildQueryParams({ ...params, eventId });
    const endpoint = `${API_ENDPOINTS.REGISTRATIONS.BASE}?${queryString}`;
    
    return apiClient.get<Registration[]>(endpoint);
  }

  async getRegistrationById(id: string): Promise<Registration> {
    return apiClient.get<Registration>(API_ENDPOINTS.REGISTRATIONS.BY_ID(id));
  }

  async cancelRegistration(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.REGISTRATIONS.CANCEL(id));
  }

  async updateRegistrationStatus(id: string, status: 'confirmed' | 'cancelled'): Promise<Registration> {
    return apiClient.patch<Registration>(
      API_ENDPOINTS.REGISTRATIONS.BY_ID(id),
      { status }
    );
  }

  async checkRegistrationStatus(userId: string, eventId: string): Promise<Registration | null> {
    const queryString = buildQueryParams({ userId, eventId });
    const endpoint = `${API_ENDPOINTS.REGISTRATIONS.BASE}?${queryString}`;
    
    const registrations = await apiClient.get<Registration[]>(endpoint);
    return registrations.length > 0 ? registrations[0] : null;
  }
}

export const registrationService = new RegistrationService();
