import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator';

import { Binding } from '../bindings/binding';
import schema from '../bindings';

const apiProduct = new Hono<{ Bindings: Binding }>();


// ******* Product *******
apiProduct
  .route('/')
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

export default apiProduct;
