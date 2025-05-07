import { describe, expect, test } from 'bun:test';
import app from './app';

describe('Web App', () => {
  test('return a response', async () => {
    const response = await app
      .handle(new Request('http://localhost/'))
      .then((res) => res.text());

    expect(response).toBe('/');
  });

  test('responds to /hello', async () => {
    const response = await app
      .handle(
        new Request('http://localhost/hello', {
          method: 'POST',
        })
      )
      .then((res) => res.text());

    expect(response).toBe('Do you miss me?');
  });
});
