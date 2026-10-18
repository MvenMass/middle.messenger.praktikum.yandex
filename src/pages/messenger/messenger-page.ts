import { Avatar, Message } from '../../components';
import { Block, type BlockProps } from '../../core/block';
import { activeChat, chats, messages } from '../../mocks/chats';
import type { ChatDetails } from '../../models/chat';
import { ChatPreview } from './blocks/chat-preview';
import { Composer } from './blocks/composer';
import { Search } from './blocks/search';
import template from './messenger-page.hbs?raw';
import './messenger-page.scss';
import './sidebar.scss';
import './chat.scss';

interface MessengerPageProps extends BlockProps {
  search: Search;
  chat: ChatDetails;
  chatAvatar: Avatar;
  chats: ChatPreview[];
  messages: Message[];
  composer: Composer;
}

export class MessengerPage extends Block<MessengerPageProps> {
  constructor() {
    super({
      search: new Search(),
      chat: activeChat,
      chatAvatar: new Avatar({ initials: activeChat.initials, color: activeChat.color, size: 'small' }),
      chats: chats.map((chat) => new ChatPreview(chat)),
      messages: messages.map((message) => new Message(message)),
      composer: new Composer(),
    });
  }

  protected componentDidMount(): void {
    const feed = this.getContent().querySelector('.chat__feed');

    if (feed) {
      feed.scrollTop = feed.scrollHeight;
    }
  }

  protected render(): string {
    return template;
  }
}
