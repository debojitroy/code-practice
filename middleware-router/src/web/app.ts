import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { routeMiddleware } from './middleware/pathRouter';

const routePatterns = ['/api/users/:user_id/address', '/api/users/*'];

const app = new Elysia()
  // Apply the swagger plugin
  .use(swagger())
  .onRequest(({ request, error }) => {
    const pathSplits = routeMiddleware(request.url, routePatterns);

    if (pathSplits) {
      return pathSplits;
    } else {
      return error(404, 'Not Found');
    }
  })
  .listen(3000);

export default app;
