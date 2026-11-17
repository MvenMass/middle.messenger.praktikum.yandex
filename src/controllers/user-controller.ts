import { userApi } from '../api/user-api';
import type { FormValues } from '../services/form-values';
import { store } from '../store/store';

class UserController {
  async updateProfile(values: FormValues): Promise<void> {
    const user = await userApi.updateProfile({
      first_name: values.first_name,
      second_name: values.second_name,
      display_name: values.display_name,
      login: values.login,
      email: values.email,
      phone: values.phone,
    });

    store.set({ user });
  }

  async changePassword(values: FormValues): Promise<void> {
    await userApi.changePassword({
      oldPassword: values.old_password,
      newPassword: values.new_password,
    });
  }

  async updateAvatar(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('avatar', file);

    store.set({ user: await userApi.updateAvatar(formData) });
  }
}

export const userController = new UserController();
