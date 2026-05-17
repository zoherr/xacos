import { Post } from '../../database/models/Post';
import { paginate } from '@xacos/orm';
import { cache } from '@xacos/cache';

export class PostService {
  async getPublished(page = 1, perPage = 10) {
    return cache.remember(`posts:published:${page}:${perPage}`, 60, () =>
      paginate(Post.where('status', 'published'), page, perPage)
    );
  }

  async getBySlug(slug: string) {
    return cache.remember(`post:slug:${slug}`, 300, () =>
      Post.where('slug', slug).where('status', 'published').first()
    );
  }

  async create(authorId: number, data: { title: string; body: string; excerpt?: string }) {
    const post = await Post.create({
      author_id: authorId,
      title: data.title,
      slug: Post.generateSlug(data.title),
      body: data.body,
      excerpt: data.excerpt ?? null,
      status: 'draft',
      views: 0,
      cover_image: null,
    } as any);

    await cache.forget('posts:published:1:10');
    return post;
  }

  async publish(id: number, authorId: number) {
    const post = await Post.find(id) as any;
    if (!post || post.author_id !== authorId) {
      throw Object.assign(new Error('Not found or forbidden'), { statusCode: 403 });
    }
    await Post.update(id, { status: 'published' });
    await cache.forget(`post:slug:${post.slug}`);
    return Post.find(id);
  }

  async incrementViews(id: number) {
    await Post.update(id, { views: Post.raw('views + 1') as any });
  }
}
