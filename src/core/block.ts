import Handlebars from 'handlebars';

import { EventBus } from './event-bus';

export type BlockEvents = Record<string, (event: Event) => void>;

export interface BlockProps {
  events?: BlockEvents;
}

type LifecycleEvents = {
  mount: [];
  render: [];
};

const compiledTemplates = new Map<string, Handlebars.TemplateDelegate>();

function compileTemplate(template: string): Handlebars.TemplateDelegate {
  const cachedTemplate = compiledTemplates.get(template);

  if (cachedTemplate) {
    return cachedTemplate;
  }

  const compiledTemplate = Handlebars.compile(template);
  compiledTemplates.set(template, compiledTemplate);

  return compiledTemplate;
}

function isBlockList(value: unknown): value is Block[] {
  return Array.isArray(value) && value.length > 0 && value.every((item) => item instanceof Block);
}

function createStub(block: Block): string {
  return `<template data-block-id="${block.id}"></template>`;
}

function toTemplateValue(value: unknown): unknown {
  if (value instanceof Block) {
    return createStub(value);
  }

  if (isBlockList(value)) {
    return value.map(createStub).join('');
  }

  return value;
}

export abstract class Block<Props extends BlockProps = BlockProps> {
  private static lastId = 0;

  readonly id = `block-${++Block.lastId}`;

  protected props: Props;

  private element: HTMLElement | null = null;

  private readonly eventBus = new EventBus<LifecycleEvents>();

  constructor(props: Props) {
    this.props = props;

    this.eventBus.on('mount', () => this.handleMount());
    this.eventBus.on('render', () => this.handleRender());

    this.eventBus.emit('render');
  }

  getContent(): HTMLElement {
    if (!this.element) {
      throw new Error(`Компонент ${this.constructor.name} ещё не отрисован`);
    }

    return this.element;
  }

  setProps(nextProps: Partial<Props>): void {
    const oldProps = this.props;

    this.props = { ...oldProps, ...nextProps };

    const shouldRender = this.componentDidUpdate(oldProps, this.props);

    if (shouldRender) {
      this.eventBus.emit('render');
    }
  }

  dispatchComponentDidMount(): void {
    this.eventBus.emit('mount');
  }

  protected abstract render(): string;

  protected componentDidMount(): void {}

  protected componentDidUpdate(oldProps: Props, newProps: Props): boolean {
    const propNames = Object.keys(newProps) as (keyof Props)[];

    return propNames.some((propName) => oldProps[propName] !== newProps[propName]);
  }

  protected getEvents(): BlockEvents {
    return this.props.events ?? {};
  }

  private handleMount(): void {
    this.componentDidMount();
    this.getChildren().forEach((child) => child.dispatchComponentDidMount());
  }

  private handleRender(): void {
    const nextElement = this.createElement();

    this.element?.replaceWith(nextElement);
    this.element = nextElement;
    this.addEvents(nextElement);
  }

  private createElement(): HTMLElement {
    const container = document.createElement('template');
    container.innerHTML = compileTemplate(this.render())(this.getTemplateContext());

    this.getChildren().forEach((child) => {
      const stub = container.content.querySelector(`[data-block-id="${child.id}"]`);
      stub?.replaceWith(child.getContent());
    });

    const element = container.content.firstElementChild;

    if (!(element instanceof HTMLElement)) {
      throw new Error(`Шаблон компонента ${this.constructor.name} должен содержать один корневой элемент`);
    }

    return element;
  }

  private getTemplateContext(): Record<string, unknown> {
    const entries: [string, unknown][] = Object.entries(this.props);

    return Object.fromEntries(entries.map(([key, value]) => [key, toTemplateValue(value)]));
  }

  private getChildren(): Block[] {
    const values: unknown[] = Object.values(this.props);

    return values.flatMap((value) => {
      if (value instanceof Block) {
        return [value];
      }

      if (isBlockList(value)) {
        return value;
      }

      return [];
    });
  }

  private addEvents(element: HTMLElement): void {
    Object.entries(this.getEvents()).forEach(([eventName, handler]) => {
      element.addEventListener(eventName, handler);
    });
  }
}
