import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { Binding } from '../bindings/binding';
import schema from '../bindings';
import { Jwt } from 'hono/utils/jwt';

const auth = new Hono<{ Bindings: Binding }>();

auth.post('/register',
  zValidator('json', schema.userSchema, schema.validator),
  async (c) => {
    // TODO: register user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _user = c.req.valid('json');
    // hash password
    // insert user to database
    // return response
    return c.json({
      code: 0,
      message: 'User has been created',
    }, {
      status: 201,
    });
  }
);

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
