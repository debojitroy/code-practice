import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import RateLimiter from './middleware/rateLimiter';

// Rate limiting based on api-key
// Map of API Keys with their own limiters
const rateLimiterMap = new Map<string, RateLimiter>();
const apiKeyHeader = 'x-api-key';

export const resetRateLimiters = () => rateLimiterMap.clear();

const app = new Elysia()
  // Apply the swagger plugin
  .use(swagger())
  .onRequest(({ request, error }) => {
    // Get the API Key
    const apiKey = request.headers.get(apiKeyHeader);

    if (!apiKey) {
      return error(401);
    }

    // Check if the rate limiter already exists
    let apiRateLimiter = rateLimiterMap.get(apiKey);

    // If not, then initialise and add to the map
    if (!apiRateLimiter) {
      apiRateLimiter = new RateLimiter(10, 1);
      rateLimiterMap.set(apiKey, apiRateLimiter);
    }

    if (!apiRateLimiter.allowRequest()) {
      return error(429);
    }
  })
  .get('/', ({ path }) => path)
  .post('/hello', 'Do you miss me?')
  .listen(3000);

export default app;
