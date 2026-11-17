import { chatController } from '../../../../controllers/chat-controller';
import { Block, type BlockEvents, type BlockProps } from '../../../../core/block';
import { createChatView, type ChatView } from '../../../../services/chat-view';
import { connect } from '../../../../store/connect';
import type { AppState } from '../../../../store/store';
import template from './chat-list.hbs?raw';
import './chat-list.scss';

interface ChatListProps extends BlockProps {
  chats: ChatView[];
  isSearch: boolean;
}

function mapChatsToProps(state: AppState): Partial<ChatListProps> {
  return {
    chats: state.chats.map((chat) => createChatView(chat, state.activeChatId)),
    isSearch: state.searchQuery !== '',
  };
}

class ChatList extends Block<ChatListProps> {
  constructor() {
    super({ chats: [], isSearch: false });
  }

  protected getEvents(): BlockEvents {
    return {
      click: (event) => this.handleClick(event),
    };
  }

  protected render(): string {
    return template;
  }

  private handleClick(event: Event): void {
    const chatPreview = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-chat-id]') : null;

    if (chatPreview) {
      chatController.selectChat(Number(chatPreview.dataset.chatId));
    }
  }
}

const ConnectedChatList = connect(mapChatsToProps)(ChatList);

export { ConnectedChatList as ChatList };
