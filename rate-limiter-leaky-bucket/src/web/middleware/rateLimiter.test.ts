import { describe, test, expect, setSystemTime, beforeEach } from 'bun:test';
import RateLimiter from './rateLimiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Reset the system time
    setSystemTime();
  });

  test('should allow request when there is capacity', () => {
    const rateLimiter = new RateLimiter(10, 1);

    // First request should be allowed
    expect(rateLimiter.allowRequest()).toBeTrue();
  });

  test('should reject if the bucket is full', () => {
    const time = Date.now();

    setSystemTime(time);
    const rateLimiter = new RateLimiter(10, 1);

    // Make 10 requests
    // 11th request must be rejected

    for (let index = 0; index < 10; index++) {
      expect(rateLimiter.allowRequest()).toBeTrue();
    }

    expect(rateLimiter.allowRequest()).toBeFalse();
  });

  test('should allow request after leaking', () => {
    const time = Date.now();

    setSystemTime(time);
    const rateLimiter = new RateLimiter(10, 1);

    // Make 10 requests
    // 11th request must be rejected

    for (let index = 0; index < 10; index++) {
      expect(rateLimiter.allowRequest()).toBeTrue();
    }

    expect(rateLimiter.allowRequest()).toBeFalse();

    // Increment 2 millis
    setSystemTime(time + 2);

    // Should have capacity now
    expect(rateLimiter.allowRequest()).toBeTrue();
  });
});
