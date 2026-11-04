import type { Chat, ChatUsersData, CreateChatData } from '../models/chat';
import { http } from './http';

class ChatsApi {
  getChats(): Promise<Chat[]> {
    return http.get('/chats');
  }

  createChat(data: CreateChatData): Promise<{ id: number }> {
    return http.post('/chats', { data });
  }

  addUsers(data: ChatUsersData): Promise<string> {
    return http.put('/chats/users', { data });
  }

  deleteUsers(data: ChatUsersData): Promise<string> {
    return http.delete('/chats/users', { data });
  }
}

export const chatsApi = new ChatsApi();
