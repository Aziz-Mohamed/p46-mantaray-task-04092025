import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { registrationService } from '../services/registrationService';
import { Registration } from '../../types';
import { PaginationParams } from '../endpoints';

// Query keys for registration-related queries
export const registrationKeys = {
  all: ['registrations'] as const,
  lists: () => [...registrationKeys.all, 'list'] as const,
  userRegistrations: (userId: string, params?: PaginationParams) => 
    [...registrationKeys.lists(), 'user', userId, { params }] as const,
  eventRegistrations: (eventId: string, params?: PaginationParams) => 
    [...registrationKeys.lists(), 'event', eventId, { params }] as const,
  details: () => [...registrationKeys.all, 'detail'] as const,
  detail: (id: string) => [...registrationKeys.details(), id] as const,
  status: (userId: string, eventId: string) => 
    [...registrationKeys.all, 'status', userId, eventId] as const,
};

// Hook to get user's registrations
export const useUserRegistrations = (userId: string, params: PaginationParams = {}) => {
  return useQuery({
    queryKey: registrationKeys.userRegistrations(userId, params),
    queryFn: () => registrationService.getUserRegistrations(userId, params),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get event registrations
export const useEventRegistrations = (eventId: string, params: PaginationParams = {}) => {
  return useQuery({
    queryKey: registrationKeys.eventRegistrations(eventId, params),
    queryFn: () => registrationService.getEventRegistrations(eventId, params),
    enabled: !!eventId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Hook to get a specific registration
export const useRegistration = (id: string) => {
  return useQuery({
    queryKey: registrationKeys.detail(id),
    queryFn: () => registrationService.getRegistrationById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to check registration status for a user and event
export const useRegistrationStatus = (userId: string, eventId: string) => {
  return useQuery({
    queryKey: registrationKeys.status(userId, eventId),
    queryFn: () => registrationService.checkRegistrationStatus(userId, eventId),
    enabled: !!userId && !!eventId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Hook to register for an event
export const useRegisterEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      eventId, 
      userId, 
      userName, 
      userEmail 
    }: { 
      eventId: string; 
      userId: string; 
      userName: string; 
      userEmail: string; 
    }) => registrationService.registerForEvent(eventId, userId, userName, userEmail),
    onSuccess: (newRegistration) => {
      // Invalidate user registrations
      queryClient.invalidateQueries({ 
        queryKey: registrationKeys.userRegistrations(newRegistration.userId) 
      });
      
      // Invalidate event registrations
      queryClient.invalidateQueries({ 
        queryKey: registrationKeys.eventRegistrations(newRegistration.eventId) 
      });
      
      // Invalidate registration status
      queryClient.invalidateQueries({ 
        queryKey: registrationKeys.status(newRegistration.userId, newRegistration.eventId) 
      });
      
      // Add the new registration to cache
      queryClient.setQueryData(
        registrationKeys.detail(newRegistration.id), 
        newRegistration
      );
    },
    onError: (error) => {
      console.error('Event registration failed:', error);
    },
  });
};

// Hook to cancel a registration
export const useCancelRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => registrationService.cancelRegistration(id),
    onSuccess: (_, registrationId) => {
      // Get the registration from cache to know which queries to invalidate
      const registration = queryClient.getQueryData<Registration>(
        registrationKeys.detail(registrationId)
      );
      
      if (registration) {
        // Invalidate user registrations
        queryClient.invalidateQueries({ 
          queryKey: registrationKeys.userRegistrations(registration.userId) 
        });
        
        // Invalidate event registrations
        queryClient.invalidateQueries({ 
          queryKey: registrationKeys.eventRegistrations(registration.eventId) 
        });
        
        // Invalidate registration status
        queryClient.invalidateQueries({ 
          queryKey: registrationKeys.status(registration.userId, registration.eventId) 
        });
      }
      
      // Remove the registration from cache
      queryClient.removeQueries({ queryKey: registrationKeys.detail(registrationId) });
    },
    onError: (error) => {
      console.error('Registration cancellation failed:', error);
    },
  });
};

// Hook to update registration status
export const useUpdateRegistrationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'confirmed' | 'cancelled' }) => 
      registrationService.updateRegistrationStatus(id, status),
    onSuccess: (updatedRegistration) => {
      // Update the registration in cache
      queryClient.setQueryData(
        registrationKeys.detail(updatedRegistration.id), 
        updatedRegistration
      );
      
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: registrationKeys.userRegistrations(updatedRegistration.userId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: registrationKeys.eventRegistrations(updatedRegistration.eventId) 
      });
    },
    onError: (error) => {
      console.error('Registration status update failed:', error);
    },
  });
};