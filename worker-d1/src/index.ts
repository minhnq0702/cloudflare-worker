/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import app from '../src/hono'
import { Binding as Env } from './bindings/binding';


export default {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	// async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	// 	return app.fetch(request, env, ctx);
	// },

	fetch: (request: Request, env: Env, ctx: ExecutionContext) => app.fetch(request, env, ctx),

	// * add other event handlers here
};
