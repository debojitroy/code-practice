import { describe, expect, it, setSystemTime, beforeEach } from 'bun:test';
import app, { resetRateLimiters } from './app';

describe('Web App', () => {
  beforeEach(() => {
    // Reset the time
    setSystemTime();
    // Reset the rate limiters
    resetRateLimiters();
  });

  // it('return a response', async () => {
  //   const response = await app
  //     .handle(new Request('http://localhost/'))
  //     .then((res) => res.text());

  //   expect(response).toBe('/');
  // });

  // it('responds to /hello', async () => {
  //   const response = await app
  //     .handle(
  //       new Request('http://localhost/hello', {
  //         method: 'POST',
  //       })
  //     )
  //     .then((res) => res.text());

  //   expect(response).toBe('Do you miss me?');
  // });

  it('should reject request if limit is exceeded', async () => {
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

  it('should allow request after leaking', async () => {
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

  it('should allow request after leaking', async () => {
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
