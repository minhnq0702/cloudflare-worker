import { Hono, Context } from 'hono'
import { zValidator } from '@hono/zod-validator';

import { Binding } from '../bindings/binding';
import schema from '../bindings';

const api = new Hono<{ Bindings: Binding }>();

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

// ******* Customer *******
api
  .route('/customer')
  .get(async (c) => {
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
  .post(
    zValidator('json', schema.customerSchema, schema.validator),
    async (c) => {
      let _customer;
      try {
        // TODO should validate the payload
        // _customer = await c.req.json<Customer>();
        _customer = c.req.valid('json')
      }
      catch (error) {
        return new Response('Bad Payload format', { status: 400 });
      }

      try {
        await c.env.DB
          .prepare(
            `INSERT INTO customer (fullname, phone, email) VALUES (?, ?, ?)`
        )
          .bind(_customer.fullname, _customer.phone, _customer.email || null)
          .run();
        
        return c.json({
          code: 0,
          message: 'Customer has been created'
        
        }, {
          status: 201
        });
      } catch (error) {
        return c.json({
          code: 1,
          message: `Failed to create customer with ${error}`
        }, {
          status: 400
        });
      }
    },
  );

// ******* Product *******
api
  .route('/product')
  .get(async (c) => {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM product
    `).all();

    // TODO should query to database
    return c.json({
      code: 0,
      message: 'List of Products',
      data: results
    })
  })
  .post(
    zValidator('json', schema.productSchema, schema.validator),
    async (c) => {
      let _product;
      try {
        // TODO should validate the payload
        // _product = await c.req.json<Product>();
        _product = c.req.valid('json');
      } catch (error) {
        return new Response('Bad Payload format', { status: 400 });
      }

      try {
        await c.env.DB
          .prepare(
            `INSERT INTO product (code, name, price) VALUES (?, ?, ?)`
          )
          .bind(_product.code, _product.name, _product.price)
          .run();
        
        return c.json({
          code: 0,
          message: 'Product has been created'
        
        }, {
          status: 201
        });
      } catch (error) {
        return c.json({ 
          code: 1,
          message: `Failed to create product with ${error}`
        }, {
          status: 400
        });
      }
    }
  )

export default api;