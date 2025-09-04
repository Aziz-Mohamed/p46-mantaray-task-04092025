import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { 
  LoginCredentials, 
  SignupCredentials, 
  AuthResponse, 
  User 
} from '../../types';

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.SIGNUP,
      credentials
    );
  }

  async logout(): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async refreshToken(): Promise<{ token: string }> {
    return apiClient.post<{ token: string }>(API_ENDPOINTS.AUTH.REFRESH);
  }

  async getUserProfile(): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.PROFILE);
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    return apiClient.put<User>(
      API_ENDPOINTS.USERS.UPDATE_PROFILE,
      userData
    );
  }
}

export const authService = new AuthService();
