import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { initDb, getKnex, closeDb } from '../connection/db';
import { MigrationRunner } from '../migrations/MigrationRunner';
import { XModel } from '../XModel';
import { Column } from '../decorators';
import { resolve } from 'path';
import { unlinkSync, existsSync } from 'fs';

const DB_PATH = './tmp-test.sqlite';

process.env['DB_DRIVER'] = 'sqlite';
process.env['DB_PATH'] = DB_PATH;

class TestUser extends XModel {
  static table = 'test_users';

  @Column()
  declare id: number;

  @Column()
  declare name: string;

  @Column()
  declare email: string;

  @Column()
  declare created_at: Date;

  @Column()
  declare updated_at: Date;
}

beforeAll(async () => {
  initDb();
  const knex = getKnex();

  // Create the test table directly
  await knex.schema.createTableIfNotExists('test_users', t => {
    t.increments('id');
    t.string('name').notNullable();
    t.string('email').notNullable().unique();
    t.timestamps(true, true);
  });
});

afterAll(async () => {
  await closeDb();
  if (existsSync(DB_PATH)) unlinkSync(DB_PATH);
});

beforeEach(async () => {
  await getKnex()('test_users').delete();
});

describe('SQLite Integration — XModel', () => {
  it('creates a record', async () => {
    const user = await TestUser.create({ name: 'Alice', email: 'alice@test.com' } as any);
    expect((user as any).id).toBeGreaterThan(0);
    expect((user as any).name).toBe('Alice');
  });

  it('finds a record by id', async () => {
    const created = await TestUser.create({ name: 'Bob', email: 'bob@test.com' } as any);
    const found = await TestUser.find((created as any).id) as any;
    expect(found).not.toBeNull();
    expect(found.name).toBe('Bob');
  });

  it('returns null for missing id', async () => {
    const found = await TestUser.find(9999);
    expect(found).toBeNull();
  });

  it('findOrFail throws for missing id', async () => {
    await expect(TestUser.findOrFail(9999)).rejects.toThrow();
  });

  it('queries with where()', async () => {
    await TestUser.create({ name: 'Carol', email: 'carol@test.com' } as any);
    await TestUser.create({ name: 'Dave', email: 'dave@test.com' } as any);
    const results = await TestUser.where('name', 'Carol').select() as any[];
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Carol');
  });

  it('returns all records', async () => {
    await TestUser.create({ name: 'Eve', email: 'eve@test.com' } as any);
    await TestUser.create({ name: 'Frank', email: 'frank@test.com' } as any);
    const all = await TestUser.all() as any[];
    expect(all.length).toBeGreaterThanOrEqual(2);
  });

  it('updates a record', async () => {
    const user = await TestUser.create({ name: 'Grace', email: 'grace@test.com' } as any) as any;
    await TestUser.update(user.id, { name: 'Grace Updated' });
    const updated = await TestUser.find(user.id) as any;
    expect(updated.name).toBe('Grace Updated');
  });

  it('deletes a record', async () => {
    const user = await TestUser.create({ name: 'Heidi', email: 'heidi@test.com' } as any) as any;
    await TestUser.destroy(user.id);
    const found = await TestUser.find(user.id);
    expect(found).toBeNull();
  });

  it('paginates results', async () => {
    for (let i = 0; i < 20; i++) {
      await TestUser.create({ name: `User${i}`, email: `user${i}@test.com` } as any);
    }
    const page = await TestUser.paginate(1, 5) as any;
    expect(page.data).toHaveLength(5);
    expect(page.total).toBe(20);
    expect(page.lastPage).toBe(4);
  });
});
