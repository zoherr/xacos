import { Migration } from "../../src/migrations/Migration";
import type { Schema } from "../../src/migrations/Schema";

export default class TestMigration001 extends Migration {
  async up(schema: Schema): Promise<void> {
    await schema.createTable("migration_test", (table) => {
      table.id();
      table.string("label", 255);
      table.xacosTimestamps();
    });
  }

  async down(schema: Schema): Promise<void> {
    await schema.dropTable("migration_test");
  }
}

