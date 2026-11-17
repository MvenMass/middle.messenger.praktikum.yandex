import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';

import { HttpError, NetworkError, ServerError, TimeoutError, UnauthorizedError } from './http-errors';
import { HTTPTransport } from './http-transport';

const BASE_URL = 'https://api.test';

const OriginalXMLHttpRequest = globalThis.XMLHttpRequest;

class FakeXMLHttpRequest {
  static requests: FakeXMLHttpRequest[] = [];

  method = '';

  url = '';

  body: unknown = null;

  withCredentials = false;

  timeout = 0;

  status = 0;

  statusText = '';

  responseText = '';

  requestHeaders: Record<string, string> = {};

  responseHeaders: Record<string, string> = {};

  onload: (() => void) | null = null;

  onerror: (() => void) | null = null;

  ontimeout: (() => void) | null = null;

  constructor() {
    FakeXMLHttpRequest.requests.push(this);
  }

  open(method: string, url: string): void {
    this.method = method;
    this.url = url;
  }

  setRequestHeader(name: string, value: string): void {
    this.requestHeaders[name] = value;
  }

  getResponseHeader(name: string): string | null {
    return this.responseHeaders[name] ?? null;
  }

  send(body: unknown = null): void {
    this.body = body;
  }

  respond(status: number, body: unknown, contentType = 'application/json'): void {
    this.status = status;
    this.responseText = typeof body === 'string' ? body : JSON.stringify(body);
    this.responseHeaders['Content-Type'] = contentType;
    this.onload?.();
  }
}

function getLastRequest(): FakeXMLHttpRequest {
  const request = FakeXMLHttpRequest.requests.at(-1);

  if (!request) {
    throw new Error('Запрос не был отправлен');
  }

  return request;
}

function createTransport(): HTTPTransport {
  return new HTTPTransport(BASE_URL);
}

describe('HTTPTransport', () => {
  beforeEach(() => {
    FakeXMLHttpRequest.requests = [];
    globalThis.XMLHttpRequest = FakeXMLHttpRequest as unknown as typeof XMLHttpRequest;
  });

  afterEach(() => {
    globalThis.XMLHttpRequest = OriginalXMLHttpRequest;
  });

  describe('отправка запроса', () => {
    it('добавляет query string к GET-запросу', () => {
      createTransport().get('/chats', { data: { title: 'тест', limit: 10 } });

      expect(getLastRequest().method).toBe('GET');
      expect(getLastRequest().url).toBe(`${BASE_URL}/chats?title=%D1%82%D0%B5%D1%81%D1%82&limit=10`);
    });

    it('не добавляет в query string пустые значения', () => {
      createTransport().get('/chats', { data: { title: undefined, offset: null } });

      expect(getLastRequest().url).toBe(`${BASE_URL}/chats`);
    });

    it('отправляет данные POST-запроса в теле в формате JSON', () => {
      createTransport().post('/auth/signin', { data: { login: 'test' } });

      expect(getLastRequest().body).toBe('{"login":"test"}');
      expect(getLastRequest().requestHeaders['Content-Type']).toBe('application/json');
    });

    it('отправляет FormData в PUT-запросе без изменений', () => {
      const formData = new FormData();

      createTransport().put('/user/profile/avatar', { data: formData });

      expect(getLastRequest().body).toBe(formData);
      expect(getLastRequest().requestHeaders['Content-Type']).toBeUndefined();
    });

    it('отправляет тело DELETE-запроса', () => {
      createTransport().delete('/chats', { data: { chatId: 1 } });

      expect(getLastRequest().method).toBe('DELETE');
      expect(getLastRequest().body).toBe('{"chatId":1}');
    });

    it('передаёт cookie вместе с запросом', () => {
      createTransport().get('/auth/user');

      expect(getLastRequest().withCredentials).toBe(true);
    });

    it('устанавливает таймаут из настроек', () => {
      createTransport().get('/auth/user', { timeout: 1000 });

      expect(getLastRequest().timeout).toBe(1000);
    });
  });

  describe('обработка ответа', () => {
    it('возвращает разобранный JSON', async () => {
      const response = createTransport().get('/auth/user');

      getLastRequest().respond(200, { id: 1 });

      await expect(response).resolves.toEqual({ id: 1 });
    });

    it('возвращает текст, если ответ не в формате JSON', async () => {
      const response = createTransport().post('/auth/logout');

      getLastRequest().respond(200, 'OK', 'text/plain');

      await expect(response).resolves.toBe('OK');
    });
  });

  describe('ошибки', () => {
    it('отклоняет запрос с UnauthorizedError при статусе 401', async () => {
      const response = createTransport().get('/auth/user');

      getLastRequest().respond(401, { reason: 'Cookie is not valid' });

      await expect(response).rejects.toBeInstanceOf(UnauthorizedError);
    });

    it('отклоняет запрос с ServerError при статусе 500', async () => {
      const response = createTransport().get('/chats');

      getLastRequest().respond(500, { reason: 'Internal error' });

      await expect(response).rejects.toBeInstanceOf(ServerError);
    });

    it('передаёт причину ошибки из ответа сервера', async () => {
      const response = createTransport().post('/auth/signin');

      getLastRequest().respond(400, { reason: 'Login or password is incorrect' });

      await expect(response).rejects.toMatchObject({ status: 400, reason: 'Login or password is incorrect' });
      await expect(response).rejects.toBeInstanceOf(HttpError);
    });

    it('отклоняет запрос с NetworkError при ошибке сети', async () => {
      const response = createTransport().get('/chats');

      getLastRequest().onerror?.();

      await expect(response).rejects.toBeInstanceOf(NetworkError);
    });

    it('отклоняет запрос с TimeoutError по истечении таймаута', async () => {
      const response = createTransport().get('/chats');

      getLastRequest().ontimeout?.();

      await expect(response).rejects.toBeInstanceOf(TimeoutError);
    });
  });
});
