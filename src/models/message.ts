export interface ChatMessage {
  id: number;
  userId: number;
  content: string;
  time: string;
}

export type ConnectionStatus = 'idle' | 'connecting' | 'online' | 'offline';
