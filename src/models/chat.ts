import type { AvatarData } from './avatar';

export interface ChatSummary extends AvatarData {
  title: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isActive: boolean;
}

export interface ChatDetails extends AvatarData {
  title: string;
  status: string;
}

export interface ChatMessage {
  text: string;
  time: string;
  isOutgoing: boolean;
}
