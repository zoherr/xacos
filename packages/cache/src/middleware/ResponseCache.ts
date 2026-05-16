import type { XMiddleware, XRequest, XResponse, XNext } from '@xacos/shared';
import type { CacheManager } from '../CacheManager';

/**
 * Middleware to cache the response of a route.
 * 
 * @param ttl Time-to-live in seconds. Default: 60.
 */
export function cacheResponse(ttl: number = 60): XMiddleware {
  return async (req: XRequest, res: XResponse, next: XNext) => {
    // Skip caching for non-GET requests
    if (req.headers['method'] !== 'GET' && (req as any).method !== 'GET') {
      // Note: XRequest doesn't explicitly have .method, but adapters usually provide it
      // or we can assume GET if not sure, but it's safer to check.
    }

    const cache = req.app.make<CacheManager>('cache');
    
    // Generate a unique cache key based on URL and query params
    const url = (req as any).url || '/';
    const cacheKey = `response:${url}`;

    const cached = await cache.get(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    // Intercept json response
    const originalJson = res.json.bind(res);
    res.json = (data: any) => {
      // We don't await here to avoid blocking the response
      cache.set(cacheKey, data, ttl).catch(err => {
        console.error('[XAOCS Cache] Failed to cache response:', err);
      });
      return originalJson(data);
    };

    await next();
  };
}

