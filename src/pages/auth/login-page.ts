import { Button, Form, FormField, Link } from '../../components';
import { authController } from '../../controllers/auth-controller';
import { AuthPage } from './auth-page';

export class LoginPage extends AuthPage {
  constructor() {
    super({
      title: 'Вход',
      subtitle: 'Введите логин и пароль от своего аккаунта',
      form: new Form({
        className: 'auth__form',
        fields: [
          new FormField({ label: 'Логин', name: 'login', type: 'text' }),
          new FormField({ label: 'Пароль', name: 'password', type: 'password' }),
        ],
        submitButton: new Button({ text: 'Войти', type: 'submit' }),
        onSubmit: (values) => authController.signIn(values),
      }),
      link: new Link({ href: '/sign-up', text: 'Нет аккаунта? Зарегистрироваться' }),
    });
  }
}
