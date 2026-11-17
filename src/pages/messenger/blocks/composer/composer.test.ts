import { beforeAll, describe, expect, it } from '@jest/globals';
import Handlebars from 'handlebars';

import { Composer } from './composer';

function getInput(composer: Composer): HTMLInputElement {
  const input = composer.getContent().querySelector('input');

  if (!input) {
    throw new Error('Поле ввода не найдено');
  }

  return input;
}

function getError(composer: Composer): string | null | undefined {
  return composer.getContent().querySelector('.composer__error')?.textContent;
}

function submitComposer(composer: Composer): void {
  composer.getContent().dispatchEvent(new SubmitEvent('submit', { cancelable: true }));
}

describe('Composer', () => {
  beforeAll(() => {
    Handlebars.registerPartial('IconSend', '<svg></svg>');
  });

  it('показывает текст ошибки при отправке пустого сообщения', () => {
    const composer = new Composer();

    submitComposer(composer);

    expect(getError(composer)).toBe('Поле не должно быть пустым');
    expect(composer.getContent().classList.contains('composer_invalid')).toBe(true);
  });

  it('объясняет, что нет соединения, и сохраняет текст сообщения', () => {
    const composer = new Composer();
    getInput(composer).value = 'Привет';

    submitComposer(composer);

    expect(getError(composer)).toBe('Нет соединения с чатом, сообщение не отправлено');
    expect(getInput(composer).value).toBe('Привет');
  });

  it('убирает ошибку, как только пользователь начинает печатать', () => {
    const composer = new Composer();
    submitComposer(composer);

    getInput(composer).value = 'П';
    getInput(composer).dispatchEvent(new Event('input', { bubbles: true }));

    expect(getError(composer)).toBe('');
    expect(composer.getContent().classList.contains('composer_invalid')).toBe(false);
  });
});
