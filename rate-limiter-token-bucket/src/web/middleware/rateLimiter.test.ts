import { describe, test, expect, setSystemTime, beforeEach } from 'bun:test';
import RateLimiter from './rateLimiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Reset the system time
    setSystemTime();
  });

  test('should allow request when there are tokens', () => {
    const rateLimiter = new RateLimiter(10, 1);

    expect(rateLimiter.allowRequest(1)).toBeTrue();
  });

  test('should reject request if there are not enough tokens', () => {
    // Set the system time
    const currentTime = Date.now();
    setSystemTime(currentTime);

    const rateLimiter = new RateLimiter(10, 1);

    // Call it 10 times
    for (let i = 0; i < 10; i++) expect(rateLimiter.allowRequest(1)).toBeTrue();

    // 11th request should fail
    expect(rateLimiter.allowRequest(1)).toBeFalse();
  });

  test('should allow request after refill', () => {
    // Set the system time
    const currentTime = Date.now();
    setSystemTime(currentTime);

    const rateLimiter = new RateLimiter(10, 1);

    // Call it 10 times
    for (let i = 0; i < 10; i++) expect(rateLimiter.allowRequest(1)).toBeTrue();

    // 11th request should fail
    expect(rateLimiter.allowRequest(1)).toBeFalse();

    // increment 1 milli
    setSystemTime(currentTime + 1);
    expect(rateLimiter.allowRequest(1)).toBeTrue();
  });
});
