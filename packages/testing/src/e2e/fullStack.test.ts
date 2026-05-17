import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { testClient, type TestClient } from '../testClient';
import { initDb, getKnex, closeDb } from '@xacos/orm';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { resolve } from 'path';

// ──────────────────────────────────────────────────────
// Test fixture: a minimal XAOCS app in a temp directory
// ──────────────────────────────────────────────────────
const FIXTURE_DIR = resolve('./packages/testing/tmp-e2e-fixture');
const API_DIR = `${FIXTURE_DIR}/api`;

function createFixture() {
  mkdirSync(API_DIR, { recursive: true });

  // user.api.ts — full CRUD
  writeFileSync(`${API_DIR}/user.api.ts`, `
import { XRouter } from '@xacos/core';
export const router = new XRouter();
const users: { id: number; name: string }[] = [];
let nextId = 1;

router.get('/', async (_req, res) => res.json({ success: true, data: users }));
router.get('/:id', async (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'Not found' });
  return res.json({ success: true, data: user });
});
router.post('/', async (req, res) => {
  const body = req.body as { name: string };
  const user = { id: nextId++, name: body.name };
  users.push(user);
  return res.status(201).json({ success: true, data: user });
});
router.put('/:id', async (req, res) => {
  const idx = users.findIndex(u => u.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  users[idx] = { ...users[idx]!, ...(req.body as object) };
  return res.json({ success: true, data: users[idx] });
});
router.delete('/:id', async (req, res) => {
  const idx = users.findIndex(u => u.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  users.splice(idx, 1);
  return res.status(204).send();
});
  `);
}

let client: TestClient;

beforeAll(async () => {
  createFixture();
  client = await testClient({ apiDir: API_DIR, boot: false });
});

afterAll(async () => {
  await client.close();
  rmSync(FIXTURE_DIR, { recursive: true, force: true });
});

// ──────────────────────────────────────────────────────
// Full CRUD cycle test
// ──────────────────────────────────────────────────────
describe('Full-Stack E2E: User CRUD', () => {
  it('GET /api/user — returns empty list', async () => {
    const res = await client.get('/api/user');
    expect(res.status).toBe(200);
    expect((res.body as any).data).toEqual([]);
  });

  it('POST /api/user — creates a user', async () => {
    const res = await client.post('/api/user', { name: 'Alice' });
    expect(res.status).toBe(201);
    expect((res.body as any).data.id).toBe(1);
    expect((res.body as any).data.name).toBe('Alice');
  });

  it('GET /api/user — returns created user', async () => {
    const res = await client.get('/api/user');
    expect((res.body as any).data).toHaveLength(1);
  });

  it('GET /api/user/1 — returns specific user', async () => {
    const res = await client.get('/api/user/1');
    expect(res.status).toBe(200);
    expect((res.body as any).data.name).toBe('Alice');
  });

  it('PUT /api/user/1 — updates user', async () => {
    const res = await client.put('/api/user/1', { name: 'Alice Updated' });
    expect(res.status).toBe(200);
    expect((res.body as any).data.name).toBe('Alice Updated');
  });

  it('DELETE /api/user/1 — deletes user', async () => {
    const res = await client.delete('/api/user/1');
    expect(res.status).toBe(204);
  });

  it('GET /api/user/1 — returns 404 after delete', async () => {
    const res = await client.get('/api/user/1');
    expect(res.status).toBe(404);
  });

  it('GET /api/user — returns empty list after delete', async () => {
    const res = await client.get('/api/user');
    expect((res.body as any).data).toHaveLength(0);
  });
});

// ──────────────────────────────────────────────────────
// Middleware chain test
// ──────────────────────────────────────────────────────
describe('Middleware chain', () => {
  it('protected route returns 401 without token', async () => {
    // Add a protected route to the fixture
    writeFileSync(`${API_DIR}/protected.api.ts`, `
import { XRouter } from '@xacos/core';
import type { XMiddleware } from '@xacos/shared';
export const router = new XRouter();
const guard: XMiddleware = async (req, res, next) => {
  const h = req.headers['authorization'];
  if (!h) return res.status(401).json({ error: 'Unauthorized' });
  await next();
};
router.get('/', guard, async (req, res) => res.json({ ok: true }));
    `);
    // Re-init client to pick up new route
    await client.close();
    client = await testClient({ apiDir: API_DIR, boot: false });

    const res = await client.get('/api/protected');
    expect(res.status).toBe(401);
  });

  it('protected route succeeds with token', async () => {
    const res = await client.get('/api/protected', { headers: { authorization: 'Bearer test-token' } });
    expect(res.status).toBe(200);
    expect((res.body as any).ok).toBe(true);
  });
});
