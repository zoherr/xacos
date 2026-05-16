import type { Knex } from "knex";
import type { PaginatedResult } from "@xacos/shared";
import { getColumnOptions, getRelations, type ModelConstructor, type RelationMeta } from "./decorators";
import { getKnex } from "./connection/db";

async function resolveInsertedId(
  knex: Knex,
  table: string,
  insertResult: unknown,
  payload: Record<string, unknown>,
): Promise<number | string> {
  if (Array.isArray(insertResult)) {
    const first = insertResult[0];
    if (typeof first === "number" || typeof first === "string") {
      return first;
    }
    if (first && typeof first === "object" && "id" in first) {
      return (first as { id: number | string }).id;
    }
  }
  if (typeof insertResult === "number" || typeof insertResult === "string") {
    return insertResult;
  }
  if (payload.id != null) {
    return payload.id as number | string;
  }

  const row = await knex(table).select<{ id: number | string }>("id").orderBy("id", "desc").first();
  if (!row) {
    throw new Error("[XAOCS ORM] Unable to resolve inserted primary key");
  }
  return row.id;
}

async function attachHasMany(
  rows: Record<string, unknown>[],
  propertyKey: string,
  Related: ModelConstructor,
  foreignKey: string,
): Promise<void> {
  if (rows.length === 0) return;

  const ids = rows
    .map((row) => row.id)
    .filter((id): id is number | string => id !== undefined && id !== null);

  if (ids.length === 0) return;

  const relatedModel = Related as unknown as { query(): Knex.QueryBuilder };
  const relatedRows = (await relatedModel.query().whereIn(foreignKey, ids).select()) as Record<string, unknown>[];
  const grouped = new Map<number | string, Record<string, unknown>[]>();

  for (const rel of relatedRows) {
    const fk = rel[foreignKey] as number | string;
    const bucket = grouped.get(fk) ?? [];
    bucket.push(rel);
    grouped.set(fk, bucket);
  }

  for (const row of rows) {
    const id = row.id as number | string;
    row[propertyKey] = grouped.get(id) ?? [];
  }
}

export class RelationScope {
  private base: Knex.QueryBuilder;

  constructor(
    private readonly Model: typeof XModel,
    private readonly relations: readonly string[],
    base: Knex.QueryBuilder,
  ) {
    this.base = base;
  }

  where(column: string, value: unknown): this {
    this.base = this.base.clone().where(column, value as Knex.Value);
    return this;
  }

  whereIn(column: string, values: readonly unknown[]): this {
    this.base = this.base.clone().whereIn(column, values as readonly Knex.Value[]);
    return this;
  }

  orderBy(column: string, direction: "asc" | "desc" = "asc"): this {
    this.base = this.base.clone().orderBy(column, direction);
    return this;
  }

  limit(value: number): this {
    this.base = this.base.clone().limit(value);
    return this;
  }

  offset(value: number): this {
    this.base = this.base.clone().offset(value);
    return this;
  }

  async first(): Promise<Record<string, unknown> | null> {
    const row = (await this.base.clone().first()) as Record<string, unknown> | undefined;
    if (!row) return null;
    const rows = [row];
    await this.Model.hydrateRelations(rows, this.relations);
    return rows[0] ?? null;
  }

  async get(): Promise<Record<string, unknown>[]> {
    const rows = (await this.base.clone().select()) as Record<string, unknown>[];
    await this.Model.hydrateRelations(rows, this.relations);
    return rows;
  }
}

export abstract class XModel {
  static table = "";
  static softDeletes = false;

  static query(): Knex.QueryBuilder {
    const knex = getKnex();
    const Model = this as typeof XModel;
    if (!Model.table) {
      throw new Error("[XAOCS ORM] static table must be set on the model");
    }

    let builder = knex(Model.table);
    if (Model.softDeletes) {
      builder = builder.whereNull("deleted_at");
    }
    return builder;
  }

  static withTrashed(): Knex.QueryBuilder {
    const Model = this as typeof XModel;
    if (!Model.table) {
      throw new Error("[XAOCS ORM] static table must be set on the model");
    }
    return getKnex()(Model.table);
  }

  static with(...relations: string[]): RelationScope {
    const Model = this as typeof XModel;
    return new RelationScope(Model, relations, Model.query());
  }

