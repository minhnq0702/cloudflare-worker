import type { Env } from 'hono';
import { Hook } from '@hono/zod-validator';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const userSchema = z.object({
  id: z.number().optional(),
  username: z.string(),
  password: z.string(),
  fullname: z.string(),
  email: z.string().email().nullable().optional(),
  role: z.string().optional(),
});

const customerSchema = z.object({
  id: z.number().optional(),
  fullname: z.string(),
  phone: z.string(),
  email: z.string().email().nullable().optional(),
});

const productSchema = z.object({
  id: z.number().optional(),
  code: z.string(),
  name: z.string(),
  price: z.number().optional().default(0.0),
});

const saleOrderSchema = z.object({
  id: z.number().optional(),
  customer_id: z.number(),
  order_date: z.string().datetime(),
  total: z.number().optional().default(0.0),
});


type _validationErrType = ({
  message: string;
  path: string;
})[]

// TODO replace with Hook type from @hono/zod-validator
const validator: Hook<z.TypeOf<z.ZodType>, Env, string, object> = (result, c) => {
  if (!result.success) {
    const err = result.error;
    const validationErrs: _validationErrType = [];
    err.errors.forEach((e) => {
      console.error(e.message);
      validationErrs.push({
        message: e.message,
        path: e.path.join(' -> '), // TODO should be string | number
      });
    })
      
    return c.json({
      code: 1,
      message: 'Bad Payload format',
      validtonErrs: validationErrs,
    }, {
      status: 400,
    });
  }
}

export default {
  loginSchema,
  userSchema,
  customerSchema,
  productSchema,
  saleOrderSchema,
  validator,
}

