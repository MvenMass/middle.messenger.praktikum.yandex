import { Block, type BlockProps } from '../../core/block';
import template from './link.hbs?raw';
import './link.scss';

interface LinkProps extends BlockProps {
  href: string;
  text: string;
  modifier?: 'danger';
}

export class Link extends Block<LinkProps> {
  protected render(): string {
    return template;
  }
}
