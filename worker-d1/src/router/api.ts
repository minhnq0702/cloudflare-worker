import { Hono, Context } from 'hono'

import { Binding } from '../bindings/binding';

import userApi from './api_user';
import customerApi from './api_customer';
import productApi from './api_product';
import saleOrderApi from './api_sale_order';

const api = new Hono<{ Bindings: Binding }>();

api.get('/', (c: Context) => { 
  return c.json({
    code: 0,
    message: 'Hello! Welcome to my first Hono app sample!'
  })
});

api.get('/ping/:name', (c: Context<{ Bindings: Binding }>) => {
  const { name } = c.req.param()
  return c.json({
    code: 0,
    message: `Pinggggg, ${name}!`
  })
});

api.route('/user', userApi);
api.route('/customer', customerApi);
api.route('/product', productApi);
api.route('/sale-order', saleOrderApi);

export default api;