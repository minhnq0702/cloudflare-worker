import { Hono, Context } from 'hono'
import { Binding } from '../bindings/binding';
import Customer from '../bindings/customer';

const api = new Hono<{ Bindings: Binding}>();

api.get('/', (c: Context) => { 
  return c.json({
    code: 0,
    message: 'Hello! Welcome to my first Hono app sample!'
  })
});

api.get('/ping/:name', (c: Context<{Bindings: Binding}>) => {

  const { name } = c.req.param()
  return c.json({
    code: 0,
    message: `Pinggggg, ${name}!`
  })
})

api
  .get('/customer', async (c) => {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM customer
    `).all();

    // TODO should query to database
    return c.json({
      code: 0,
      message: 'List of Customers',
      data: results
    })
  })
  .post('/customer', async (c: Context<{Bindings: Binding}>) => {
    try {
      // TODO should typecast for payload
      // TODO should validate the payload
      const _customer = await c.req.json<Customer>();

      await c.env.DB
        .prepare(
          `INSERT INTO customer (fullname, phone, email) VALUES (?, ?, ?)`
        )
        .bind(_customer.fullname, _customer.phone, _customer.email)
        .run();
      
      return c.json({
        code: 0,
        message: 'Customer has been created'
      
      }, {
        status: 201
      });
    } catch (error) {
      return new Response('Bad Payload format', { status: 400 });
    }  
  })


export default api;