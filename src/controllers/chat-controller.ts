import type { FormValues } from '../services/form-values';

class ChatController {
  searchChats(values: FormValues): void {
    console.log('Поиск чатов', values);
  }

  sendMessage(values: FormValues): void {
    console.log('Отправка сообщения', values);
  }
}

export const chatController = new ChatController();
