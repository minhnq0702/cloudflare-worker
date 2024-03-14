/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}


export default {
	/**
	 * The main fetch handler, called on incoming requests
	 * @param {Request} request
	 * @param {Env} env
	 * @param {ExecutionContext} ctx
	 * @returns {Promise<Response>}
	 */
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// return another website
		// return await fetch('https://init.vn', request);

		console.log(request.json().then(console.log))
		return new Response('Hello World! This is my new first Worker project.');
	},

	// /**
	//  * The main scheduled handler, called on a schedule
	//  * @param {ScheduledEvent} event
	//  * @param {Env} env
	//  * @param {ExecutionContext} ctx
	//  * @returns {Promise<void>}
	//  */
	// async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> { 
	// 	// console.log('Scheduled event:', event);
	// 	ctx.waitUntil(new Promise(resolve => {
	// 		console.log('This will run after the main event handler')
	// 		setTimeout(resolve, 1000);
	// 	}));
	// }
};
