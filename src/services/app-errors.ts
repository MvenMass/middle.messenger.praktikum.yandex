export class UserNotFoundError extends Error {
  constructor(login: string) {
    super(`Пользователь с логином ${login} не найден`);
    this.name = 'UserNotFoundError';
  }
}

export class ChatNotSelectedError extends Error {
  constructor() {
    super('Сначала выберите чат');
    this.name = 'ChatNotSelectedError';
  }
}
