import { expect, test } from 'bun:test';
import { afunc } from './index';

test('2 + 2', () => {
  expect(2 + 2).toBe(4);
});

test('afunc', () => {
  expect(afunc(1, 2)).toBe(3);
});
