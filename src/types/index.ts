// User types
export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  avatar?: string;
  registeredEventIds?: string[];
  createdAt: string;
}

// Event types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
  capacity: number;
  availableSpots: number;
  speakers: Speaker[];
  createdAt: string;
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar?: string;
}

// Registration types
export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  registeredAt: string;
  status: 'confirmed' | 'cancelled';
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Navigation types
export type RootStackParamList = {
  '(auth)': undefined;
  '(tabs)': undefined;
  'event/[id]': { id: string };
};

export type AuthStackParamList = {
  login: undefined;
  signup: undefined;
};

export type TabsStackParamList = {
  events: undefined;
  dashboard: undefined;
};
