export class SocketConnectionError extends Error {
  constructor() {
    super('Не удалось подключиться к чату');
    this.name = 'SocketConnectionError';
  }
}

export class SocketClosedError extends Error {
  constructor() {
    super('Нет соединения с чатом, сообщение не отправлено');
    this.name = 'SocketClosedError';
  }
}
