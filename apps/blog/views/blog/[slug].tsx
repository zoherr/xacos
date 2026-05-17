import React, { useState, useEffect } from 'react';
import { useXacos, useAuth } from '@xacos/client';
import { Spinner } from '@xacos/ui';

export const ssr = true;

interface PostPageProps {
  params: { slug: string };
}

export default function PostPage({ params }: PostPageProps) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const slug = params.slug;

  useEffect(() => {
    fetch(`/api/post/${slug}`)
      .then(r => r.json())
      .then(d => { setPost(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!post) return <div className="text-center py-20 text-xacos-muted">Post not found.</div>;

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-xacos-muted text-sm mb-8">
        By {post.author?.name} · {new Date(post.created_at).toLocaleDateString()} · {post.views} views
      </div>
      {post.cover_image && (
        <img src={post.cover_image} alt={post.title} className="w-full rounded-lg mb-8" />
      )}
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />
    </article>
  );
}
