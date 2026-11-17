import type { Form, Link } from '../../components';
import { Block, type BlockProps } from '../../core/block';
import template from './auth-page.hbs?raw';
import './auth-page.scss';

interface AuthPageProps extends BlockProps {
  title: string;
  subtitle: string;
  form: Form;
  link: Link;
}

export class AuthPage extends Block<AuthPageProps> {
  protected render(): string {
    return template;
  }
}
