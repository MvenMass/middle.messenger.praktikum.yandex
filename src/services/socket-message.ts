import type { ChatMessage } from '../models/message';

interface SocketTextMessage {
  id: number | string;
  user_id: number | string;
  content: string;
  time: string;
  type: 'message';
}

export function isTextMessage(value: unknown): value is SocketTextMessage {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const message = value as Record<string, unknown>;

  return message.type === 'message'
    && typeof message.content === 'string'
    && typeof message.time === 'string'
    && message.id !== undefined
    && message.user_id !== undefined;
}

export function toChatMessage(message: SocketTextMessage): ChatMessage {
  return {
    id: Number(message.id),
    userId: Number(message.user_id),
    content: message.content,
    time: message.time,
  };
}
