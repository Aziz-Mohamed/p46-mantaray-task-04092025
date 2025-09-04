import { apiClient } from '../client';
import { API_ENDPOINTS, buildQueryParams, PaginationParams } from '../endpoints';
import { User } from '../../types';
import { UserTransformer, ApiUser } from '../transformers';

/**
 * User Service
 * Handles all user-related API operations with clean data transformation
 */
export class UserService {
  async getUsers(params: PaginationParams = {}): Promise<User[]> {
    const queryString = buildQueryParams(params);
    const endpoint = queryString 
      ? `${API_ENDPOINTS.USERS.BASE}?${queryString}`
      : API_ENDPOINTS.USERS.BASE;
    
    const rawUsers = await apiClient.get<ApiUser[]>(endpoint);
    return UserTransformer.toUserArray(rawUsers);
  }

  async getUserById(id: string): Promise<User> {
    const rawUser = await apiClient.get<ApiUser>(API_ENDPOINTS.USERS.BY_ID(id));
    return UserTransformer.toUser(rawUser);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const queryString = buildQueryParams({ email });
    const endpoint = `${API_ENDPOINTS.USERS.BASE}?${queryString}`;
    
    const rawUsers = await apiClient.get<ApiUser[]>(endpoint);
    return rawUsers.length > 0 ? UserTransformer.toUser(rawUsers[0]) : null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const apiUserData = UserTransformer.toApiUser(userData);
    const rawUser = await apiClient.post<ApiUser>(API_ENDPOINTS.USERS.BASE, apiUserData);
    return UserTransformer.toUser(rawUser);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const apiUserData = UserTransformer.toApiUser(userData);
    const rawUser = await apiClient.put<ApiUser>(API_ENDPOINTS.USERS.BY_ID(id), apiUserData);
    return UserTransformer.toUser(rawUser);
  }

  async deleteUser(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.USERS.BY_ID(id));
  }

  async searchUsers(query: string, params: PaginationParams = {}): Promise<User[]> {
    const allUsers = await this.getUsers();
    
    const filteredUsers = allUsers.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
    
    return filteredUsers;
  }
}

export const userService = new UserService();
