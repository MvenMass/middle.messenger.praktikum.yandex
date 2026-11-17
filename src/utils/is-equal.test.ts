import { describe, expect, it } from '@jest/globals';

import { isEqual } from './is-equal';

describe('isEqual', () => {
  it('считает равными объекты с одинаковыми полями', () => {
    expect(isEqual({ a: 1, b: { c: 'текст' } }, { a: 1, b: { c: 'текст' } })).toBe(true);
  });

  it('различает объекты с разными значениями', () => {
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('различает объекты с разным набором ключей', () => {
    expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it('сравнивает массивы поэлементно', () => {
    expect(isEqual([1, { a: 2 }], [1, { a: 2 }])).toBe(true);
  });

  it('различает массивы разной длины', () => {
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
  });
});
