import { chatController } from '../../../../controllers/chat-controller';
import { Block, type BlockEvents, type BlockProps } from '../../../../core/block';
import { getFormValues } from '../../../../services/form-values';
import template from './search.hbs?raw';
import './search.scss';

const SEARCH_DELAY = 300;

export class Search extends Block<BlockProps> {
  private searchTimerId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    super({});
  }

  reset(): void {
    this.cancelScheduledSearch();
    this.getFormElement().reset();
  }

  protected getEvents(): BlockEvents {
    return {
      input: () => this.scheduleSearch(),
      submit: (event) => this.handleSubmit(event),
    };
  }

  protected render(): string {
    return template;
  }

  private scheduleSearch(): void {
    this.cancelScheduledSearch();
    this.searchTimerId = setTimeout(() => this.search(), SEARCH_DELAY);
  }

  private cancelScheduledSearch(): void {
    if (this.searchTimerId !== null) {
      clearTimeout(this.searchTimerId);
      this.searchTimerId = null;
    }
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
    this.cancelScheduledSearch();
    this.search();
  }

  private search(): void {
    chatController.searchChats(getFormValues(this.getFormElement()));
  }

  private getFormElement(): HTMLFormElement {
    const element = this.getContent();

    if (!(element instanceof HTMLFormElement)) {
      throw new Error('Корневой элемент поиска должен быть тегом form');
    }

    return element;
  }
}
