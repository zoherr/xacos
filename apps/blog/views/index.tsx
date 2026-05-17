import React, { useState, useEffect } from 'react';
import { XLink, useEvent } from '@xacos/client';
import { Card, Badge, Spinner } from '@xacos/ui';

export const meta = { title: 'XAOCS Blog — Built with XAOCS Framework' };

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  views: number;
  created_at: string;
  author: { name: string };
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [metaData, setMetaData] = useState({ total: 0, lastPage: 1 });

  async function loadPosts(p = 1) {
    setLoading(true);
    const res = await fetch(`/api/post?page=${p}&perPage=10`);
    const data = await res.json() as { data: Post[]; meta: typeof metaData };
    setPosts(data.data);
    setMetaData(data.meta);
    setLoading(false);
  }

  useEffect(() => { void loadPosts(page); }, [page]);

  // Real-time: new posts appear instantly
  useEvent<Post>('post.published', (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  });

  if (loading) return (
    <div className="flex justify-center py-20">
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">XAOCS Blog</h1>
      <p className="text-xacos-muted mb-10">
        A demo blog built entirely with the XAOCS framework.
      </p>

      <div className="flex flex-col gap-6">
        {posts.map(post => (
          <Card key={post.id} className="hover:border-primary-500 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div>
                <XLink href={`/blog/${post.slug}`} className="text-xl font-semibold hover:text-primary-400 transition-colors">
                  {post.title}
                </XLink>
                {post.excerpt && (
                  <p className="text-xacos-muted mt-2 text-sm">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-3 mt-3 text-xs text-xacos-muted">
                  <span>By {post.author?.name}</span>
                  <span>·</span>
                  <span>{post.views} views</span>
                  <span>·</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <Badge variant="success">Published</Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-10">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded bg-xacos-surface border border-xacos-border disabled:opacity-40"
        >
          ← Previous
        </button>
        <span className="px-4 py-2 text-xacos-muted">
          {page} / {metaData.lastPage}
        </span>
        <button
          onClick={() => setPage(p => Math.min(metaData.lastPage, p + 1))}
          disabled={page === metaData.lastPage}
          className="px-4 py-2 rounded bg-xacos-surface border border-xacos-border disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
