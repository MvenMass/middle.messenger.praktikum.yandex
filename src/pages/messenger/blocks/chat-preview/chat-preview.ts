import { Avatar } from '../../../../components';
import { Block, type BlockProps } from '../../../../core/block';
import type { ChatSummary } from '../../../../models/chat';
import template from './chat-preview.hbs?raw';
import './chat-preview.scss';

interface ChatPreviewProps extends BlockProps, ChatSummary {
  avatar: Avatar;
}

export class ChatPreview extends Block<ChatPreviewProps> {
  constructor(chat: ChatSummary) {
    super({
      ...chat,
      avatar: new Avatar({ initials: chat.initials, color: chat.color, size: 'medium' }),
    });
  }

  protected render(): string {
    return template;
  }
}
