import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { closeDb, getKnex, initDb, MigrationRunner } from "../index";

describe("MigrationRunner", () => {
  const fixturesDir = join(fileURLToPath(new URL(".", import.meta.url)), "..", "..", "test-fixtures", "migrations");

  beforeAll(() => {
    initDb({ __memorySqlite: true });
  });

  afterAll(async () => {
    await closeDb();
  });

  it("runs pending migrations, rolls back the last batch, and reapplies on fresh", async () => {
    const runner = new MigrationRunner();
    const knex = getKnex();

    await runner.run(fixturesDir);
    expect(await knex.schema.hasTable("migration_test")).toBe(true);
    expect((await runner.getPending(fixturesDir)).length).toBe(0);

    await runner.rollback(fixturesDir);
    expect(await knex.schema.hasTable("migration_test")).toBe(false);

    await runner.fresh(fixturesDir);
    expect(await knex.schema.hasTable("migration_test")).toBe(true);
    expect(await knex.schema.hasTable("xacos_migrations")).toBe(true);
  });
});

