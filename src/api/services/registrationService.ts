import { apiClient, ApiClientError } from '../client';
import { API_ENDPOINTS, buildQueryParams, PaginationParams } from '../endpoints';
import { Registration } from '../../types';
import { RegistrationTransformer, ApiRegistration } from '../transformers';

/**
 * Registration Service
 * Handles all registration-related API operations with clean data transformation
 */
export class RegistrationService {
  async registerForEvent(
    eventId: string, 
    userId: string, 
    userName: string, 
    userEmail: string
  ): Promise<Registration> {
    const registrationData = RegistrationTransformer.createRegistrationWithUserDetails(
      eventId, 
      userId, 
      userName, 
      userEmail
    );
    
    const rawRegistration = await apiClient.post<ApiRegistration>(
      API_ENDPOINTS.REGISTRATIONS.REGISTER,
      registrationData
    );
    
    return RegistrationTransformer.toRegistration(rawRegistration);
  }

  async getUserRegistrations(userId: string, params: PaginationParams = {}): Promise<Registration[]> {
    const queryString = buildQueryParams({ ...params, userId });
    const endpoint = `${API_ENDPOINTS.REGISTRATIONS.BASE}?${queryString}`;
    try {
      const rawRegistrations = await apiClient.get<ApiRegistration[]>(endpoint);
      return RegistrationTransformer.toRegistrationArray(rawRegistrations);
    } catch (error) {
      // If the collection/endpoint doesn't exist yet in MockAPI, treat as no data
      if (error instanceof ApiClientError && error.status === 404) {
        return [];
      }
      throw error;
    }
  }

  async getEventRegistrations(eventId: string, params: PaginationParams = {}): Promise<Registration[]> {
    const queryString = buildQueryParams({ ...params, eventId });
    const endpoint = `${API_ENDPOINTS.REGISTRATIONS.BASE}?${queryString}`;
    try {
      const rawRegistrations = await apiClient.get<ApiRegistration[]>(endpoint);
      return RegistrationTransformer.toRegistrationArray(rawRegistrations);
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 404) {
        return [];
      }
      throw error;
    }
  }

  async getRegistrationById(id: string): Promise<Registration> {
    const rawRegistration = await apiClient.get<ApiRegistration>(API_ENDPOINTS.REGISTRATIONS.BY_ID(id));
    return RegistrationTransformer.toRegistration(rawRegistration);
  }

  async cancelRegistration(id: string): Promise<void> {
    try {
      return await apiClient.delete<void>(API_ENDPOINTS.REGISTRATIONS.CANCEL(id));
    } catch (error) {
      // If the record/collection doesn't exist, consider it already cancelled
      if (error instanceof ApiClientError && (error.status === 404 || error.status === 410)) {
        return;
      }
      throw error;
    }
  }

  async updateRegistrationStatus(id: string, status: 'confirmed' | 'cancelled'): Promise<Registration> {
    const rawRegistration = await apiClient.patch<ApiRegistration>(
      API_ENDPOINTS.REGISTRATIONS.BY_ID(id),
      { status }
    );
    
    return RegistrationTransformer.toRegistration(rawRegistration);
  }

  async checkRegistrationStatus(userId: string, eventId: string): Promise<Registration | null> {
    const queryString = buildQueryParams({ userId, eventId });
    const endpoint = `${API_ENDPOINTS.REGISTRATIONS.BASE}?${queryString}`;
    try {
      const rawRegistrations = await apiClient.get<ApiRegistration[]>(endpoint);
      return rawRegistrations.length > 0 
        ? RegistrationTransformer.toRegistration(rawRegistrations[0]) 
        : null;
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }
}

export const registrationService = new RegistrationService();