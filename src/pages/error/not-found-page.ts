import { ErrorPage } from './error-page';

export class NotFoundPage extends ErrorPage {
  constructor() {
    super({ code: '404', text: 'Такой страницы нет' });
  }
}
