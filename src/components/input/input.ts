import { Block, type BlockProps } from '../../core/block';
import template from './input.hbs?raw';

interface InputProps extends BlockProps {
  name: string;
  type: string;
  className: string;
  value?: string;
  placeholder?: string;
  autocomplete?: string;
}

export class Input extends Block<InputProps> {
  get name(): string {
    return this.props.name;
  }

  getValue(): string {
    const element = this.getContent();

    return element instanceof HTMLInputElement ? element.value : '';
  }

  protected render(): string {
    return template;
  }
}
