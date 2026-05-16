import React, { useState, type FormEvent } from 'react';
import { redirect } from '@xacos/client';
import { useAuth } from '@xacos/client';

export const meta = { title: 'Register' };
export const layout = 'main';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register({ name, email, password });
      redirect('/dashboard');
    } catch (err: unknown) {
      const msg = typeof err === 'object' && err !== null && 'response' in err
        ? ((err as any).response?.error as string | undefined)
        : undefined;
      setError(msg ?? 'Registration failed — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 16px' }}>
      <h1>Create Account</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required
            style={{ display: 'block', width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            style={{ display: 'block', width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
            style={{ display: 'block', width: '100%', marginBottom: 16 }} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Register'}
        </button>
      </form>
    </div>
  );
}

