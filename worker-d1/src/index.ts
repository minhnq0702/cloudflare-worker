/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// export interface Env {
// 	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
// 	// MY_KV_NAMESPACE: KVNamespace;
// 	//
// 	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
// 	// MY_DURABLE_OBJECT: DurableObjectNamespace;
// 	//
// 	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
// 	// MY_BUCKET: R2Bucket;
// 	//
// 	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
// 	// MY_SERVICE: Fetcher;
// 	//
// 	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
// 	// MY_QUEUE: Queue;

// 	// Binding to D1 Database
// 	DB: D1Database;
// }

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
