export * from './Cache';
export * from './CacheManager';
export * from './drivers/MemoryCache';
export * from './drivers/RedisCache';
export * from './middleware/ResponseCache';

import { CacheManager } from './CacheManager';
export const cache = new CacheManager();



