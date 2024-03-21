import { Hono, Next, Context } from 'hono';
// import { cache } from 'hono/cache'
import { RegExpRouter } from 'hono/router/reg-exp-router';

import { Binding } from './bindings/binding';
import router from './router';


// init app hono
const app = new Hono<{ Bindings: Binding }>({
  router: new RegExpRouter(),
});

// * add cors middleware
import { cors } from 'hono/cors';
app.use('*', cors());


// * add logger middleware
import { logger } from 'hono/logger';
app.use(logger());

// * add sample middleware
app.use(async (c: Context, next: Next) => {
  await next()
  if (c.error) {
    // handle uncaught error
    // ! c.res.headers.set('x-hono-error', c.error.message);
    c.header('x-hono-error', c.error.message);
    c.res = Response.json({
      code: 500,
      message: c.error.message,
    });
  }

  // * sample how to set header to response in middleware
  c.res.headers.set('x-hono', '1.0.0');
  c.res.headers.set('x-hono-env', JSON.stringify(c.env));
});

// * add cache middleware
// app.get(
//   '*',
//   cache({
//     cacheName: 'my-app',
//     cacheControl: 'max-age=3600',
//   })
// )

app.route('/sample', router.sample);
app.route('/api', router.api);



export default app