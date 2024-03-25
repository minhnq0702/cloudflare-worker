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
      const _customer = c.req.valid('json')
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
  )
  .get('/:id', async (c) => {
    const { id } = c.req.param();
    const result = await c.env.DB.prepare(`
      SELECT * FROM customer WHERE id = ?
    `).bind(id).first();

    if (!result) {
      return c.json({
        code: 1,
        message: 'Customer not found'
      }, {
        status: 404
      });
    }

    return c.json({
      code: 0,
      message: 'Customer Detail',
      data: result
    })
  });

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
      const _product = c.req.valid('json');
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
  })
  .get('/:id', async (c) => {
    const { id } = c.req.param();
    const result  = await c.env.DB.prepare(`
      SELECT * FROM product WHERE id = ?
    `).bind(id).first();

    // TODO should query to database
    return c.json({
      code: 0,
      message: 'Product Detail',
      data: result
    })
  });

// ******* Sale Order *******
api
  .route('/sale-order')
  .get(async (c) => {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM sale_order
    `).all();

    // TODO should query to database
    return c.json({
      code: 0,
      message: 'List of Sale Orders',
      data: results
    })
  })
  .post(
    zValidator('json', schema.saleOrderSchema, schema.validator),
    async (c) => {
      const _saleOrder = c.req.valid('json');
      try {
        await c.env.DB
          .prepare(
            `INSERT INTO sale_order (customer_id, order_date, total) VALUES (?, ?, ?)`
          )
          .bind(_saleOrder.customer_id, _saleOrder.order_date, _saleOrder.total)
          .run();
        
        return c.json({
          code: 0,
          message: 'Sale Order has been created'
        }, {
          status: 201
        });
      } catch (error) {
        return c.json({
          code: 1,
          message: `Failed to create sale order with ${error}`
        }, {
          status: 400
        });
      }
  })
  .get('/:id', async (c) => {
    const { id } = c.req.param();
    const result = await c.env.DB.prepare(`
      SELECT * FROM sale_order WHERE id = ?
    `).bind(id).first();

    if (!result) {
      return c.json({
        code: 1,
        message: 'Sale Order not found'
      }, {
        status: 404
      });
    }

    return c.json({
      code: 0,
      message: 'Sale Order Detail',
      data: result
    })
  });

export default api;