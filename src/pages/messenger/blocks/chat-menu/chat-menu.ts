import { Block, type BlockEvents, type BlockProps } from '../../../../core/block';
import template from './chat-menu.hbs?raw';
import './chat-menu.scss';

interface ChatMenuItem {
  text: string;
  onSelect: () => void;
  isDanger?: boolean;
}

interface ChatMenuProps extends BlockProps {
  items: ChatMenuItem[];
  isOpen: boolean;
}

export class ChatMenu extends Block<ChatMenuProps> {
  constructor(items: ChatMenuItem[]) {
    super({ items, isOpen: false });
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
    const isToggle = button?.dataset.action === 'toggle';
    const selectedItem = this.props.items[Number(button?.dataset.index)];

    this.setProps({ isOpen: isToggle && !this.props.isOpen });
    selectedItem?.onSelect();
  }
}
