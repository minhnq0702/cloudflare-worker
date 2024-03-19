import { Hono, Context } from 'hono'
import { Binding } from '../bindings/binding';

const sample = new Hono<{ Bindings: Binding}>();

sample.get('/', (c: Context) => { 
  console.log(c)
  // return new Response('Hello World!')
  return c.text('Hello! Welcome to my first Hono app sample!')
});

sample.get('/:name', (c: Context) => {
  const { name } = c.req.param()
  return c.text(`Hello World, ${name}!`)
})

export default sample;