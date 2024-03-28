import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';

import { Binding } from '../bindings/binding';
import schema from '../bindings';

const customerApi = new Hono<{ Bindings: Binding }>();

// ******* Customer *******
customerApi
  .route('/')
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

export default customerApi;
