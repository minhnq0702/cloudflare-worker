import { Hono, Context } from 'hono'
import { Binding } from '../bindings/binding';

const api = new Hono<{ Bindings: Binding}>();

api.get('/', (c: Context) => { 
  return c.json({
    code: 0,
    message: 'Hello! Welcome to my first Hono app sample!'
  })
});

api.get('/ping/:name', (c: Context) => {
  const { name } = c.req.param()
  return c.json({
    code: 0,
    message: `Pinggggg, ${name}!`
  })
})

export default api;