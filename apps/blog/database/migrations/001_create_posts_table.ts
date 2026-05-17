import { Migration, Schema } from '@xacos/orm';

export default class CreatePostsTable extends Migration {
  async up(schema: Schema): Promise<void> {
    await schema.createTable('posts', (table) => {
      table.bigIncrements('id');
      table.bigInteger('author_id').unsigned().notNullable();
      table.foreign('author_id').references('id').on('users').onDelete('cascade');
      table.string('title', 500).notNullable();
      table.string('slug', 500).notNullable().unique();
      table.text('excerpt').nullable();
      table.text('body').notNullable();
      table.enum('status', ['draft', 'published', 'archived']).defaultTo('draft');
      table.string('cover_image', 1000).nullable();
      table.integer('views').defaultTo(0);
      table.timestamps(true, true);
    });
  }

  async down(schema: Schema): Promise<void> {
    await schema.dropTable('posts');
  }
}
