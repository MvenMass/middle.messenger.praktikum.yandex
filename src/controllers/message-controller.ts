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

const HISTORY_PAGE_SIZE = 20;

class MessageController {
  private transport: WebSocketTransport | null = null;

  private reconnectTimerId: ReturnType<typeof setTimeout> | null = null;

  private isHistoryLoading = false;

  async connect(chatId: number): Promise<void> {
    this.disconnect();
    store.set({ messages: [], hasMoreMessages: false, connectionStatus: 'connecting' });

    try {
      const transport = await this.openTransport(chatId);

      if (store.getState().activeChatId !== chatId) {
        transport.close();
        return;
      }

      this.transport = transport;
      store.set({ connectionStatus: 'online' });
      this.requestHistory(transport, 0);
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
    this.isHistoryLoading = false;
    store.set({ connectionStatus: 'idle' });
  }

  loadOlderMessages(): void {
    const { transport } = this;
    const { messages, hasMoreMessages } = store.getState();
    const canLoad = hasMoreMessages && !this.isHistoryLoading;

    if (transport && canLoad) {
      this.requestHistory(transport, messages.length);
    }
  }

  sendMessage(content: string): void {
    if (!this.transport) {
      throw new SocketClosedError();
    }

    this.transport.send({ type: 'message', content });
  }

  private requestHistory(transport: WebSocketTransport, offset: number): void {
    this.isHistoryLoading = true;
    transport.send({ type: 'get old', content: String(offset) });
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
      this.addHistory(data);
      return;
    }

    if (isTextMessage(data)) {
      this.addMessage(toChatMessage(data));
    }
  }

  private addHistory(history: unknown[]): void {
    const { messages } = store.getState();
    const loadedIds = new Set(messages.map((message) => message.id));
    const olderMessages = history
      .filter(isTextMessage)
      .map(toChatMessage)
      .filter((message) => !loadedIds.has(message.id))
      .reverse();

    this.isHistoryLoading = false;
    store.set({
      messages: [...olderMessages, ...messages],
      hasMoreMessages: history.length >= HISTORY_PAGE_SIZE,
    });
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
