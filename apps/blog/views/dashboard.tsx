import React from 'react';
import { useAuth, redirect, XLink } from '@xacos/client';
import { Spinner, Card, Button, Badge } from '@xacos/ui';

export const meta = { title: 'Dashboard — XAOCS Blog' };

export default function Dashboard() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!user) { redirect('/auth/login'); return null; }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-xacos-muted mt-1">Welcome back, {user.name}</p>
        </div>
        <div className="flex gap-3">
          <XLink href="/write">
            <Button>New Post</Button>
          </XLink>
          <Button variant="secondary" onClick={() => void logout()}>Logout</Button>
        </div>
      </div>
      <Card title="Your Posts" description="Manage your blog posts">
        <p className="text-xacos-muted text-sm">Post list coming in Part 4…</p>
      </Card>
    </div>
  );
}
