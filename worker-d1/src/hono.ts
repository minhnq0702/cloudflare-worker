import { Hono, Next, Context } from 'hono';
import { RegExpRouter } from 'hono/router/reg-exp-router';

import { Binding } from './bindings/binding';
import router from './router';


// init app hono
const app = new Hono<{ Bindings: Binding }>({
  router: new RegExpRouter(),
});

// * add sample middleware
app.use(async (c: Context, next: Next) => {
  await next()

  // * sample how to set header to response in middleware
  c.res.headers.set('x-hono', '1.0.0');
  c.res.headers.set('x-hono-env', JSON.stringify(c.env));
})

app.route('/sample', router.sample);
app.route('/api', router.api);



export default app