import { userService } from './userService';
import { 
  LoginCredentials, 
  SignupCredentials, 
  AuthResponse, 
  User 
} from '../../types';

/**
 * Auth Service
 * Handles authentication operations with local user data
 * Fetches all users once and stores them locally for fast access
 */
export class AuthService {
  private static users: User[] = [];
  private static isInitialized = false;

  /**
   * Initialize users data by fetching from MockAPI
   */
  async initializeUsers(): Promise<void> {
    if (AuthService.isInitialized) return;
    
    try {
      AuthService.users = await userService.getUsers();
      AuthService.isInitialized = true;
      console.log(`✅ Loaded ${AuthService.users.length} users locally`);
    } catch (error) {
      console.error('Failed to initialize users:', error);
      throw new Error('Failed to load users data');
    }
  }

  /**
   * Get all users from local cache
   */
  getUsers(): User[] {
    return AuthService.users;
  }

  /**
   * Find user by email from local cache
   */
  private findUserByEmail(email: string): User | null {
    return AuthService.users.find(user => user.email === email) || null;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Ensure users are loaded
    if (!AuthService.isInitialized) {
      await this.initializeUsers();
    }

    const user = this.findUserByEmail(credentials.email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check if password matches
    if (user.password !== credentials.password) {
      throw new Error('Invalid password');
    }
    
    const token = this.generateMockToken(user.id);
    
    return {
      user,
      token,
    };
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    // Ensure users are loaded
    if (!AuthService.isInitialized) {
      await this.initializeUsers();
    }

    const existingUser = this.findUserByEmail(credentials.email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create new user locally first
    const newUser: User = {
      id: (AuthService.users.length + 1).toString(),
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
      avatar: undefined,
      createdAt: new Date().toISOString(),
    };

    // Add to local cache
    AuthService.users.push(newUser);

    // Also save to MockAPI (optional, for persistence)
    try {
      await userService.createUser(newUser);
    } catch (error) {
      console.warn('Failed to save user to MockAPI:', error);
      // Continue anyway since we have it locally
    }
    
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
    const user = AuthService.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const userId = '1'; // This should come from the token
    const userIndex = AuthService.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Update locally
    AuthService.users[userIndex] = { ...AuthService.users[userIndex], ...userData };
    
    // Also update in MockAPI (optional)
    try {
      await userService.updateUser(userId, userData);
    } catch (error) {
      console.warn('Failed to update user in MockAPI:', error);
    }
    
    return AuthService.users[userIndex];
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