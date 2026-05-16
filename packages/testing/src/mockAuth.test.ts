import { describe, it, expect } from 'bun:test';
import { mockAuth } from './mockAuth';
import jwt from 'jsonwebtoken';

process.env['JWT_SECRET'] = 'test-secret';

describe('mockAuth', () => {
  it('generates a valid JWT for a test user', () => {
    const token = mockAuth({ id: 42, role: 'admin' });
    const decoded = jwt.verify(token, 'test-secret') as { userId: number; role: string };
    expect(decoded.userId).toBe(42);
    expect(decoded.role).toBe('admin');
  });
});

