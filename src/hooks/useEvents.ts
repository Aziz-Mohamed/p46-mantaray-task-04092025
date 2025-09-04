import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../api/services/eventService';
import { useAuth } from '../providers/authProvider';
import { Event, Registration } from '../types';

// Query keys for consistent caching
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  registrations: () => [...eventKeys.all, 'registrations'] as const,
  userRegistrations: (userId: string) => [...eventKeys.registrations(), userId] as const,
};

// Hook to fetch events with pagination
export const useEvents = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: eventKeys.list({ page, limit }),
    queryFn: () => eventService.getEvents({ page, limit }),
  });
};

// Hook to fetch a single event by ID
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventService.getEventById(id),
    enabled: !!id,
  });
};

// Hook to search events
export const useSearchEvents = (query: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: eventKeys.list({ search: query, page, limit }),
    queryFn: () => eventService.searchEvents(query, { page, limit }),
    enabled: !!query && query.length > 2,
  });
};

// Hook to register for an event
export const useRegisterEvent = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (eventId: string) => {
      if (!token) throw new Error('No authentication token');
      return eventService.registerForEvent(eventId, token);
    },
    onSuccess: (data) => {
      // Invalidate and refetch user registrations
      queryClient.invalidateQueries({ queryKey: eventKeys.registrations() });
      
      // Update the specific event's available spots
      queryClient.setQueryData(
        eventKeys.detail(data.eventId),
        (oldData: Event | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            availableSpots: Math.max(0, oldData.availableSpots - 1),
          };
        }
      );
    },
  });
};

// Hook to get user's registrations
export const useUserRegistrations = () => {
  const { user, token } = useAuth();

  return useQuery({
    queryKey: eventKeys.userRegistrations(user?.id || ''),
    queryFn: () => {
      if (!user?.id || !token) throw new Error('User not authenticated');
      return eventService.getUserRegistrations(user.id, token);
    },
    enabled: !!user?.id && !!token,
  });
};

// Hook to cancel a registration
export const useCancelRegistration = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (registrationId: string) => {
      if (!token) throw new Error('No authentication token');
      return eventService.cancelRegistration(registrationId, token);
    },
    onSuccess: (_, registrationId) => {
      // Invalidate user registrations
      queryClient.invalidateQueries({ queryKey: eventKeys.registrations() });
      
      // Remove the registration from cache
      queryClient.setQueryData(
        eventKeys.registrations(),
        (oldData: Registration[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.filter(reg => reg.id !== registrationId);
        }
      );
    },
  });
};
