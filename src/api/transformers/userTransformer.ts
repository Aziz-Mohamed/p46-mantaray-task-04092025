import { User } from '../../types';
import { ApiUser } from './types';

/**
 * User Data Transformer
 * Handles conversion between MockAPI format and app format
 */
export class UserTransformer {
  /**
   * Transform raw API user data to app format
   */
  static toUser(apiUser: ApiUser): User {
    return {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      password: apiUser.password,
      avatar: apiUser.avatar,
      createdAt: apiUser.createdAt,
    };
  }

  /**
   * Transform app user data to API format
   */
  static toApiUser(user: Partial<User>): Partial<ApiUser> {
    const apiUser: Partial<ApiUser> = {};

    if (user.name) apiUser.name = user.name;
    if (user.email) apiUser.email = user.email;
    if (user.password) apiUser.password = user.password;
    if (user.avatar !== undefined) apiUser.avatar = user.avatar;
    if (user.createdAt) apiUser.createdAt = user.createdAt;

    return apiUser;
  }

  /**
   * Transform array of API users to app format
   */
  static toUserArray(apiUsers: ApiUser[]): User[] {
    return apiUsers.map(apiUser => this.toUser(apiUser));
  }
}
