export default class RateLimiter {
  private slidingWindowInMs: number;
  private requestThreshold: number;
  private requestLog: number[] = [];

  constructor(slidingWindowInMs: number, requestThreshold: number) {
    this.slidingWindowInMs = slidingWindowInMs;
    this.requestThreshold = requestThreshold;
  }

  /**
   * Sliding Window Rate Limiter
   *
   * @returns If the request is allowed
   */
  public allowRequest = (): boolean => {
    const requestTime = Date.now();

    // Calculate the cutoff
    const cutoffTime = requestTime - this.slidingWindowInMs;

    // Remove the older requests based on the cutoff
    const filteredLog = this.requestLog.filter((x) => x > cutoffTime);

    // Check if the length of the list is below the threshold
    if (filteredLog.length < this.requestThreshold) {
      // Add the request to the log
      this.requestLog = filteredLog;
      this.requestLog.push(requestTime);

      return true;
    }

    return false;
  };
}
