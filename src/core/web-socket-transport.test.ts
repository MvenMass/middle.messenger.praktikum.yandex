import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { SocketClosedError, SocketConnectionError } from './socket-errors';
import { WebSocketTransport } from './web-socket-transport';

const OriginalWebSocket = globalThis.WebSocket;

class FakeWebSocket extends EventTarget {
  static OPEN = 1;

  static sockets: FakeWebSocket[] = [];

  readonly url: string;

  readyState = 0;

  sentMessages: string[] = [];

  constructor(url: string) {
    super();
    this.url = url;
    FakeWebSocket.sockets.push(this);
  }

  send(data: string): void {
    this.sentMessages.push(data);
  }

  close(): void {
    this.readyState = 3;
  }

  simulateOpen(): void {
    this.readyState = FakeWebSocket.OPEN;
    this.dispatchEvent(new Event('open'));
  }

  simulateMessage(data: string): void {
    this.dispatchEvent(new MessageEvent('message', { data }));
  }

  simulateClose(wasClean: boolean): void {
    this.readyState = 3;
    this.dispatchEvent(new CloseEvent('close', { wasClean }));
  }
}

function getLastSocket(): FakeWebSocket {
  const socket = FakeWebSocket.sockets.at(-1);

  if (!socket) {
    throw new Error('Сокет не был создан');
  }

  return socket;
}

async function createConnectedTransport(): Promise<WebSocketTransport> {
  const transport = new WebSocketTransport('wss://chat.test');
  const connection = transport.connect();

  getLastSocket().simulateOpen();
  await connection;

  return transport;
}

describe('WebSocketTransport', () => {
  beforeEach(() => {
    FakeWebSocket.sockets = [];
    globalThis.WebSocket = FakeWebSocket as unknown as typeof WebSocket;
  });

  afterEach(() => {
    jest.useRealTimers();
    globalThis.WebSocket = OriginalWebSocket;
  });

  it('подключается по переданному адресу', async () => {
    await createConnectedTransport();

    expect(getLastSocket().url).toBe('wss://chat.test');
  });

  it('отклоняет подключение с SocketConnectionError при ошибке', async () => {
    const connection = new WebSocketTransport('wss://chat.test').connect();

    getLastSocket().dispatchEvent(new Event('error'));

    await expect(connection).rejects.toBeInstanceOf(SocketConnectionError);
  });

  it('отправляет данные в формате JSON', async () => {
    const transport = await createConnectedTransport();

    transport.send({ type: 'message', content: 'Привет' });

    expect(getLastSocket().sentMessages).toEqual(['{"type":"message","content":"Привет"}']);
  });

  it('выбрасывает SocketClosedError при отправке в закрытое соединение', () => {
    const transport = new WebSocketTransport('wss://chat.test');

    expect(() => transport.send({ type: 'message', content: 'Привет' })).toThrow(SocketClosedError);
  });

  it('отправляет ping с интервалом', async () => {
    jest.useFakeTimers();
    await createConnectedTransport();

    jest.advanceTimersByTime(15000);

    expect(getLastSocket().sentMessages).toEqual(['{"type":"ping"}']);
  });

  it('передаёт подписчикам разобранное сообщение', async () => {
    const transport = await createConnectedTransport();
    const handleMessage = jest.fn();
    transport.on('message', handleMessage);

    getLastSocket().simulateMessage('{"type":"message","content":"Привет"}');

    expect(handleMessage).toHaveBeenCalledWith({ type: 'message', content: 'Привет' });
  });

  it('передаёт null, если пришёл не JSON', async () => {
    const transport = await createConnectedTransport();
    const handleMessage = jest.fn();
    transport.on('message', handleMessage);

    getLastSocket().simulateMessage('не json');

    expect(handleMessage).toHaveBeenCalledWith(null);
  });

  it('сообщает об обрыве соединения', async () => {
    const transport = await createConnectedTransport();
    const handleClose = jest.fn();
    transport.on('close', handleClose);

    getLastSocket().simulateClose(false);

    expect(handleClose).toHaveBeenCalledWith(false);
  });
});
