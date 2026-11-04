import type { SignInData, SignUpData, User } from '../models/user';
import { http } from './http';

class AuthApi {
  signUp(data: SignUpData): Promise<{ id: number }> {
    return http.post('/auth/signup', { data });
  }

  signIn(data: SignInData): Promise<string> {
    return http.post('/auth/signin', { data });
  }

  getUser(): Promise<User> {
    return http.get('/auth/user');
  }

  logout(): Promise<string> {
    return http.post('/auth/logout');
  }
}

export const authApi = new AuthApi();
