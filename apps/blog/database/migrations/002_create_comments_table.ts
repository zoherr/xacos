import { Migration, Schema } from '@xacos/orm';

export default class CreateCommentsTable extends Migration {
  async up(schema: Schema): Promise<void> {
    await schema.createTable('comments', (table) => {
      table.bigIncrements('id');
      table.bigInteger('post_id').unsigned().notNullable();
      table.foreign('post_id').references('id').on('posts').onDelete('cascade');
      table.bigInteger('author_id').unsigned().notNullable();
      table.foreign('author_id').references('id').on('users').onDelete('cascade');
      table.text('body').notNullable();
      table.timestamps(true, true);
    });
  }

  async down(schema: Schema): Promise<void> {
    await schema.dropTable('comments');
  }
}
