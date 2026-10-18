import { Button, Form, FormField, Link } from '../../components';
import { authController } from '../../controllers/auth-controller';
import { AuthPage } from './auth-page';

export class SignUpPage extends AuthPage {
  constructor() {
    super({
      title: 'Регистрация',
      subtitle: 'Заполните данные, чтобы создать аккаунт',
      form: new Form({
        className: 'auth__form',
        fields: [
          new FormField({ label: 'Почта', name: 'email', type: 'email' }),
          new FormField({ label: 'Логин', name: 'login', type: 'text' }),
          new FormField({ label: 'Имя', name: 'first_name', type: 'text' }),
          new FormField({ label: 'Фамилия', name: 'second_name', type: 'text' }),
          new FormField({ label: 'Телефон', name: 'phone', type: 'tel' }),
          new FormField({ label: 'Пароль', name: 'password', type: 'password' }),
        ],
        submitButton: new Button({ text: 'Зарегистрироваться', type: 'submit' }),
        onSubmit: (values) => authController.signUp(values),
      }),
      link: new Link({ href: '/', text: 'Уже есть аккаунт? Войти' }),
    });
  }
}
