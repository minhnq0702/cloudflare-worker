import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';

import { Binding } from '../bindings/binding';
import schema from '../bindings';

const apiSaleOrder = new Hono<{ Bindings: Binding }>();

// ******* Sale Order *******
apiSaleOrder
  .route('/')
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

export default apiSaleOrder;
