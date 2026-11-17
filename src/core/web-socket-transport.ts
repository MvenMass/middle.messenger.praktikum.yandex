import { EventBus } from './event-bus';
import { SocketClosedError, SocketConnectionError } from './socket-errors';

const PING_INTERVAL = 15000;

type SocketPayload = {
  type: 'message' | 'get old' | 'ping';
  content?: string;
};

type SocketEvents = {
  message: [data: unknown];
  close: [isClean: boolean];
};

function parseSocketData(data: unknown): unknown {
  if (typeof data !== 'string') {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export class WebSocketTransport extends EventBus<SocketEvents> {
  private readonly url: string;

  private socket: WebSocket | null = null;

  private pingTimerId: ReturnType<typeof setInterval> | null = null;

  constructor(url: string) {
    super();
    this.url = url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(this.url);

      socket.addEventListener('open', () => {
        this.startPing();
        resolve();
      });
      socket.addEventListener('error', () => reject(new SocketConnectionError()));
      socket.addEventListener('message', (event) => this.emit('message', parseSocketData(event.data)));
      socket.addEventListener('close', (event) => this.handleClose(event));

      this.socket = socket;
    });
  }

  send(payload: SocketPayload): void {
    const { socket } = this;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      throw new SocketClosedError();
    }

    socket.send(JSON.stringify(payload));
  }

  close(): void {
    this.stopPing();
    this.socket?.close();
    this.socket = null;
  }

  private handleClose(event: CloseEvent): void {
    this.stopPing();
    this.emit('close', event.wasClean);
  }

  private startPing(): void {
    this.pingTimerId = setInterval(() => this.send({ type: 'ping' }), PING_INTERVAL);
  }

  private stopPing(): void {
    if (this.pingTimerId !== null) {
      clearInterval(this.pingTimerId);
      this.pingTimerId = null;
    }
  }
}
