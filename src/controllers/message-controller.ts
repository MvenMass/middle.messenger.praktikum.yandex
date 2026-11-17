import { chatsApi } from '../api/chats-api';
import { CHATS_SOCKET_URL } from '../api/http';
import { UnauthorizedError } from '../core/http-errors';
import { SocketClosedError } from '../core/socket-errors';
import { WebSocketTransport } from '../core/web-socket-transport';
import type { ChatMessage } from '../models/message';
import { isTextMessage, toChatMessage } from '../services/socket-message';
import { store } from '../store/store';
import { handleRequestFailure } from './handle-request-failure';

const RECONNECT_DELAY = 3000;

class MessageController {
  private transport: WebSocketTransport | null = null;

  private reconnectTimerId: ReturnType<typeof setTimeout> | null = null;

  async connect(chatId: number): Promise<void> {
    this.disconnect();
    store.set({ messages: [], connectionStatus: 'connecting' });

    try {
      const transport = await this.openTransport(chatId);

      if (store.getState().activeChatId !== chatId) {
        transport.close();
        return;
      }

      this.transport = transport;
      store.set({ connectionStatus: 'online' });
      transport.send({ type: 'get old', content: '0' });
    } catch (error) {
      this.handleConnectionError(chatId, error);
    }
  }

  disconnect(): void {
    if (this.reconnectTimerId !== null) {
      clearTimeout(this.reconnectTimerId);
      this.reconnectTimerId = null;
    }

    this.transport?.close();
    this.transport = null;
    store.set({ connectionStatus: 'idle' });
  }

  sendMessage(content: string): void {
    if (!this.transport) {
      throw new SocketClosedError();
    }

    this.transport.send({ type: 'message', content });
  }

  private async openTransport(chatId: number): Promise<WebSocketTransport> {
    const { user } = store.getState();

    if (!user) {
      throw new UnauthorizedError('Пользователь не авторизован');
    }

    const { token } = await chatsApi.getToken(chatId);
    const transport = new WebSocketTransport(`${CHATS_SOCKET_URL}/${user.id}/${chatId}/${token}`);

    transport.on('message', (data) => {
      if (transport === this.transport) {
        this.handleSocketData(data);
      }
    });

    transport.on('close', (isClean) => {
      if (transport === this.transport && !isClean) {
        this.handleConnectionLost(chatId);
      }
    });

    await transport.connect();

    return transport;
  }

  private handleSocketData(data: unknown): void {
    if (Array.isArray(data)) {
      const history = data.filter(isTextMessage).map(toChatMessage).reverse();

      store.set({ messages: history });
      return;
    }

    if (isTextMessage(data)) {
      this.addMessage(toChatMessage(data));
    }
  }

  private addMessage(message: ChatMessage): void {
    const { messages, chats, activeChatId } = store.getState();
    const lastMessage = { content: message.content, time: message.time };

    store.set({
      messages: [...messages, message],
      chats: chats.map((chat) => (chat.id === activeChatId ? { ...chat, last_message: lastMessage } : chat)),
    });
  }

  private handleConnectionError(chatId: number, error: unknown): void {
    if (error instanceof UnauthorizedError) {
      handleRequestFailure(error);
      return;
    }

    this.handleConnectionLost(chatId);
  }

  private handleConnectionLost(chatId: number): void {
    this.transport = null;
    store.set({ connectionStatus: 'offline' });

    this.reconnectTimerId = setTimeout(() => {
      if (store.getState().activeChatId === chatId) {
        this.connect(chatId);
      }
    }, RECONNECT_DELAY);
  }
}

export const messageController = new MessageController();
