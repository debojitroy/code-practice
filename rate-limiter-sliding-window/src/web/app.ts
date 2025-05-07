import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';

const app = new Elysia()
  // Apply the swagger plugin
  .use(swagger())
  .get('/', ({ path }) => path)
  .post('/hello', 'Do you miss me?')
  .listen(3000);

export default app;
