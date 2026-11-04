import { EventBus } from '../core/event-bus';
import type { Chat } from '../models/chat';
import type { User } from '../models/user';

export interface AppState {
  user: User | null;
  chats: Chat[];
  activeChatId: number | null;
}

type StoreEvents = {
  updated: [];
};

const initialState: AppState = {
  user: null,
  chats: [],
  activeChatId: null,
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
