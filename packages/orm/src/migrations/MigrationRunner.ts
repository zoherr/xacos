import { readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { Knex } from "knex";
import { getKnex } from "../connection/db";
import type { Migration } from "./Migration";
import { Schema } from "./Schema";

async function listUserTables(knex: Knex): Promise<string[]> {
  const client = knex.client.config.client;

  if (client === "better-sqlite3" || client === "sqlite3") {
    const rows = (await knex
      .select<{ name: string }>("name")
      .from("sqlite_master")
      .where("type", "table")
      .whereNotIn("name", ["sqlite_sequence", "sqlite_stat1"])) as unknown as Array<{ name: string }>;

    return rows.map((row) => row.name);
  }

  if (client === "mysql2" || client === "mysql") {
    const dbName = (knex.client.config.connection as { database?: string }).database;
    if (!dbName) return [];
    const rows = (await knex
      .select<{ TABLE_NAME: string }>("TABLE_NAME")
      .from("information_schema.tables")
      .where({
        table_schema: dbName,
        table_type: "BASE TABLE",
      })) as unknown as Array<{ TABLE_NAME: string }>;
    return rows.map((row) => row.TABLE_NAME);
  }

  if (client === "pg") {
    const rows = (await knex
      .select<{ tablename: string }>("tablename")
      .from("pg_tables")
      .where("schemaname", "public")) as unknown as Array<{ tablename: string }>;
    return rows.map((row) => row.tablename);
  }

  throw new Error(`[XAOCS ORM] Unsupported SQL client for migrations: ${String(client)}`);
}

export class MigrationRunner {
  private readonly schema = new Schema();

  private async ensureMigrationsTable(): Promise<void> {
    const knex = getKnex();
    const exists = await knex.schema.hasTable("xaocs_migrations");
    if (exists) return;

    await knex.schema.createTable("xaocs_migrations", (table) => {
      table.increments("id").primary();
      table.string("name", 255).notNullable();
      table.integer("batch").notNullable();
      table.timestamp("ran_at").defaultTo(knex.fn.now());
    });
  }

  async getPending(migrationsDir: string): Promise<string[]> {
    await this.ensureMigrationsTable();
    const knex = getKnex();
    const ranRows = (await knex.select<{ name: string }>("name").from("xaocs_migrations")) as unknown as Array<{
      name: string;
    }>;
    const ran = new Set(ranRows.map((row) => row.name));

    let files: string[];
    try {
      files = readdirSync(migrationsDir);
    } catch {
      return [];
    }

    return files
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"))
      .filter((file) => !ran.has(file))
      .sort((a, b) => a.localeCompare(b));
  }

  async run(migrationsDir: string): Promise<void> {
    await this.ensureMigrationsTable();
    const knex = getKnex();
    const pending = await this.getPending(migrationsDir);
    if (pending.length === 0) return;

    const lastBatchRow = await knex("xaocs_migrations").max<{ b: number | string | null }>({ b: "batch" }).first();
    const batch = Number(lastBatchRow?.b ?? 0) + 1;

    for (const file of pending) {
      const abs = join(migrationsDir, file);
      const mod = (await import(pathToFileURL(abs).href)) as { default?: new () => Migration };
      const MigrationClass = mod.default;
      if (!MigrationClass) {
        throw new Error(`[XAOCS ORM] Migration file must default-export a Migration class: ${file}`);
      }

      const migration = new MigrationClass();
      await migration.up(this.schema);
      await knex("xaocs_migrations").insert({ name: file, batch, ran_at: knex.fn.now() });
    }
  }

  async rollback(migrationsDir: string): Promise<void> {
    await this.ensureMigrationsTable();
    const knex = getKnex();
    const lastBatchRow = await knex("xaocs_migrations").max<{ b: number | string | null }>({ b: "batch" }).first();
    const lastBatch = Number(lastBatchRow?.b ?? 0);
    if (!lastBatch) return;

    const rows = (await knex("xaocs_migrations").where("batch", lastBatch).orderBy("id", "desc")) as Array<{
      id: number | string;
      name: string;
    }>;
    const schema = new Schema();

    for (const row of rows) {
      const abs = join(migrationsDir, row.name);
      const mod = (await import(pathToFileURL(abs).href)) as { default?: new () => Migration };
      const MigrationClass = mod.default;
      if (!MigrationClass) {
        throw new Error(`[XAOCS ORM] Migration file must default-export a Migration class: ${row.name}`);
      }

      const migration = new MigrationClass();
      await migration.down(schema);
      await knex("xaocs_migrations").where("id", row.id as number | string).del();
    }
  }

  async fresh(migrationsDir: string): Promise<void> {
    const knex = getKnex();
    const tables = await listUserTables(knex);

    for (const name of tables) {
      await knex.schema.dropTableIfExists(name);
    }

    await this.run(migrationsDir);
  }
}
