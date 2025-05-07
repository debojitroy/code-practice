import { describe, expect, it } from 'bun:test';
import app from './app';

describe('Web App', () => {
  it('must match path', async () => {
    const response = await app
      .handle(new Request('http://localhost/api/users/1/address'))
      .then((res) => res.json());

    expect(response).toEqual({
      wildcard: '',
      params: { user_id: '1' },
      queryParams: {},
    });
  });

  it('must return 404 if no matching route found', async () => {
    const response = await app
      .handle(new Request('http://localhost/hello'))
      .then((res) => res.status);

    expect(response).toEqual(404);
  });
});
