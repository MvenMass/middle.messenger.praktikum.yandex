import { ErrorPage } from './error-page';

export class ServerErrorPage extends ErrorPage {
  constructor() {
    super({ code: '500', text: 'Что-то сломалось на сервере. Мы уже чиним' });
  }
}
