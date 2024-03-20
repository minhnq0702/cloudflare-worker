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

// import cloudflare router
import { Router, json } from 'itty-router';

// init router
const router = Router();

router
	.get('/', async () => {
		return new Response('Hello World! This is my new first Worker project.');
	})
	.get('/favicon.ico', () => new Response(null, {status: 204}));

router
	.get('/test-kv', async ({ query }, env: Env) => {
		const _key = query.key || null;
		if (_key && typeof _key === 'string') {
			const value = await env.WorkerTest.get(_key, 'text');
			return json({
				'message': 'Get key value from KV successfully',
				'key': _key,
				'value': value
			});
		}
		return json({
			'message': 'No key provided',
		}, {
			status: 400,
		});
	})
	.post('/test-kv', async (request, env: Env) => {
		const contentType = request.headers.get('content-type') || '';
		if (!contentType.includes('multipart/form-data')) {
			return json({
				message: 'Invalid content type. Expected multipart/form-data.'
			}, {
				status: 400,
			});
		}
		
		const formData = await request.formData();
		
		if (formData) {
			const entries = [...formData.entries()];
			for (const [name, value] of entries) {
				await env.WorkerTest.put(name, value as string);
			}
			return json({
				message: 'Update key value to KV successfully'
			});
		}
	});
	router.delete('/test-kv', async ({ query }, env: Env) => {
		const _key = query.key || null;
		if (_key && typeof _key === 'string') {
			await env.WorkerTest.delete(_key);
			return json({
				message: `Delete key ${_key} from KV successfully`
			});
		}
		return json({
			'message': 'No key provided',
		}, {
			status: 400,
		});
	})

router.all('/redirect', (request) => {
	const query = Object.fromEntries(new URL(request.url).searchParams);
	const redirectUrl = query.url || null;
	return Response.redirect(redirectUrl || 'https://www.google.com', 301);
 });

export default {
	fetch: router.handle,

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
