import type { FormValues } from '../services/form-values';

class UserController {
  updateProfile(values: FormValues): void {
    console.log('Изменение профиля', values);
  }

  changePassword(values: FormValues): void {
    console.log('Смена пароля', values);
  }
}

export const userController = new UserController();
