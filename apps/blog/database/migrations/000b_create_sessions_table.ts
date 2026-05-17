import { Migration, Schema } from '@xacos/orm';

export default class CreateSessionsTable extends Migration {
  async up(schema: Schema): Promise<void> {
    await schema.createTable('sessions', (table) => {
      table.bigIncrements('id');
      table.bigInteger('user_id').unsigned().notNullable();
      table.foreign('user_id').references('id').inTable('users').onDelete('cascade');

      table.string('token', 512).notNullable().unique();
      table.string('ip_address', 45).nullable();
      table.text('user_agent').nullable();
      table.timestamp('last_activity').notNullable();
      table.timestamps(true, true);
    });
  }

  async down(schema: Schema): Promise<void> {
    await schema.dropTable('sessions');
  }
}
