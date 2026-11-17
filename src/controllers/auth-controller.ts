import { authApi } from '../api/auth-api';
import { UnauthorizedError } from '../core/http-errors';
import { router, Routes } from '../routes';
import type { FormValues } from '../services/form-values';
import { store } from '../store/store';
import { handleRequestFailure } from './handle-request-failure';

class AuthController {
  async fetchUser(): Promise<void> {
    try {
      store.set({ user: await authApi.getUser() });
    } catch (error) {
      if (!(error instanceof UnauthorizedError)) {
        throw error;
      }

      store.set({ user: null });
    }
  }

  async signIn(values: FormValues): Promise<void> {
    await authApi.signIn({ login: values.login, password: values.password });
    await this.openMessenger();
  }

  async signUp(values: FormValues): Promise<void> {
    await authApi.signUp({
      first_name: values.first_name,
      second_name: values.second_name,
      login: values.login,
      email: values.email,
      phone: values.phone,
      password: values.password,
    });
    await this.openMessenger();
  }

  async logout(): Promise<void> {
    try {
      await authApi.logout();
      store.reset();
      router.go(Routes.Login);
    } catch (error) {
      handleRequestFailure(error);
    }
  }

  private async openMessenger(): Promise<void> {
    store.set({ user: await authApi.getUser() });
    router.go(Routes.Messenger);
  }
}

export const authController = new AuthController();
