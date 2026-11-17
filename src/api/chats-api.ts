import type { Chat, ChatSearchParams, ChatUsersData, CreateChatData, DeleteChatData } from '../models/chat';
import type { ChatUser } from '../models/user';
import { http } from './http';

class ChatsApi {
  getChats(params: ChatSearchParams): Promise<Chat[]> {
    return http.get('/chats', { data: params });
  }

  createChat(data: CreateChatData): Promise<{ id: number }> {
    return http.post('/chats', { data });
  }

  deleteChat(data: DeleteChatData): Promise<unknown> {
    return http.delete('/chats', { data });
  }

  updateAvatar(data: FormData): Promise<Chat> {
    return http.put('/chats/avatar', { data });
  }

  getUsers(chatId: number): Promise<ChatUser[]> {
    return http.get(`/chats/${chatId}/users`);
  }

  addUsers(data: ChatUsersData): Promise<string> {
    return http.put('/chats/users', { data });
  }

  deleteUsers(data: ChatUsersData): Promise<string> {
    return http.delete('/chats/users', { data });
  }

  getToken(chatId: number): Promise<{ token: string }> {
    return http.post(`/chats/token/${chatId}`);
  }
}

export const chatsApi = new ChatsApi();
