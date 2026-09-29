import loginTemplate from './login/login.hbs?raw';
import signUpTemplate from './sign-up/sign-up.hbs?raw';
import messengerTemplate from './messenger/messenger.hbs?raw';
import settingsTemplate from './settings/settings.hbs?raw';
import errorTemplate from './error/error.hbs?raw';

import { chats, activeChat, messages } from './messenger/messenger-mock';
import { user } from './settings/settings-mock';

import.meta.glob('./**/*.scss', { eager: true });

export interface PageConfig {
  template: string;
  context?: Record<string, unknown>;
}

export const pagesByPath: Record<string, PageConfig> = {
  '/': { template: loginTemplate },
  '/sign-up': { template: signUpTemplate },
  '/messenger': {
    template: messengerTemplate,
    context: { chats, activeChat, messages },
  },
  '/settings': {
    template: settingsTemplate,
    context: { user },
  },
  '/500': {
    template: errorTemplate,
    context: { code: '500', text: 'Что-то сломалось на сервере. Мы уже чиним' },
  },
};

export const notFoundPage: PageConfig = {
  template: errorTemplate,
  context: { code: '404', text: 'Такой страницы нет' },
};
