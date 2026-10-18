import { Avatar, Button, Form, FormField, Link } from '../../components';
import { userController } from '../../controllers/user-controller';
import { Block, type BlockProps } from '../../core/block';
import { user } from '../../mocks/user';
import type { UserProfile } from '../../models/user';
import template from './settings-page.hbs?raw';
import './settings-page.scss';

interface SettingsPageProps extends BlockProps {
  user: UserProfile;
  avatar: Avatar;
  profileForm: Form;
  passwordForm: Form;
  logoutLink: Link;
}

function createProfileForm(profile: UserProfile): Form {
  return new Form({
    fields: [
      new FormField({ label: 'Имя', name: 'first_name', type: 'text', value: profile.firstName }),
      new FormField({ label: 'Фамилия', name: 'second_name', type: 'text', value: profile.secondName }),
      new FormField({ label: 'Имя в чате', name: 'display_name', type: 'text', value: profile.displayName }),
      new FormField({ label: 'Логин', name: 'login', type: 'text', value: profile.login }),
      new FormField({ label: 'Почта', name: 'email', type: 'email', value: profile.email }),
      new FormField({ label: 'Телефон', name: 'phone', type: 'tel', value: profile.phone }),
    ],
    submitButton: new Button({ text: 'Сохранить', type: 'submit' }),
    onSubmit: (values) => userController.updateProfile(values),
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
  });
}

export class SettingsPage extends Block<SettingsPageProps> {
  constructor() {
    super({
      user,
      avatar: new Avatar({ initials: user.initials, color: user.color, size: 'large' }),
      profileForm: createProfileForm(user),
      passwordForm: createPasswordForm(),
      logoutLink: new Link({ href: '/', text: 'Выйти из аккаунта', modifier: 'danger' }),
    });
  }

  protected render(): string {
    return template;
  }
}
