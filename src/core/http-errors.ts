export class HttpError extends Error {
  readonly status: number;

  readonly reason: string;

  constructor(status: number, reason: string) {
    super(`Запрос завершился с ошибкой ${status}: ${reason}`);
    this.name = 'HttpError';
    this.status = status;
    this.reason = reason;
  }
}

export class UnauthorizedError extends HttpError {
  constructor(reason: string) {
    super(401, reason);
    this.name = 'UnauthorizedError';
  }
}

export class ServerError extends HttpError {
  constructor(status: number, reason: string) {
    super(status, reason);
    this.name = 'ServerError';
  }
}

export class NetworkError extends Error {
  constructor() {
    super('Нет соединения с сервером');
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(timeout: number) {
    super(`Сервер не ответил за ${timeout / 1000} с`);
    this.name = 'TimeoutError';
  }
}

export function createHttpError(status: number, reason: string): HttpError {
  if (status === 401) {
    return new UnauthorizedError(reason);
  }

  if (status >= 500) {
    return new ServerError(status, reason);
  }

  return new HttpError(status, reason);
}
