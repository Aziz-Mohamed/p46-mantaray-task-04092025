import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { User } from '../../types';
import { PaginationParams } from '../endpoints';

// Query keys for user-related queries
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...userKeys.lists(), { params }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  search: (query: string) => [...userKeys.all, 'search', query] as const,
  byEmail: (email: string) => [...userKeys.all, 'email', email] as const,
};

// Hook to fetch users with pagination
export const useUsers = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch a single user by ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch a user by email
export const useUserByEmail = (email: string) => {
  return useQuery({
    queryKey: userKeys.byEmail(email),
    queryFn: () => userService.getUserByEmail(email),
    enabled: !!email,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to search users
export const useSearchUsers = (query: string, params: PaginationParams = {}) => {
  return useQuery({
    queryKey: userKeys.search(query),
    queryFn: () => userService.searchUsers(query, params),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to create a new user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Omit<User, 'id' | 'createdAt'>) => 
      userService.createUser(userData),
    onSuccess: () => {
      // Invalidate all user lists to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('User creation failed:', error);
    },
  });
};

// Hook to update a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<User> }) => 
      userService.updateUser(id, userData),
    onSuccess: (updatedUser) => {
      // Update the specific user in cache
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('User update failed:', error);
    },
  });
};

// Hook to delete a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: (_, deletedId) => {
      // Remove the user from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('User deletion failed:', error);
    },
  });
};
