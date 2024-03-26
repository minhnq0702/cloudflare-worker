import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { Binding } from '../bindings/binding';
import schema from '../bindings';
import { Jwt } from 'hono/utils/jwt';

const auth = new Hono<{ Bindings: Binding }>();

// api get user name and password from request body
auth.post('/login',
  zValidator('json', schema.loginSchema, schema.validator),
  async (c) => {
    const { username, password } = c.req.valid('json');
    if (username === 'admin' && password === 'admin') {
      const token = await Jwt.sign({
        username,
        expiresIn: '1h',
      }, c.env.JWT_SECRET);
      c.res.headers.set(
        'Set-Cookie',
        `token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax`
        // `token=${token}; Path=/; HttpOnly; Secure; SameSite=Restricted`
      );
      return c.json({
        code: 0,
        message: 'Login success',
      });
    }

    return c.json({
      code: 1,
      message: 'Login failed',
    });
  }
);

export default auth;
