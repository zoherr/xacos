import { describe, it, expect, afterAll } from 'bun:test';
import { join } from 'node:path';
import { testClient } from './testClient';

const fixtureDir = join(import.meta.dir, '..', 'test-fixtures', 'api');
const client = await testClient({ apiDir: fixtureDir, boot: false });

describe('testClient', () => {
  it('makes GET requests', async () => {
    const res = await client.get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

afterAll(async () => {
  await client.close();
});

