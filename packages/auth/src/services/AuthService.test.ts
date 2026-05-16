import { describe, it, expect } from 'bun:test';
import { AuthService } from './AuthService';

// Set required env for test
process.env['JWT_SECRET'] = 'test-secret-key-32chars-minimum!!';
process.env['JWT_EXPIRES_IN'] = '1h';

describe('AuthService.generateToken / verifyToken', () => {
  const service = new AuthService();

  it('generates a verifiable JWT', () => {
    const fakeUser = { id: 42, role: 'user' } as any;
    const token = service.generateToken(fakeUser);
    expect(typeof token).toBe('string');
    const payload = service.verifyToken(token);
    expect(payload.userId).toBe(42);
    expect(payload.role).toBe('user');
  });

  it('throws on invalid token', () => {
    expect(() => service.verifyToken('not-a-token')).toThrow();
  });
});

