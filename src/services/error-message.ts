import { HttpError, NetworkError, ServerError, TimeoutError } from '../core/http-errors';
import { ChatNotSelectedError, UserNotFoundError } from './app-errors';

const reasonMessages: Record<string, string> = {
  'Login or password is incorrect': 'Неверный логин или пароль',
  'Login already exists': 'Этот логин уже занят',
  'Email already exists': 'Эта почта уже используется',
  'Password is incorrect': 'Текущий пароль указан неверно',
  'Cookie is not valid': 'Сессия истекла, войдите заново',
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof ServerError) {
    return 'Ошибка на сервере, попробуйте позже';
  }

  if (error instanceof HttpError) {
    return reasonMessages[error.reason] ?? error.reason;
  }

  const isKnownError = error instanceof NetworkError
    || error instanceof TimeoutError
    || error instanceof UserNotFoundError
    || error instanceof ChatNotSelectedError;

  return isKnownError ? error.message : 'Что-то пошло не так, попробуйте ещё раз';
}
