export default class RateLimiter {
  private windowSizeInMs: number;
  private requestThreshold: number;
  private currentWindow: number;
  private currentWindowRequest = 0;

  constructor(windowSizeInMs: number, requestThreshold: number) {
    this.windowSizeInMs = windowSizeInMs;
    this.requestThreshold = requestThreshold;
    this.currentWindow = Math.floor(Date.now() / windowSizeInMs);
  }

  /**
   * 
   * - Divide current time into Fixed windows of window size (S)
    - When a new request comes in, check if the request is in the current window
    - If in the current window, check the request tracker count and if it is below threshold, allow the request
    - If it is a new window, reset the counter and increment by 1 and allow the request
   * 
   * @returns If the request should be allowed
   * 
   */
  public allowRequest = (): boolean => {
    const currentTime = Date.now();

    // Divide current time into Fixed windows of window size (S)
    const latestWindow = Math.floor(currentTime / this.windowSizeInMs);

    // If in the current window,
    if (latestWindow === this.currentWindow) {
      // check the request tracker count and if it is below threshold,
      if (this.currentWindowRequest < this.requestThreshold) {
        // allow the request
        this.currentWindowRequest += 1;
        return true;
      }
    } else {
      // If it is a new window, reset the counter and increment by 1 and allow the request
      this.currentWindow = latestWindow;
      this.currentWindowRequest += 1;
      return true;
    }

    return false;
  };
}
