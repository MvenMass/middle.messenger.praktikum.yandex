import { describe, expect, it } from '@jest/globals';

import { queryStringify } from './query-string';

describe('queryStringify', () => {
  it('собирает строку запроса из объекта', () => {
    expect(queryStringify({ limit: 10, title: 'chat' })).toBe('?limit=10&title=chat');
  });

  it('кодирует специальные символы', () => {
    expect(queryStringify({ title: 'a&b c' })).toBe('?title=a%26b%20c');
  });

  it('пропускает undefined и null', () => {
    expect(queryStringify({ title: undefined, offset: null, limit: 5 })).toBe('?limit=5');
  });

  it('возвращает пустую строку для пустого объекта', () => {
    expect(queryStringify({})).toBe('');
  });
});
