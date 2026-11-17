import { describe, expect, it } from '@jest/globals';

import { Block } from './block';
import { Router, type RouterMiddleware } from './router';

class LoginPage extends Block {
  constructor() {
    super({});
  }

  protected render(): string {
    return '<main class="page"><h1>Вход</h1><a href="/chats">К чатам</a></main>';
  }
}

class ChatsPage extends Block {
  constructor() {
    super({});
  }

  protected render(): string {
    return '<main class="page"><h1>Чаты</h1></main>';
  }
}

class NotFoundPage extends Block {
  constructor() {
    super({});
  }

  protected render(): string {
    return '<main class="page"><h1>404</h1></main>';
  }
}

function createRouter(startPath = '/'): Router {
  document.body.innerHTML = '<div id="app"></div>';
  window.history.replaceState({}, '', startPath);

  return new Router('#app', '/404')
    .use('/', LoginPage)
    .use('/chats', ChatsPage)
    .use('/404', NotFoundPage);
}

function waitForPopState(): Promise<void> {
  return new Promise((resolve) => {
    window.addEventListener('popstate', () => resolve(), { once: true });
  });
}

function getPageTitle(): string | null | undefined {
  return document.querySelector('#app h1')?.textContent;
}

describe('Router', () => {
  it('при старте показывает страницу текущего адреса', () => {
    const router = createRouter('/chats');

    router.start();

    expect(getPageTitle()).toBe('Чаты');
  });

  it('go меняет адрес и показывает новую страницу', () => {
    const router = createRouter();
    router.start();

    router.go('/chats');

    expect(window.location.pathname).toBe('/chats');
    expect(getPageTitle()).toBe('Чаты');
  });

  it('go добавляет запись в историю браузера', () => {
    const router = createRouter();
    router.start();
    const historyLength = window.history.length;

    router.go('/chats');

    expect(window.history.length).toBe(historyLength + 1);
  });

  it('оставляет в DOM только одну страницу', () => {
    const router = createRouter();
    router.start();

    router.go('/chats');
    router.go('/');

    expect(document.querySelectorAll('#app .page')).toHaveLength(1);
  });

  it('показывает страницу 404 для неизвестного адреса и не меняет адрес', () => {
    const router = createRouter('/unknown');

    router.start();

    expect(getPageTitle()).toBe('404');
    expect(window.location.pathname).toBe('/unknown');
  });

  it('при возврате назад по истории показывает предыдущую страницу', async () => {
    const router = createRouter();
    router.start();
    router.go('/chats');

    const popState = waitForPopState();
    window.history.back();
    await popState;

    expect(getPageTitle()).toBe('Вход');
    expect(window.location.pathname).toBe('/');
  });

  it('открывает внутренние ссылки без перезагрузки страницы', () => {
    const router = createRouter();
    router.start();

    document.querySelector<HTMLAnchorElement>('#app a')?.click();

    expect(window.location.pathname).toBe('/chats');
    expect(getPageTitle()).toBe('Чаты');
  });

  describe('middleware', () => {
    it('перенаправляет на адрес, который вернул middleware', () => {
      const redirectGuests: RouterMiddleware = (pathname) => (pathname === '/chats' ? '/' : null);
      const router = createRouter('/chats').useMiddleware(redirectGuests);

      router.start();

      expect(window.location.pathname).toBe('/');
      expect(getPageTitle()).toBe('Вход');
    });

    it('пропускает на страницу, если middleware вернул null', () => {
      const allowAll: RouterMiddleware = () => null;
      const router = createRouter('/chats').useMiddleware(allowAll);

      router.start();

      expect(getPageTitle()).toBe('Чаты');
    });
  });
});
