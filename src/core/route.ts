import type { Block } from './block';

export type PageClass = new () => Block;

export class Route {
  readonly pathname: string;

  private readonly pageClass: PageClass;

  private readonly rootQuery: string;

  private page: Block | null = null;

  constructor(pathname: string, pageClass: PageClass, rootQuery: string) {
    this.pathname = pathname;
    this.pageClass = pageClass;
    this.rootQuery = rootQuery;
  }

  match(pathname: string): boolean {
    return pathname === this.pathname;
  }

  render(): void {
    const root = document.querySelector(this.rootQuery);

    if (!root) {
      throw new Error(`Не найден корневой элемент ${this.rootQuery}`);
    }

    this.page = new this.pageClass();
    root.replaceChildren(this.page.getContent());
    this.page.dispatchComponentDidMount();
  }

  leave(): void {
    if (!this.page) {
      return;
    }

    this.page.dispatchComponentWillUnmount();
    this.page.getContent().remove();
    this.page = null;
  }
}
