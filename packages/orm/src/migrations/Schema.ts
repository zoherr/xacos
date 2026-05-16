import { getKnex } from "../connection/db";
import { augmentTable, type XCreateTableBuilder } from "./columnHelpers";

export class Schema {
  async createTable(name: string, callback: (table: XCreateTableBuilder) => void): Promise<void> {
    const knex = getKnex();
    await knex.schema.createTable(name, (table) => {
      callback(augmentTable(table, knex));
    });
  }

  async dropTable(name: string): Promise<void> {
    await getKnex().schema.dropTableIfExists(name);
  }

  async hasTable(name: string): Promise<boolean> {
    return getKnex().schema.hasTable(name);
  }
}

