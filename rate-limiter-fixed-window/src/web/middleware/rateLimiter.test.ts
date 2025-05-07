import { describe, test, expect, setSystemTime, beforeEach } from 'bun:test';
import RateLimiter from './rateLimiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Reset System time
    setSystemTime();
  });

  test('should allow request in a new window', () => {
    const rateLimiter = new RateLimiter(1000, 5); // 5 TPS allowed

    expect(rateLimiter.allowRequest()).toBeTrue();
  });

  test('should reject request if threshold is breached', () => {
    const currentTime = Date.now();
    setSystemTime(currentTime);

    const rateLimiter = new RateLimiter(1000, 5); // 5 TPS allowed

    // Call 5 times
    for (let index = 0; index < 5; index++) {
      expect(rateLimiter.allowRequest()).toBeTrue();
    }

    // 6th call should fail
    expect(rateLimiter.allowRequest()).toBeFalse();
  });

  test('should allow request after rejecting, when a new window is created', () => {
    const currentTime = Date.now();
    setSystemTime(currentTime);

    const rateLimiter = new RateLimiter(1000, 5); // 5 TPS allowed

    // Call 5 times
    for (let index = 0; index < 5; index++) {
      expect(rateLimiter.allowRequest()).toBeTrue();
    }

    // 6th call should fail
    expect(rateLimiter.allowRequest()).toBeFalse();

    // Increment system time by 1 sec
    setSystemTime(currentTime + 1000);

    // New request should be allowed
    expect(rateLimiter.allowRequest()).toBeTrue();
  });
});
