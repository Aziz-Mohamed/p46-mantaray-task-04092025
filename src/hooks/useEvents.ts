import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../api/services/eventService';
import { registrationService } from '../api/services/registrationService';
import { userService } from '../api/services/userService';
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
    queryFn: async () => {
      console.log('🔍 useEvents: Starting fetch with page:', page, 'limit:', limit);
      try {
        const result = await eventService.getEvents({ page, limit });
        console.log('✅ useEvents: Success - got', result.data.length, 'events');
        return result;
      } catch (error) {
        console.error('❌ useEvents: Error:', error.message);
        throw error;
      }
    },
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
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      const currentUser = await userService.getUserById(user.id);
      const nextIds = Array.from(new Set([...(currentUser.registeredEventIds || []), eventId]));
      await userService.updateUser(user.id, { registeredEventIds: nextIds });
      return { eventId, userId: user.id } as any;
    },
    onSuccess: async (data) => {
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
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: eventKeys.userRegistrations(user.id) });
      }
    },
  });
};

// Hook to get user's registrations
export const useUserRegistrations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: eventKeys.userRegistrations(user?.id || ''),
    // Never throw just because user isn't set yet; return empty list instead
    queryFn: async () => {
      if (!user?.id) return [];
      // Try dedicated registrations resource first
      const regs = await registrationService.getUserRegistrations(user.id);
      if (regs.length > 0) {
        // Enrich with event details expected by the Dashboard UI
        const items = await Promise.all(
          regs.map(async (r) => ({
            id: r.id,
            event: await eventService.getEventById(r.eventId),
          }))
        );
        return items;
      }
      // Fallback: mirror from user document's registeredEventIds
      const u = await userService.getUserById(user.id);
      const ids = u.registeredEventIds || [];
      const items = await Promise.all(
        ids.map(async (eventId, idx) => ({
          id: `${user.id}-${eventId}-${idx}`,
          event: await eventService.getEventById(eventId),
        }))
      );
      return items;
    },
    enabled: true,
    retry: 1,
  });
};

// Hook to cancel a registration
export const useCancelRegistration = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      const currentUser = await userService.getUserById(user.id);
      const nextIds = (currentUser.registeredEventIds || []).filter(id => id !== eventId);
      await userService.updateUser(user.id, { registeredEventIds: nextIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.registrations() });
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: eventKeys.userRegistrations(user.id) });
      }
    },
  });
};
