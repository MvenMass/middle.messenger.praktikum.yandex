import { messageController } from '../../../../controllers/message-controller';
import { Block, type BlockEvents, type BlockProps } from '../../../../core/block';
import { formatTime } from '../../../../services/date-format';
import { connect } from '../../../../store/connect';
import type { AppState } from '../../../../store/store';
import template from './message-list.hbs?raw';
import './message-list.scss';

interface MessageView {
  id: number;
  content: string;
  time: string;
  dateTime: string;
  isOutgoing: boolean;
}

interface MessageListProps extends BlockProps {
  messages: MessageView[];
  hasMoreMessages: boolean;
}

function mapMessagesToProps(state: AppState): Partial<MessageListProps> {
  const currentUserId = state.user?.id;

  return {
    hasMoreMessages: state.hasMoreMessages,
    messages: state.messages.map((message) => ({
      id: message.id,
      content: message.content,
      time: formatTime(message.time),
      dateTime: message.time,
      isOutgoing: message.userId === currentUserId,
    })),
  };
}

class MessageList extends Block<MessageListProps> {
  constructor() {
    super({ messages: [], hasMoreMessages: false });
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
    const isLoadMoreClick = event.target instanceof Element && event.target.closest('.message-list__more') !== null;

    if (isLoadMoreClick) {
      messageController.loadOlderMessages();
    }
  }
}

const ConnectedMessageList = connect(mapMessagesToProps)(MessageList);

export { ConnectedMessageList as MessageList };
