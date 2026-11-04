import type { AvatarData } from '../models/avatar';
import type { Chat } from '../models/chat';
import { createAvatar } from './avatar';

export interface ChatView {
  id: number;
  title: string;
  avatar: AvatarData;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isActive: boolean;
}

function formatMessageTime(isoTime: string): string {
  const date = new Date(isoTime);
  const isToday = date.toDateString() === new Date().toDateString();

  if (isToday) {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }

  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

export function createChatView(chat: Chat, activeChatId: number | null): ChatView {
  return {
    id: chat.id,
    title: chat.title,
    avatar: createAvatar(chat.id, chat.title, chat.avatar),
    lastMessage: chat.last_message?.content ?? 'Сообщений пока нет',
    time: chat.last_message ? formatMessageTime(chat.last_message.time) : '',
    unreadCount: chat.unread_count,
    isActive: chat.id === activeChatId,
  };
}
