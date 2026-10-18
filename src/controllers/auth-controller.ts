import type { FormValues } from '../services/form-values';

class AuthController {
  signIn(values: FormValues): void {
    console.log('Вход', values);
  }

  signUp(values: FormValues): void {
    console.log('Регистрация', values);
  }
}

export const authController = new AuthController();
