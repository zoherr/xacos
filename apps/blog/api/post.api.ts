import { XRouter } from '@xacos/core';
import { authenticate } from '@xacos/auth';
import { v, validate } from '@xacos/validation';
import { PostService } from '../app/services/PostService';
import { paginated, ok, fail } from '@xacos/shared';
import { Post } from '../database/models/Post';

export const router = new XRouter();
const postService = new PostService();

// GET /api/post — public list
router.get('/', async (req, res) => {
  const { page = 1, perPage = 10 } = req.query;
  const result = await postService.getPublished(Number(page), Number(perPage));
  return res.json(paginated(result.data, result.total, result.page, result.perPage));
});

// GET /api/post/:slug — public single post
router.get('/:slug', async (req, res) => {
  const post = await postService.getBySlug(req.params.slug);
  if (!post) return res.status(404).json(fail('Post not found'));
  await postService.incrementViews((post as any).id);
  return res.json(ok(post));
});

// POST /api/post — create (auth required)
router.post('/', authenticate, async (req, res) => {
  const body = validate(req.body, v.object({
    title: v.string().min(3).max(500),
    body: v.string().min(10),
    excerpt: v.string().max(500).optional(),
  }));

  const post = await postService.create((req.user as any).id, body);
  return res.status(201).json(ok(post));
});

// PUT /api/post/:id/publish — publish (auth required)
router.put('/:id/publish', authenticate, async (req, res) => {
  const post = await postService.publish(Number(req.params.id), (req.user as any).id);
  return res.json(ok(post));
});

// DELETE /api/post/:id — delete (auth required)
router.delete('/:id', authenticate, async (req, res) => {
  const post = await Post.find(Number(req.params.id)) as any;
  if (!post || post.author_id !== (req.user as any).id) {
    return res.status(403).json(fail('Forbidden'));
  }
  await Post.destroy(Number(req.params.id));
  return res.status(204).send();
});
