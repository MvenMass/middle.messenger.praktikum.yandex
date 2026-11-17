import { describe, expect, it } from '@jest/globals';

import { FormField } from './form-field';

function createLoginField(value = ''): FormField {
  return new FormField({ label: 'Логин', name: 'login', type: 'text', value });
}

function getInput(field: FormField): HTMLInputElement {
  const input = field.getContent().querySelector('input');

  if (!input) {
    throw new Error('Поле ввода не найдено');
  }

  return input;
}

function getError(field: FormField): string | null | undefined {
  return field.getContent().querySelector('.form-field__error')?.textContent;
}

describe('FormField', () => {
  it('отрисовывает поле с подписью и атрибутом name', () => {
    const field = createLoginField();

    expect(getInput(field).name).toBe('login');
    expect(field.getContent().querySelector('.form-field__label')?.textContent).toBe('Логин');
  });

  it('показывает ошибку при потере фокуса, если значение некорректное', () => {
    const field = createLoginField('1');

    getInput(field).dispatchEvent(new FocusEvent('focusout', { bubbles: true }));

    expect(getError(field)).not.toBe('');
    expect(field.getContent().classList.contains('form-field_invalid')).toBe(true);
  });

  it('не показывает ошибку для корректного значения', () => {
    const field = createLoginField('test_user');

    expect(field.validate()).toBe(true);
    expect(getError(field)).toBe('');
  });

  it('сохраняет введённое значение после показа ошибки', () => {
    const field = createLoginField();
    getInput(field).value = '1';

    field.validate();

    expect(getInput(field).value).toBe('1');
  });
});
