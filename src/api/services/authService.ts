import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { userService } from './userService';
import { 
  LoginCredentials, 
  SignupCredentials, 
  AuthResponse, 
  User 
} from '../../types';

/**
 * Auth Service
 * Handles authentication operations with MockAPI
 * Note: MockAPI doesn't have auth endpoints, so we simulate auth using the users collection
 */
export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const user = await userService.getUserByEmail(credentials.email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real app, you'd verify the password here
    // For MockAPI, we'll just return the user
    const token = this.generateMockToken(user.id);
    
    return {
      user,
      token,
    };
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const existingUser = await userService.getUserByEmail(credentials.email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    const newUser = await userService.createUser({
      name: credentials.name,
      email: credentials.email,
      avatar: undefined,
    });
    
    const token = this.generateMockToken(newUser.id);
    
    return {
      user: newUser,
      token,
    };
  }

  async logout(): Promise<void> {
    // In a real app, you'd invalidate the token on the server
    return Promise.resolve();
  }

  async refreshToken(): Promise<{ token: string }> {
    const token = this.generateMockToken('current-user-id');
    return { token };
  }

  async getUserProfile(): Promise<User> {
    // This should be replaced with actual token parsing
    const userId = '1'; // This should come from the token
    return userService.getUserById(userId);
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const userId = '1'; // This should come from the token
    return userService.updateUser(userId, userData);
  }

  /**
   * Generate mock token for development
   * In production, this would be a proper JWT token
   */
  private generateMockToken(userId: string): string {
    return `mock_token_${userId}_${Date.now()}`;
  }

  /**
   * Extract user ID from mock token
   * In production, this would decode a JWT token
   */
  static extractUserIdFromToken(token: string): string | null {
    const match = token.match(/mock_token_(\d+)_/);
    return match ? match[1] : null;
  }
}

export const authService = new AuthService();