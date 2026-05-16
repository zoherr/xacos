import { Migration, Schema } from '@xacos/orm';

export default class CreateUsersTable extends Migration {
  async up(schema: Schema): Promise<void> {
    await schema.createTable('users', (table) => {
      table.bigIncrements('id');
      table.string('name', 255).notNullable();
      table.string('email', 255).notNullable().unique();
      table.string('password', 255).notNullable();
      table.enum('role', ['user', 'admin']).defaultTo('user');
      table.boolean('email_verified').defaultTo(false);
      table.timestamp('email_verified_at').nullable();
      table.timestamps(true, true); // created_at, updated_at with defaults
    });
  }

  async down(schema: Schema): Promise<void> {
    await schema.dropTable('users');
  }
}

