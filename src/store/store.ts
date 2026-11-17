import { EventBus } from '../core/event-bus';
import type { Chat } from '../models/chat';
import type { ChatMessage, ConnectionStatus } from '../models/message';
import type { ChatUser, User } from '../models/user';

export interface AppState {
  user: User | null;
  chats: Chat[];
  searchQuery: string;
  activeChatId: number | null;
  chatUsers: ChatUser[];
  messages: ChatMessage[];
  connectionStatus: ConnectionStatus;
}

type StoreEvents = {
  updated: [];
};

const initialState: AppState = {
  user: null,
  chats: [],
  searchQuery: '',
  activeChatId: null,
  chatUsers: [],
  messages: [],
  connectionStatus: 'idle',
};

class Store extends EventBus<StoreEvents> {
  private state: AppState = initialState;

  getState(): AppState {
    return this.state;
  }

  set(nextState: Partial<AppState>): void {
    this.state = { ...this.state, ...nextState };
    this.emit('updated');
  }

  reset(): void {
    this.set(initialState);
  }
}

export const store = new Store();
