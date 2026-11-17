import type { AvatarData } from '../models/avatar';
import type { Chat } from '../models/chat';
import { createAvatar } from './avatar';
import { formatShortDate } from './date-format';

export interface ChatView {
  id: number;
  title: string;
  avatar: AvatarData;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isActive: boolean;
}

export function createChatView(chat: Chat, activeChatId: number | null): ChatView {
  return {
    id: chat.id,
    title: chat.title,
    avatar: createAvatar(chat.id, chat.title, chat.avatar),
    lastMessage: chat.last_message?.content ?? 'Сообщений пока нет',
    time: chat.last_message ? formatShortDate(chat.last_message.time) : '',
    unreadCount: chat.unread_count,
    isActive: chat.id === activeChatId,
  };
}
