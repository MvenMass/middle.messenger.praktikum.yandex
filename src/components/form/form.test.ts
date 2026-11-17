import { describe, expect, it, jest } from '@jest/globals';

import { HttpError } from '../../core/http-errors';
import type { FormValues } from '../../services/form-values';
import { Button } from '../button';
import { FormField } from '../form-field';
import { Form } from './form';

type SubmitHandler = (values: FormValues) => Promise<void>;

interface LoginFormOptions {
  login?: string;
  password?: string;
  onSubmit?: SubmitHandler;
  successMessage?: string;
}

function createLoginForm({
  login = 'test_user',
  password = 'Testpass123',
  onSubmit = jest.fn<SubmitHandler>().mockResolvedValue(undefined),
  successMessage,
}: LoginFormOptions = {}): Form {
  return new Form({
    fields: [
      new FormField({ label: 'Логин', name: 'login', type: 'text', value: login }),
      new FormField({ label: 'Пароль', name: 'password', type: 'password', value: password }),
    ],
    submitButton: new Button({ text: 'Войти', type: 'submit' }),
    onSubmit,
    successMessage,
  });
}

function submitForm(form: Form): void {
  form.getContent().dispatchEvent(new SubmitEvent('submit', { cancelable: true }));
}

function flushPromises(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

function getMessage(form: Form): string | null | undefined {
  return form.getContent().querySelector('.form__message')?.textContent;
}

describe('Form', () => {
  it('передаёт значения полей в onSubmit, если форма заполнена верно', async () => {
    const handleSubmit = jest.fn<SubmitHandler>().mockResolvedValue(undefined);
    const form = createLoginForm({ onSubmit: handleSubmit });

    submitForm(form);

    await flushPromises();

    expect(handleSubmit).toHaveBeenCalledWith({ login: 'test_user', password: 'Testpass123' });
  });

  it('не вызывает onSubmit и показывает ошибки полей, если форма заполнена неверно', () => {
    const handleSubmit = jest.fn<SubmitHandler>();
    const form = createLoginForm({ login: '', onSubmit: handleSubmit });

    submitForm(form);

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(form.getContent().querySelectorAll('.form-field_invalid')).toHaveLength(1);
  });

  it('отменяет перезагрузку страницы при отправке', () => {
    const form = createLoginForm();
    const event = new SubmitEvent('submit', { cancelable: true });

    form.getContent().dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('показывает понятный текст ошибки сервера', async () => {
    const handleSubmit = jest.fn<SubmitHandler>().mockRejectedValue(new HttpError(400, 'Login or password is incorrect'));
    const form = createLoginForm({ onSubmit: handleSubmit });

    submitForm(form);

    await flushPromises();

    expect(getMessage(form)).toBe('Неверный логин или пароль');
  });

  it('показывает сообщение об успехе', async () => {
    const form = createLoginForm({ successMessage: 'Данные сохранены' });

    submitForm(form);

    await flushPromises();

    expect(getMessage(form)).toBe('Данные сохранены');
  });
});
