import { Button, Form, FormField } from '../../components';
import { authController } from '../../controllers/auth-controller';
import { userController } from '../../controllers/user-controller';
import { Block, type BlockEvents, type BlockProps } from '../../core/block';
import type { AvatarData } from '../../models/avatar';
import type { User } from '../../models/user';
import { createAvatar } from '../../services/avatar';
import { getErrorMessage } from '../../services/error-message';
import { connect } from '../../store/connect';
import { store, type AppState } from '../../store/store';
import template from './settings-page.hbs?raw';
import './settings-page.scss';

interface ProfileView {
  name: string;
  login: string;
  avatar: AvatarData;
}

interface SettingsPageProps extends BlockProps {
  profile: ProfileView | null;
  avatarError: string;
  profileForm: Form;
  passwordForm: Form;
  logoutButton: Button;
}

function createProfileView(user: User): ProfileView {
  const name = `${user.first_name} ${user.second_name}`;

  return {
    name,
    login: user.login,
    avatar: createAvatar(user.id, name, user.avatar),
  };
}

function mapUserToProps(state: AppState): Partial<SettingsPageProps> {
  return {
    profile: state.user ? createProfileView(state.user) : null,
  };
}

function createProfileForm(user: User | null): Form {
  return new Form({
    fields: [
      new FormField({ label: 'Имя', name: 'first_name', type: 'text', value: user?.first_name }),
      new FormField({ label: 'Фамилия', name: 'second_name', type: 'text', value: user?.second_name }),
      new FormField({ label: 'Имя в чате', name: 'display_name', type: 'text', value: user?.display_name ?? '' }),
      new FormField({ label: 'Логин', name: 'login', type: 'text', value: user?.login }),
      new FormField({ label: 'Почта', name: 'email', type: 'email', value: user?.email }),
      new FormField({ label: 'Телефон', name: 'phone', type: 'tel', value: user?.phone }),
    ],
    submitButton: new Button({ text: 'Сохранить', type: 'submit' }),
    onSubmit: (values) => userController.updateProfile(values),
    successMessage: 'Данные сохранены',
  });
}

function createPasswordForm(): Form {
  return new Form({
    fields: [
      new FormField({ label: 'Текущий пароль', name: 'old_password', type: 'password' }),
      new FormField({ label: 'Новый пароль', name: 'new_password', type: 'password' }),
    ],
    submitButton: new Button({ text: 'Изменить пароль', type: 'submit' }),
    onSubmit: (values) => userController.changePassword(values),
    successMessage: 'Пароль изменён',
    resetOnSuccess: true,
  });
}

class SettingsPage extends Block<SettingsPageProps> {
  constructor() {
    const { user } = store.getState();

    super({
      profile: null,
      avatarError: '',
      profileForm: createProfileForm(user),
      passwordForm: createPasswordForm(),
      logoutButton: new Button({
        text: 'Выйти из аккаунта',
        type: 'button',
        modifier: 'danger',
        events: {
          click: () => authController.logout(),
        },
      }),
    });
  }

  protected getEvents(): BlockEvents {
    return {
      change: (event) => this.handleAvatarChange(event),
    };
  }

  protected render(): string {
    return template;
  }

  private async handleAvatarChange(event: Event): Promise<void> {
    const input = event.target;
    const isAvatarInput = input instanceof HTMLInputElement && input.name === 'avatar';
    const file = isAvatarInput ? input.files?.[0] : undefined;

    if (!file) {
      return;
    }

    try {
      await userController.updateAvatar(file);
      this.setProps({ avatarError: '' });
    } catch (error) {
      this.setProps({ avatarError: getErrorMessage(error) });
    }
  }
}

const ConnectedSettingsPage = connect(mapUserToProps)(SettingsPage);

export { ConnectedSettingsPage as SettingsPage };
