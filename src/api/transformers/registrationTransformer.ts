import { Registration } from '../../types';
import { ApiRegistration } from './types';

/**
 * Registration Data Transformer
 * Handles conversion between MockAPI format and app format
 */
export class RegistrationTransformer {
  /**
   * Transform raw API registration data to app format
   */
  static toRegistration(apiRegistration: ApiRegistration): Registration {
    return {
      id: apiRegistration.id,
      userId: apiRegistration.userId,
      eventId: apiRegistration.eventId,
      registeredAt: apiRegistration.registeredAt,
      status: apiRegistration.status,
    };
  }

  /**
   * Transform app registration data to API format
   */
  static toApiRegistration(registration: Partial<Registration> & { 
    userName?: string; 
    userEmail?: string; 
  }): Partial<ApiRegistration> {
    const apiRegistration: Partial<ApiRegistration> = {};

    if (registration.userId) apiRegistration.userId = registration.userId;
    if (registration.eventId) apiRegistration.eventId = registration.eventId;
    if (registration.registeredAt) apiRegistration.registeredAt = registration.registeredAt;
    if (registration.status) apiRegistration.status = registration.status;
    if (registration.userName) apiRegistration.userName = registration.userName;
    if (registration.userEmail) apiRegistration.userEmail = registration.userEmail;

    return apiRegistration;
  }

  /**
   * Transform array of API registrations to app format
   */
  static toRegistrationArray(apiRegistrations: ApiRegistration[]): Registration[] {
    return apiRegistrations.map(apiRegistration => this.toRegistration(apiRegistration));
  }

  /**
   * Create registration with user details for API
   */
  static createRegistrationWithUserDetails(
    eventId: string, 
    userId: string, 
    userName: string, 
    userEmail: string
  ): Partial<ApiRegistration> {
    return {
      userId,
      eventId,
      userName,
      userEmail,
      status: 'confirmed',
    };
  }
}