  static async hydrateRelations(rows: Record<string, unknown>[], relations: readonly string[]): Promise<void> {
    const ctor = this as typeof XModel;
    const metas = getRelations(ctor);

    for (const relationName of relations) {
      const meta = metas.find((m: RelationMeta) => m.propertyKey === relationName);
      if (!meta) continue;

      if (meta.kind === "hasMany") {
        const Related = meta.related();
        await attachHasMany(rows, meta.propertyKey, Related, meta.foreignKey);
      }
    }
  }

  static async find(id: number | string): Promise<Record<string, unknown> | null> {
    const row = await (this as typeof XModel).query().where("id", id).first();
    return row ? (row as Record<string, unknown>) : null;
  }

  static async findOrFail(id: number | string): Promise<Record<string, unknown>> {
    const row = await (this as typeof XModel).find(id);
    if (!row) {
      const err = new Error("Not found");
      (err as Error & { statusCode: number }).statusCode = 404;
      throw err;
    }
    return row;
  }

  static async all(): Promise<Record<string, unknown>[]> {
    const rows = await (this as typeof XModel).query().select();
    return rows as Record<string, unknown>[];
  }

  static where(column: string, value: unknown): Knex.QueryBuilder;
  static where(criteria: Record<string, unknown>): Knex.QueryBuilder;
  static where(column: string | Record<string, unknown>, value?: unknown): Knex.QueryBuilder {
    const Model = this as typeof XModel;
    if (typeof column === "string") {
      return Model.query().where(column, value as Knex.Value);
    }
    return Model.query().where(column);
  }

  static async create(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const Model = this as typeof XModel;
    const knex = getKnex();
    const now = new Date();
    const payload: Record<string, unknown> = {
      ...data,
      created_at: data.created_at ?? now,
      updated_at: data.updated_at ?? now,
    };

    const insertResult = await knex(Model.table).insert(payload);
    const id = await resolveInsertedId(knex, Model.table, insertResult, payload);
    const created = await Model.find(id);
    if (!created) {
      throw new Error("[XAOCS ORM] Row missing after insert");
    }
    return created;
  }

  static async update(id: number | string, data: Record<string, unknown>): Promise<void> {
    const Model = this as typeof XModel;
    await Model.withTrashed().where("id", id).update({ ...data, updated_at: new Date() });
  }

  static async destroy(id: number | string): Promise<void> {
    const Model = this as typeof XModel;
    const existing = await Model.withTrashed().where("id", id).first();
    if (!existing) return;

    if (Model.softDeletes) {
      await Model.withTrashed().where("id", id).update({ deleted_at: new Date(), updated_at: new Date() });
      return;
    }

    await Model.withTrashed().where("id", id).del();
  }

  static async paginate(page = 1, perPage = 15): Promise<PaginatedResult<Record<string, unknown>>> {
    const Model = this as typeof XModel;
    const offset = (page - 1) * perPage;

    const countRows = (await Model.query()
      .clone()
      .clearOrder()
      .count<{ count: string | number }>("* as count")) as unknown as Array<{ count: string | number }>;
    const total = Number(countRows[0]?.count ?? 0);

    const data = (await Model.query().clone().offset(offset).limit(perPage).select()) as Record<string, unknown>[];
    const lastPage = Math.max(1, Math.ceil(total / perPage));

    return {
      data,
      total,
      page,
      perPage,
      lastPage,
    };
  }

  toJSON(): Record<string, unknown> {
    const ctor = this.constructor as typeof XModel;
    const source = this as Record<string, unknown>;
    const result: Record<string, unknown> = { ...source };

    for (const key of Object.keys(result)) {
      const meta = getColumnOptions(ctor, key);
      if (meta?.hidden) {
        delete result[key];
      }
    }

    return result;
  }

  async save(): Promise<void> {
    const Model = this.constructor as typeof XModel;
    const row = this as Record<string, unknown>;
    const id = row.id;
    if (id === undefined || id === null) {
      throw new Error("[XAOCS ORM] save() requires an id — use Model.create() for inserts");
    }

    const { id: _ignored, ...rest } = row;
    await getKnex()(Model.table).where("id", id).update({ ...rest, updated_at: new Date() });
  }

  async delete(): Promise<void> {
    const Model = this.constructor as typeof XModel;
    const id = (this as Record<string, unknown>).id as number | string;

    if (Model.softDeletes) {
      await Model.withTrashed().where("id", id).update({ deleted_at: new Date(), updated_at: new Date() });
      return;
    }

    await Model.withTrashed().where("id", id).del();
  }
}

export default XModel;

