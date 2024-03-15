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
	WorkerTest: KVNamespace;
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// return another website
		// return await fetch('https://init.vn', request);
		
		console.log(env);

		// regex matching request url with "/test-kv"
		const kv_url_reg = /\/test-kv(\?.*)?$/;
		if (kv_url_reg.test(request.url)) {
			if (request.method === 'POST') {
				const formData = await request.formData();
				// log formData
				// console.log(formData);

				const entries = [...formData.entries()];
				// log entries
				// console.log(entries);

				await env.WorkerTest.put(entries[0][0], entries[0][1] as string);

				// forLoop to put all entries to KV and await each put
				for (const [name, value] of entries) {
					// check type of value
					if (typeof value === 'string') {
						await env.WorkerTest.put(name, value);
					}
				}
			}
    }
		return new Response('Hello World! This is my new first Worker project.');
	},

	/**
	 * The main scheduled handler, called on a schedule
	 * @param {ScheduledEvent} event
	 * @param {Env} env
	 * @param {ExecutionContext} ctx
	 * @returns {Promise<void>}
	 */
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> { 
		console.log('Scheduled event:', event);
		ctx.waitUntil(new Promise(resolve => {
			setTimeout(resolve, 1000);
			// add log to cloudflare worker
			console.log('This is a scheduled event log.');
		}));
	}
};
