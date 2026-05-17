import type { XMiddleware } from '@xacos/shared';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const windowMs = 60 * 1000; // 1 minute
const maxRequests = 5;
const hits = new Map<string, RateLimitEntry>();

export const authRateLimit: XMiddleware = async (req, res, next) => {
  const ip = req.ip ?? 'unknown';
  const now = Date.now();

  const entry = hits.get(ip) ?? { count: 0, resetTime: now + windowMs };

  // Clean up expired window
  if (now > entry.resetTime) {
    entry.count = 0;
    entry.resetTime = now + windowMs;
  }

  entry.count++;
  hits.set(ip, entry);

  res.setHeader('X-RateLimit-Limit', String(maxRequests));
  res.setHeader('X-RateLimit-Remaining', String(Math.max(0, maxRequests - entry.count)));
  res.setHeader('X-RateLimit-Reset', String(Math.floor(entry.resetTime / 1000)));

  if (entry.count > maxRequests) {
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts. Please try again later.',
    });
    return;
  }

  await next();
};
