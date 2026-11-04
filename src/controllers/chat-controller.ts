import { chatsApi } from '../api/chats-api';
import { userApi } from '../api/user-api';
import { ChatNotSelectedError, UserNotFoundError } from '../services/app-errors';
import type { FormValues } from '../services/form-values';
import { store } from '../store/store';
import { handleRequestFailure } from './handle-request-failure';

class ChatController {
  async loadChats(): Promise<void> {
    try {
      store.set({ chats: await chatsApi.getChats() });
    } catch (error) {
      handleRequestFailure(error);
    }
  }

  selectChat(chatId: number): void {
    store.set({ activeChatId: chatId });
  }

  async createChat(values: FormValues): Promise<void> {
    const { id } = await chatsApi.createChat({ title: values.title });

    await this.loadChats();
    this.selectChat(id);
  }

  async addUser(values: FormValues): Promise<void> {
    const chatId = this.getActiveChatId();
    const userId = await this.findUserId(values.login);

    await chatsApi.addUsers({ users: [userId], chatId });
  }

  async removeUser(values: FormValues): Promise<void> {
    const chatId = this.getActiveChatId();
    const userId = await this.findUserId(values.login);

    await chatsApi.deleteUsers({ users: [userId], chatId });
  }

  searchChats(values: FormValues): void {
    console.log('Поиск чатов', values);
  }

  sendMessage(values: FormValues): void {
    console.log('Отправка сообщения', values);
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
