import { chatController } from '../../../../controllers/chat-controller';
import { Block, type BlockEvents, type BlockProps } from '../../../../core/block';
import { getFormValues } from '../../../../services/form-values';
import template from './search.hbs?raw';
import './search.scss';

export class Search extends Block<BlockProps> {
  constructor() {
    super({});
  }

  protected getEvents(): BlockEvents {
    return {
      submit: (event) => this.handleSubmit(event),
    };
  }

  protected render(): string {
    return template;
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();

    const form = event.currentTarget;

    if (form instanceof HTMLFormElement) {
      chatController.searchChats(getFormValues(form));
    }
  }
}
