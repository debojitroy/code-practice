export default class RateLimiter {
  private bucketCapacity: number;
  private refillRateInMillis: number;
  private currentTokensLeft: number;
  private lastRefillTime: number;

  constructor(bucketCapacity: number, refillRateInMillis: number) {
    this.bucketCapacity = bucketCapacity;
    this.refillRateInMillis = refillRateInMillis;
    // Start with a full bucket
    this.currentTokensLeft = bucketCapacity;
    // Set the refill time as now
    this.lastRefillTime = Date.now();
  }

  /**
   *  Token Bucket
   *  - Check when was the last refill, add tokens to the bucket based on last refill
   *  - Check the current tokens left after adding the refill
   *  - If there are enough tokens, deduct the incoming tokens and allow request
   *
   * @param tokens number of tokens for operation
   * @returns If the request is allowed
   */
  public allowRequest = (tokens = 1): boolean => {
    const currentTime = Date.now();

    // Refill = (current - lastrefill) * refill rate
    const refilledTokens =
      (currentTime - this.lastRefillTime) * this.refillRateInMillis;

    // Reset the last refill time
    this.lastRefillTime = currentTime;

    // Add the tokens to the bucket
    // without overflowing
    this.currentTokensLeft = Math.min(
      this.bucketCapacity,
      this.currentTokensLeft + refilledTokens
    );

    // Check if enough tokens
    if (tokens <= this.currentTokensLeft) {
      // Deduct the tokens
      this.currentTokensLeft = this.currentTokensLeft - tokens;
      return true;
    }

    return false;
  };
}
