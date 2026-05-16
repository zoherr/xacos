import type { Knex } from "knex";

/** Augmented table builder: use `xacosTimestamps()` / `xacosSoftDeletes()` to avoid clashing with Knex's `timestamps()`. */
export type XCreateTableBuilder = Knex.CreateTableBuilder & {
  id(): void;
  xacosTimestamps(): void;
  xacosSoftDeletes(): void;
};

export function augmentTable(table: Knex.CreateTableBuilder, knex: Knex): XCreateTableBuilder {
  const extended = table as XCreateTableBuilder;

  extended.id = () => {
    table.bigIncrements("id").primary();
  };

  extended.xacosTimestamps = () => {
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
  };

  extended.xacosSoftDeletes = () => {
    table.timestamp("deleted_at").nullable();
  };

  return extended;
}

