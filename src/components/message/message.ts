import { Block, type BlockProps } from '../../core/block';
import type { ChatMessage } from '../../models/chat';
import template from './message.hbs?raw';
import './message.scss';

type MessageProps = BlockProps & ChatMessage;

export class Message extends Block<MessageProps> {
  protected render(): string {
    return template;
  }
}
