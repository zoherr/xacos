import Fastify from 'fastify';
import { testClient } from '../testClient';
import { writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';

const ITERATIONS = 10_000;

async function benchmarkBare(): Promise<number> {
  const fastify = Fastify({ logger: false });
  fastify.get('/api/ping', async () => ({ pong: true }));
  await fastify.ready();

  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    await fastify.inject({ method: 'GET', url: '/api/ping' });
  }
  const elapsed = performance.now() - start;
  await fastify.close();
  return elapsed;
}

async function benchmarkXAOCS(): Promise<number> {
  const tmp = resolve('./packages/testing/tmp-bench-fixture');
  mkdirSync(tmp, { recursive: true });
  writeFileSync(join(tmp, 'ping.api.ts'), `
import { XRouter } from '@xacos/core';
export const router = new XRouter();
router.get('/', async (_req, res) => res.json({ pong: true }));
  `);

  const client = await testClient({ apiDir: tmp, boot: false });

  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    await client._fastify.inject({ method: 'GET', url: '/api/ping' });
  }
  const elapsed = performance.now() - start;
  await client.close();
  rmSync(tmp, { recursive: true, force: true });
  return elapsed;
}

async function run() {
  console.log(`\nRunning ${ITERATIONS} iterations each...\n`);

  const bareMs = await benchmarkBare();
  const xaocsMs = await benchmarkXAOCS();

  const bareRps = Math.round(ITERATIONS / (bareMs / 1000));
  const xaocsRps = Math.round(ITERATIONS / (xaocsMs / 1000));
  const overhead = (((xaocsMs - bareMs) / bareMs) * 100).toFixed(1);

  const result = `
# XAOCS Benchmark Results

| Metric | Bare Fastify | XAOCS | Overhead |
|--------|-------------|-------|---------|
| Requests/sec | ${bareRps} | ${xaocsRps} | ${overhead}% |
| Total time (${ITERATIONS} reqs) | ${bareMs.toFixed(0)}ms | ${xaocsMs.toFixed(0)}ms | — |

Run date: ${new Date().toISOString()}
Platform: ${process.platform} / Bun ${process.versions.bun}

## Notes
- In-process benchmarks (no network overhead)
- XAOCS overhead includes: file scanner, request adapter, middleware compose
- Acceptable overhead target: < 15%
`;

  mkdirSync(resolve('./benchmarks'), { recursive: true });
  writeFileSync(resolve('./benchmarks/results.md'), result);
  console.log(result);
}

run().catch(console.error);
