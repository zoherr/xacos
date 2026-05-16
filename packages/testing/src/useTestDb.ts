import { getKnex } from '@xacos/orm';
import type { Knex } from 'knex';

export interface TestDbTransaction {
  trx: Knex.Transaction;
  rollback: () => Promise<void>;
  commit: () => Promise<void>;
}

/**
 * Wrap your test in a database transaction that auto-rolls back.
 * Keeps your database clean between tests.
 *
 * @example
 * const db = await useTestDb();
 * await User.create({ name: 'Test', email: 'test@test.com' });
 * // All changes rolled back after test
 * await db.rollback();
 */
export async function useTestDb(): Promise<TestDbTransaction> {
  const knex = getKnex();
  const trx = await knex.transaction();

  return {
    trx,
    rollback: async () => {
      await trx.rollback();
    },
    commit: async () => {
      await trx.commit();
    },
  };
}

