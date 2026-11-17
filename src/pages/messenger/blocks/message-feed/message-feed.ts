import { Block, type BlockProps } from '../../../../core/block';
import type { ConnectionStatus } from '../../../../models/message';
import { connect } from '../../../../store/connect';
import type { AppState } from '../../../../store/store';
import { MessageList } from '../message-list';
import template from './message-feed.hbs?raw';
import './message-feed.scss';

interface MessageFeedProps extends BlockProps {
  statusText: string;
  messageList: Block;
}

const statusTexts: Record<ConnectionStatus, string> = {
  idle: '',
  connecting: 'Подключаемся к чату…',
  online: '',
  offline: 'Нет соединения, переподключаемся…',
};

function mapStatusToProps(state: AppState): Partial<MessageFeedProps> {
  return {
    statusText: statusTexts[state.connectionStatus],
  };
}

class MessageFeed extends Block<MessageFeedProps> {
  constructor() {
    super({ statusText: '', messageList: new MessageList() });
  }

  protected render(): string {
    return template;
  }
}

const ConnectedMessageFeed = connect(mapStatusToProps)(MessageFeed);

export { ConnectedMessageFeed as MessageFeed };
