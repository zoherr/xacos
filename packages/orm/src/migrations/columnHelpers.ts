import type { Knex } from "knex";

/** Augmented table builder: use `xaocsTimestamps()` / `xaocsSoftDeletes()` to avoid clashing with Knex's `timestamps()`. */
export type XCreateTableBuilder = Knex.CreateTableBuilder & {
  id(): void;
  xaocsTimestamps(): void;
  xaocsSoftDeletes(): void;
};

export function augmentTable(table: Knex.CreateTableBuilder, knex: Knex): XCreateTableBuilder {
  const extended = table as XCreateTableBuilder;

  extended.id = () => {
    table.bigIncrements("id").primary();
  };

  extended.xaocsTimestamps = () => {
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
  };

  extended.xaocsSoftDeletes = () => {
    table.timestamp("deleted_at").nullable();
  };

  return extended;
}
