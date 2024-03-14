import { unstable_dev } from 'wrangler';
import type { UnstableDevWorker } from 'wrangler';

describe('worker-test', () => {
  let worker: UnstableDevWorker;

  beforeAll(async () => {
    // init worker from unstable_dev
    worker = await unstable_dev('src/index.ts', {
      experimental: {
        disableExperimentalWarning: true,
      },
      // inspect: true,
      // logLevel: 'debug',
      local: true,
      port: 8787,
    });
  });

  afterAll(async () => {
    // close worker
    await worker.stop();
  });

  it('should be a function', () => {
    expect(unstable_dev).toBeInstanceOf(Function);
  });

  it("should return Hello World", async () => {
    const resp = await worker.fetch();
    const text = await resp.text();
    expect(text).toMatchInlineSnapshot(`"Hello World! This is my new first Worker project."`);
  });
});