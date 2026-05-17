import { Migration, Schema } from '@xacos/orm';

export default class CreateTagsTable extends Migration {
  async up(schema: Schema): Promise<void> {
    await schema.createTable('tags', (table) => {
      table.bigIncrements('id');
      table.string('name', 100).notNullable().unique();
      table.string('slug', 100).notNullable().unique();
      table.timestamps(true, true);
    });

    await schema.createTable('post_tags', (table) => {
      table.bigInteger('post_id').unsigned().notNullable();
      table.bigInteger('tag_id').unsigned().notNullable();
      table.foreign('post_id').references('id').on('posts').onDelete('cascade');
      table.foreign('tag_id').references('id').on('tags').onDelete('cascade');
      table.primary(['post_id', 'tag_id']);
    });
  }

  async down(schema: Schema): Promise<void> {
    await schema.dropTable('post_tags');
    await schema.dropTable('tags');
  }
}
