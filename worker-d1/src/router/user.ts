import { Hono, Context } from 'hono';
import { zValidator } from '@hono/zod-validator';
import hashPassword from './utils';

import { Binding } from "../bindings/binding";
import schema from "../bindings";


const userApi = new Hono<{ Bindings: Binding }>();

userApi
  .route('/')
  .get(async (c: Context) => {
    // query to database to get all users
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM user
    `).all();

    return c.json({
      code: 0,
      message: 'List of Users',
      data: results
    });
  })
  .post(
    zValidator('json', schema.userSchema, schema.validator),
    async (c) => {
      // validate request body
      const _user = c.req.valid('json');
      _user.password = await hashPassword(_user.password)

      try {
        // insert user to database
        await c.env.DB
          .prepare(
            `INSERT INTO user (username, password, fullname, email, role) VALUES (?, ?, ?, ?, ?)`
          )
          .bind(_user.username, _user.password, _user.fullname, _user.email, _user.role || 'test')
          .run();

        return c.json({
          code: 0,
          message: 'User has been created'
        }, {
          status: 201
        });
      } catch (error) {
        return c.json({
          code: 1,
          message: 'Failed to create user' + error
        }, {
          status: 500
        });
      }
    });

export default userApi;
