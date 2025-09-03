import { LoginCredentials, SignupCredentials, AuthResponse, User } from '../types';
import { API_BASE_URL, API_ENDPOINTS } from '../constants';

class AuthService {
  private baseURL = API_BASE_URL;

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>(API_ENDPOINTS.SIGNUP, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(token: string): Promise<void> {
    await this.makeRequest<void>(API_ENDPOINTS.LOGOUT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUserProfile(token: string): Promise<User> {
    return this.makeRequest<User>(API_ENDPOINTS.USER_PROFILE, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async refreshToken(token: string): Promise<{ token: string }> {
    return this.makeRequest<{ token: string }>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const authService = new AuthService();
