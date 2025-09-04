import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { eventService } from '../services/eventService';
import { Event, PaginatedResponse } from '../../types';
import { EventFilters } from '../endpoints';

// Query keys for event-related queries
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: EventFilters) => [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  featured: () => [...eventKeys.all, 'featured'] as const,
  upcoming: () => [...eventKeys.all, 'upcoming'] as const,
  search: (query: string, filters: Omit<EventFilters, 'search'>) => 
    [...eventKeys.all, 'search', { query, filters }] as const,
  category: (category: string, filters: Omit<EventFilters, 'category'>) => 
    [...eventKeys.all, 'category', category, { filters }] as const,
};

// Hook to fetch events with filters
export const useEvents = (filters: EventFilters = {}) => {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: () => eventService.getEvents(filters),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to fetch events with infinite scroll
export const useInfiniteEvents = (filters: Omit<EventFilters, 'page'> = {}) => {
  return useInfiniteQuery({
    queryKey: eventKeys.list(filters),
    queryFn: ({ pageParam = 1 }) => 
      eventService.getEvents({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage: PaginatedResponse<Event>) => {
      const { page, limit, total } = lastPage;
      const totalPages = Math.ceil(total / limit);
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });
};

// Hook to fetch a single event by ID
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventService.getEventById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to search events
export const useSearchEvents = (
  query: string, 
  filters: Omit<EventFilters, 'search'> = {}
) => {
  return useQuery({
    queryKey: eventKeys.search(query, filters),
    queryFn: () => eventService.searchEvents(query, filters),
    enabled: !!query && query.length > 2,
    keepPreviousData: true,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Hook to fetch featured events
export const useFeaturedEvents = (limit: number = 5) => {
  return useQuery({
    queryKey: eventKeys.featured(),
    queryFn: () => eventService.getFeaturedEvents(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to fetch upcoming events
export const useUpcomingEvents = (limit: number = 10) => {
  return useQuery({
    queryKey: eventKeys.upcoming(),
    queryFn: () => eventService.getUpcomingEvents(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch events by category
export const useEventsByCategory = (
  category: string, 
  filters: Omit<EventFilters, 'category'> = {}
) => {
  return useQuery({
    queryKey: eventKeys.category(category, filters),
    queryFn: () => eventService.getEventsByCategory(category, filters),
    enabled: !!category,
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

// Hook to create a new event
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventData: Omit<Event, 'id' | 'createdAt'>) => 
      eventService.createEvent(eventData),
    onSuccess: () => {
      // Invalidate all event lists to refetch
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
    onError: (error) => {
      console.error('Event creation failed:', error);
    },
  });
};

// Hook to update an event
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, eventData }: { id: string; eventData: Partial<Event> }) => 
      eventService.updateEvent(id, eventData),
    onSuccess: (updatedEvent) => {
      // Update the specific event in cache
      queryClient.setQueryData(eventKeys.detail(updatedEvent.id), updatedEvent);
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
    onError: (error) => {
      console.error('Event update failed:', error);
    },
  });
};

// Hook to delete an event
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventService.deleteEvent(id),
    onSuccess: (_, deletedId) => {
      // Remove the event from cache
      queryClient.removeQueries({ queryKey: eventKeys.detail(deletedId) });
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
    onError: (error) => {
      console.error('Event deletion failed:', error);
    },
  });
};
