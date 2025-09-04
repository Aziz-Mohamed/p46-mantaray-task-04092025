// API Configuration
export const API_BASE_URL = 'https://68b8cb55b715405043291bcf.mockapi.io/api/v1';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  
  // User endpoints
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  
  // Event endpoints
  EVENTS: '/events',
  EVENT_DETAILS: (id: string) => `/events/${id}`,
  
  // Registration endpoints
  REGISTRATIONS: '/registrations',
  REGISTER_EVENT: '/registrations',
  USER_REGISTRATIONS: (userId: string) => `/registrations?userId=${userId}`,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
} as const;

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'EventBook',
  VERSION: '1.0.0',
  DEFAULT_PAGE_SIZE: 10,
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
  STALE_TIME: 2 * 60 * 1000, // 2 minutes
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
} as const;

// UI Constants
export const UI_CONSTANTS = {
  COLORS: {
    PRIMARY: '#007AFF',
    SECONDARY: '#5856D6',
    SUCCESS: '#34C759',
    WARNING: '#FF9500',
    ERROR: '#FF3B30',
    BACKGROUND: '#F2F2F7',
    SURFACE: '#FFFFFF',
    TEXT_PRIMARY: '#000000',
    TEXT_SECONDARY: '#8E8E93',
  },
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
  },
  BORDER_RADIUS: {
    SM: 8,
    MD: 12,
    LG: 16,
  },
} as const;
