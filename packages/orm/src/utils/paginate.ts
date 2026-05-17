import type { Knex } from 'knex';
import type { PaginatedResult } from '@xacos/shared';

/**
 * Paginate any Knex query builder.
 *
 * @example
 * const result = await paginate(
 *   User.query().where('role', 'admin'),
 *   req.query.page,
 *   15
 * );
 */
export async function paginate<T>(
  query: Knex.QueryBuilder,
  page: number | string = 1,
  perPage: number | string = 15
): Promise<PaginatedResult<T>> {
  const p = Math.max(1, Number(page));
  const pp = Math.min(100, Math.max(1, Number(perPage))); // cap at 100
  const offset = (p - 1) * pp;

  // Clone the query for count — without order/limit
  const countQuery = query.clone().clearOrder().clearSelect().count('* as total').first();
  const countResult = await countQuery as { total: string | number };
  const total = Number(countResult?.total ?? 0);

  const data = await query.offset(offset).limit(pp) as T[];

  return {
    data,
    total,
    page: p,
    perPage: pp,
    lastPage: Math.ceil(total / pp),
  };
}
