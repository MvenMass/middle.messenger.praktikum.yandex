import { Block, type BlockEvents, type BlockProps } from '../../../../core/block';
import template from './chat-menu.hbs?raw';
import './chat-menu.scss';

interface ChatMenuOptions {
  onAddUser: () => void;
  onRemoveUser: () => void;
}

interface ChatMenuProps extends BlockProps, ChatMenuOptions {
  isOpen: boolean;
}

export class ChatMenu extends Block<ChatMenuProps> {
  constructor(options: ChatMenuOptions) {
    super({ ...options, isOpen: false });
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
    const button = event.target instanceof Element ? event.target.closest('button') : null;
    const action = button?.dataset.action;

    if (action === 'add-user') {
      this.props.onAddUser();
    }

    if (action === 'remove-user') {
      this.props.onRemoveUser();
    }

    this.setProps({ isOpen: action === 'toggle' && !this.props.isOpen });
  }
}
