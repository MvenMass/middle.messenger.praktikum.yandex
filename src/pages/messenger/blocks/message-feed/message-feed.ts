import { Block, type BlockProps } from '../../../../core/block';
import type { ConnectionStatus } from '../../../../models/message';
import { formatTime } from '../../../../services/date-format';
import { connect } from '../../../../store/connect';
import type { AppState } from '../../../../store/store';
import template from './message-feed.hbs?raw';
import './message-feed.scss';

interface MessageView {
  id: number;
  content: string;
  time: string;
  dateTime: string;
  isOutgoing: boolean;
}

interface MessageFeedProps extends BlockProps {
  messages: MessageView[];
  statusText: string;
}

const statusTexts: Record<ConnectionStatus, string> = {
  idle: '',
  connecting: 'Подключаемся к чату…',
  online: '',
  offline: 'Нет соединения, переподключаемся…',
};

function mapMessagesToProps(state: AppState): Partial<MessageFeedProps> {
  const currentUserId = state.user?.id;

  return {
    statusText: statusTexts[state.connectionStatus],
    messages: state.messages.map((message) => ({
      id: message.id,
      content: message.content,
      time: formatTime(message.time),
      dateTime: message.time,
      isOutgoing: message.userId === currentUserId,
    })),
  };
}

class MessageFeed extends Block<MessageFeedProps> {
  constructor() {
    super({ messages: [], statusText: '' });
  }

  protected render(): string {
    return template;
  }
}

const ConnectedMessageFeed = connect(mapMessagesToProps)(MessageFeed);

export { ConnectedMessageFeed as MessageFeed };
