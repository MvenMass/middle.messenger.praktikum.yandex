import { Link } from '../../components';
import { Block, type BlockProps } from '../../core/block';
import template from './error-page.hbs?raw';
import './error-page.scss';

interface ErrorPageOptions {
  code: string;
  text: string;
}

interface ErrorPageProps extends BlockProps, ErrorPageOptions {
  link: Link;
}

export class ErrorPage extends Block<ErrorPageProps> {
  constructor({ code, text }: ErrorPageOptions) {
    super({
      code,
      text,
      link: new Link({ href: '/messenger', text: 'Вернуться к чатам' }),
    });
  }

  protected render(): string {
    return template;
  }
}
