import type { XMiddleware, XRequest, XResponse, XNext } from '@xacos/shared';
import { authService } from '../services/AuthService';
import { User } from '../models/User';

/**
 * Protects routes requiring authentication.
 * Reads JWT from 'xacos_token' cookie.
 * Attaches the authenticated user to `req.user`.
 */
export const authenticate: XMiddleware = async (
  req: XRequest,
  res: XResponse,
  next: XNext
): Promise<void> => {
  const token = req.cookies['xacos_token'];

  if (!token) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return;
  }

  try {
    const payload = authService.verifyToken(token);
    const row = (await User.find(payload.userId)) as Record<string, unknown> | null;

    if (!row) {
      res.status(401).json({ success: false, error: 'User not found' });
      return;
    }

    const user = {
      id: Number(row.id),
      name: String(row.name ?? ''),
      email: String(row.email ?? ''),
      role: String(row.role ?? 'user'),
    };

    req.user = user;

    // Cookie refresh on near-expiry (e.g. < 24 hours remaining)
    if (payload.exp && (payload.exp - Date.now() / 1000) < 24 * 60 * 60) {
      const refreshedToken = authService.generateToken(Object.assign(new User(), row) as User);
      res.setCookie('xacos_token', refreshedToken, {
        httpOnly: true,
        secure: process.env['APP_ENV'] === 'production',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        sameSite: process.env['APP_ENV'] === 'production' ? 'strict' : 'lax',
      });
    }

    await next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

/**
 * Require admin role.
 */
export const authorizeAdmin: XMiddleware = async (
  req: XRequest,
  res: XResponse,
  next: XNext
): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, error: 'Forbidden' });
    return;
  }
  await next();
};

