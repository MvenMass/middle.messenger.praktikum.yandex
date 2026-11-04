export interface LastMessage {
  content: string;
  time: string;
}

export interface Chat {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  last_message: LastMessage | null;
}

export type CreateChatData = {
  title: string;
};

export type ChatUsersData = {
  users: number[];
  chatId: number;
};
