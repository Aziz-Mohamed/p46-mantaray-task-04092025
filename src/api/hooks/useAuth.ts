import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { 
  LoginCredentials, 
  SignupCredentials, 
  AuthResponse, 
  User 
} from '../../types';

// Query keys for auth-related queries
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  user: (id: string) => [...authKeys.all, 'user', id] as const,
};

// Hook for user login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => 
      authService.login(credentials),
    onSuccess: (data: AuthResponse) => {
      // Store auth data (implement based on your storage solution)
      // You can integrate with your auth provider here
      console.log('Login successful:', data);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

// Hook for user signup
export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: SignupCredentials) => 
      authService.signup(credentials),
    onSuccess: (data: AuthResponse) => {
      // Store auth data (implement based on your storage solution)
      console.log('Signup successful:', data);
    },
    onError: (error) => {
      console.error('Signup failed:', error);
    },
  });
};

// Hook for user logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      // Clear auth data from storage
      console.log('Logout successful');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });
};

// Hook for getting user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authService.getUserProfile(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for updating user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Partial<User>) => 
      authService.updateProfile(userData),
    onSuccess: (updatedUser) => {
      // Update the profile in cache
      queryClient.setQueryData(authKeys.profile(), updatedUser);
    },
    onError: (error) => {
      console.error('Profile update failed:', error);
    },
  });
};

// Hook for refreshing token
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: () => authService.refreshToken(),
    onSuccess: (data) => {
      // Update token in storage
      console.log('Token refreshed:', data);
    },
    onError: (error) => {
      console.error('Token refresh failed:', error);
    },
  });
};
