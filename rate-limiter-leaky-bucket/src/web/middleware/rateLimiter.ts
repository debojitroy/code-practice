/**
 * Leaky bucket implementation
 *
 */
export default class RateLimiter {
  /**
   * The capacity of the bucket
   */
  private bucketCapacity: number;
  /**
   * Leaking rate of the bucket
   */
  private leakRateInMillis: number;
  private lastLeakTimeInMillis: number;
  private currentUsage: number;

  constructor(bucketCapacity: number, leakRateInMillis: number) {
    this.bucketCapacity = bucketCapacity;
    this.leakRateInMillis = leakRateInMillis;
    this.lastLeakTimeInMillis = Date.now();
    this.currentUsage = 0;
  }

  /**
   * Implementation of leaky bucket
   * - Check when was the last leak
   * - Remove drops based on the drops leaked
   * - Check if there is capacity
   * - If bucket is full, reject the request
   *
   * @returns If the request is allowed
   */
  public allowRequest = (): boolean => {
    const currentTime = Date.now();

    // leaked drops = time elapsed since last leak * leakRate
    const leakedDrops =
      (currentTime - this.lastLeakTimeInMillis) * this.leakRateInMillis;

    // Reset the last leak
    this.lastLeakTimeInMillis = currentTime;

    // Usage = (current usage - leaked drops) or 0
    this.currentUsage = Math.max(0, this.currentUsage - leakedDrops);

    if (this.currentUsage < this.bucketCapacity) {
      // Increment the usage
      this.currentUsage += 1;
      return true;
    }

    return false;
  };
}
