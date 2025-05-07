import { describe, test, expect } from 'bun:test';
import { getRouteParts, routeMiddleware } from './pathRouter';

describe('getRouteParts', () => {
  test('must match wildcard paths', () => {
    // Route Pattern : /api/users/*
    // Incoming Path : /api/users/1/address
    // Expected wildcard part : 1/address
    expect(getRouteParts('/api/users/*', '/api/users/1/address')).toEqual({
      wildcard: '1/address',
      params: {},
      queryParams: {},
    });
  });

  test('must match positional params', () => {
    // Route Pattern : /api/users/:user_id/address
    // Incoming Path : /api/users/1/address
    // Expected param { user_id: "1" }
    expect(
      getRouteParts('/api/users/:user_id/address', '/api/users/1/address')
    ).toEqual({
      wildcard: '',
      params: { user_id: '1' },
      queryParams: {},
    });
  });

  test('must NOT match if the route tokens are not equal length for non-wildcard', () => {
    // Route Pattern : /api/users/
    // Incoming Path : /api/users/1/address
    // Expected : null
    expect(getRouteParts('/api/users/', '/api/users/1/address')).toBeNull();
  });

  test('must NOT match if if the next incoming token doesnt match route pattern token AND next route token is NOT "*"', () => {
    // Route Pattern : /api/users/:user_id/settings
    // Incoming Path : /api/users/1/address
    // Expected : null
    expect(
      getRouteParts('/api/users/:user_id/settings', '/api/users/1/address')
    ).toBeNull();
  });
});

describe('router middleware', () => {
  test('must match route patterns', () => {
    const routePattern = ['/api/users/*'];
    const url = 'http://localhost/api/users/1/address';

    expect(routeMiddleware(url, routePattern)).toEqual({
      wildcard: '1/address',
      params: {},
      queryParams: {},
    });
  });

  test('must match route patterns in order', () => {
    const routePattern = ['/api/users/:user_id/address', '/api/users/*'];
    const url = 'http://localhost/api/users/1/address';

    expect(routeMiddleware(url, routePattern)).toEqual({
      wildcard: '',
      params: { user_id: '1' },
      queryParams: {},
    });
  });

  test('must NOT match if the route tokens are not equal length for non-wildcard', () => {
    const routePattern = ['/api/users/'];
    const url = 'http://localhost/api/users/1/address';

    expect(routeMiddleware(url, routePattern)).toBeNull();
  });
});
