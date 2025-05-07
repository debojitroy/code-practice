import { describe, expect, it } from 'bun:test';
import app from './app';

describe('Web App', () => {
  it('return a response', async () => {
    const response = await app
      .handle(new Request('http://localhost/'))
      .then((res) => res.text());

    expect(response).toBe('/');
  });

  it('responds to /hello', async () => {
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
