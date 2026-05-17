import { Seeder, Factory } from '@xacos/orm';
import { Post } from '../models/Post';
import { getKnex } from '@xacos/orm';

export default class PostSeeder extends Seeder {
  async run(): Promise<void> {
    const users = await getKnex()('users').select('id');

    for (let i = 0; i < 25; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const title = Factory.faker.lorem.sentence();
      await Post.create({
        author_id: user.id,
        title,
        slug: Post.generateSlug(title) + '-' + i,
        excerpt: Factory.faker.lorem.sentences(2),
        body: Factory.faker.lorem.paragraphs(5, '\n\n'),
        status: 'published',
        views: Factory.faker.number.int({ min: 0, max: 10000 }),
        cover_image: null,
      } as any);
    }

    console.log('  ✓ Created 25 blog posts');
  }
}
