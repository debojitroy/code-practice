import { describe, test, expect, setSystemTime, beforeEach } from 'bun:test';
import RateLimiter from './rateLimiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    //Reset System Time
    setSystemTime();
  });

  test('should allow request when below threshold', () => {
    const rateLimiter = new RateLimiter(1000, 5); // 5 TPS

    expect(rateLimiter.allowRequest()).toBeTrue();
  });

  test('should reject request when above threshold', () => {
    const currentTime = Date.now();
    setSystemTime(currentTime);

    const rateLimiter = new RateLimiter(1000, 5); // 5 TPS

    // Call 5 times
    for (let index = 0; index < 5; index++) {
      expect(rateLimiter.allowRequest()).toBeTrue();
    }

    // 6th request should fail
    expect(rateLimiter.allowRequest()).toBeFalse();
  });

  test('should allow request after rejecting, when a window moves ahead', () => {
    const currentTime = Date.now();
    setSystemTime(currentTime);

    const rateLimiter = new RateLimiter(1000, 5); // 5 TPS

    // Call 5 times
    for (let index = 0; index < 5; index++) {
      expect(rateLimiter.allowRequest()).toBeTrue();
    }

    // 6th request should fail
    expect(rateLimiter.allowRequest()).toBeFalse();

    // Move the sys time by 1 second
    setSystemTime(currentTime + 1000);

    // Request should be allowed
    expect(rateLimiter.allowRequest()).toBeTrue();
  });
});
