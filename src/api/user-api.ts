import type { PasswordData, ProfileData, User, UserSearchData } from '../models/user';
import { http } from './http';

class UserApi {
  updateProfile(data: ProfileData): Promise<User> {
    return http.put('/user/profile', { data });
  }

  updateAvatar(data: FormData): Promise<User> {
    return http.put('/user/profile/avatar', { data });
  }

  changePassword(data: PasswordData): Promise<string> {
    return http.put('/user/password', { data });
  }

  searchUsers(data: UserSearchData): Promise<User[]> {
    return http.post('/user/search', { data });
  }
}

export const userApi = new UserApi();
