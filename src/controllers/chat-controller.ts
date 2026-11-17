import { chatsApi } from '../api/chats-api';
import { userApi } from '../api/user-api';
import { ChatNotSelectedError, UserNotFoundError } from '../services/app-errors';
import type { FormValues } from '../services/form-values';
import { store } from '../store/store';
import { handleRequestFailure } from './handle-request-failure';
import { messageController } from './message-controller';

class ChatController {
  async loadChats(): Promise<void> {
    const { searchQuery } = store.getState();

    try {
      const chats = await chatsApi.getChats(searchQuery ? { title: searchQuery } : {});
      const isQueryActual = store.getState().searchQuery === searchQuery;

      if (isQueryActual) {
        store.set({ chats });
      }
    } catch (error) {
      handleRequestFailure(error);
    }
  }

  async showAllChats(): Promise<void> {
    store.set({ searchQuery: '' });
    await this.loadChats();
  }

  async searchChats(values: FormValues): Promise<void> {
    store.set({ searchQuery: values.search.trim() });
    await this.loadChats();
  }

  selectChat(chatId: number): void {
    if (store.getState().activeChatId === chatId) {
      return;
    }

    store.set({ activeChatId: chatId, chatUsers: [] });
    messageController.connect(chatId);
  }

  reconnectActiveChat(): void {
    const { activeChatId } = store.getState();

    if (activeChatId !== null) {
      messageController.connect(activeChatId);
    }
  }

  closeChat(): void {
    messageController.disconnect();
    store.set({ activeChatId: null, chatUsers: [], messages: [] });
  }

  async createChat(values: FormValues): Promise<void> {
    const { id } = await chatsApi.createChat({ title: values.title });

    await this.showAllChats();
    this.selectChat(id);
  }

  async deleteChat(): Promise<void> {
    const chatId = this.getActiveChatId();

    await chatsApi.deleteChat({ chatId });
    this.closeChat();
    await this.loadChats();
  }

  async updateChatAvatar(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('chatId', String(this.getActiveChatId()));
    formData.append('avatar', file);

    await chatsApi.updateAvatar(formData);
    await this.loadChats();
  }

  async loadChatUsers(): Promise<void> {
    try {
      store.set({ chatUsers: await chatsApi.getUsers(this.getActiveChatId()) });
    } catch (error) {
      handleRequestFailure(error);
    }
  }

  async addUser(values: FormValues): Promise<void> {
    const chatId = this.getActiveChatId();
    const userId = await this.findUserId(values.login);

    await chatsApi.addUsers({ users: [userId], chatId });
  }

  async removeUser(userId: number): Promise<void> {
    await chatsApi.deleteUsers({ users: [userId], chatId: this.getActiveChatId() });
    await this.loadChatUsers();
  }

  private getActiveChatId(): number {
    const { activeChatId } = store.getState();

    if (activeChatId === null) {
      throw new ChatNotSelectedError();
    }

    return activeChatId;
  }

  private async findUserId(login: string): Promise<number> {
    const users = await userApi.searchUsers({ login });
    const user = users.find((item) => item.login === login);

    if (!user) {
      throw new UserNotFoundError(login);
    }

    return user.id;
  }
}

export const chatController = new ChatController();
