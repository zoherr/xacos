import type { XUser } from '@xacos/shared';
import jwt from 'jsonwebtoken';

/**
 * Generate a real JWT for a fake user — for use in test HTTP requests.
 *
 * @example
 * const token = mockAuth({ id: 1, name: 'Test', email: 'test@test.com', role: 'user' });
 * const res = await client.get('/api/me', {
 *   headers: { Authorization: `Bearer ${token}` }
 * });
 */
export function mockAuth(user: Partial<XUser> & { id: number }): string {
  const secret = process.env['JWT_SECRET'] ?? 'test-secret-key';
  return jwt.sign({ userId: user.id, role: user.role ?? 'user' }, secret, {
    expiresIn: '1h',
  });
}

