import { describe, expect, test, beforeEach, setSystemTime } from 'bun:test';
import app, { resetRateLimiters } from './app';

describe('Web App', () => {
  beforeEach(() => {
    setSystemTime();
    resetRateLimiters();
  });

  test('should reject request if there are no tokens', async () => {
    const time = Date.now();

    setSystemTime(time);

    const responses = [];
    for (let index = 0; index < 10; index++) {
      const res = await app.handle(
        new Request('http://localhost/', { headers: { 'x-api-key': 'test1' } })
      );
      const status = await res.status;
      responses.push(status);
    }

    for await (const element of responses) {
      expect(element).toEqual(200);
    }

    // 11th request should fail
    const res = await app.handle(
      new Request('http://localhost/', { headers: { 'x-api-key': 'test1' } })
    );
    const status = await res.status;
    expect(status).toEqual(429);
  });

  test('should allow request after refill', async () => {
    const time = Date.now();

    setSystemTime(time);

    const responses = [];
    for (let index = 0; index < 10; index++) {
      const res = await app.handle(
        new Request('http://localhost/', { headers: { 'x-api-key': 'test1' } })
      );
      const status = await res.status;
      responses.push(status);
    }

    for await (const element of responses) {
      expect(element).toEqual(200);
    }

    // 11th request should fail
    const res = await app.handle(
      new Request('http://localhost/', { headers: { 'x-api-key': 'test1' } })
    );
    const status = await res.status;
    expect(status).toEqual(429);

    // Increment 2 millis
    setSystemTime(time + 2);
    const successRes = await app.handle(
      new Request('http://localhost/', { headers: { 'x-api-key': 'test1' } })
    );
    const successStatus = await successRes.status;
    expect(successStatus).toEqual(200);
  });
});
