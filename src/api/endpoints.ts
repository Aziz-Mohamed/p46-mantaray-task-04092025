// API Endpoints configuration
// This centralizes all endpoint definitions for better maintainability

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },

  // User endpoints
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    BY_ID: (id: string) => `/users/${id}`,
    UPDATE_PROFILE: '/users/profile',
  },

  // Event endpoints
  EVENTS: {
    BASE: '/events',
    BY_ID: (id: string) => `/events/${id}`,
    SEARCH: '/events/search',
    FEATURED: '/events/featured',
    UPCOMING: '/events/upcoming',
    BY_CATEGORY: (category: string) => `/events/category/${category}`,
  },

  // Registration endpoints
  REGISTRATIONS: {
    BASE: '/registrations',
    BY_ID: (id: string) => `/registrations/${id}`,
    BY_USER: (userId: string) => `/registrations?userId=${userId}`,
    BY_EVENT: (eventId: string) => `/registrations?eventId=${eventId}`,
    REGISTER: '/registrations',
    CANCEL: (id: string) => `/registrations/${id}`,
  },

  // Speaker endpoints
  SPEAKERS: {
    BASE: '/speakers',
    BY_ID: (id: string) => `/speakers/${id}`,
    BY_EVENT: (eventId: string) => `/speakers?eventId=${eventId}`,
  },

  // Category endpoints
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id: string) => `/categories/${id}`,
  },
} as const;

// Query parameter builders
export const buildQueryParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};

// Common query parameter types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams extends PaginationParams {
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface EventFilters extends SearchParams {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  priceMin?: number;
  priceMax?: number;
  location?: string;
}
