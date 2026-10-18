import { Block, type BlockProps } from '../../core/block';
import template from './button.hbs?raw';
import './button.scss';

interface ButtonProps extends BlockProps {
  text: string;
  type: 'button' | 'submit';
}

export class Button extends Block<ButtonProps> {
  protected render(): string {
    return template;
  }
}
