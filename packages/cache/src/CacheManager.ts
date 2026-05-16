import type { XacosConfig } from '@xacos/config';
import type { Cache } from './Cache';
import { MemoryCache } from './drivers/MemoryCache';
import { RedisCache } from './drivers/RedisCache';


export class CacheManager {
  private drivers = new Map<string, Cache>();

  constructor(private config: XacosConfig['cache'] = {}) {}

  /**
   * Get a cache driver instance.
   */
  driver(name?: string): Cache {
    const driverName = name ?? this.config?.driver ?? 'memory';

    if (this.drivers.has(driverName)) {
      return this.drivers.get(driverName)!;
    }

    const instance = this.createDriver(driverName);
    this.drivers.set(driverName, instance);
    return instance;
  }

  private createDriver(name: string): Cache {
    switch (name) {
      case 'memory':
        return new MemoryCache();
      case 'redis':
        return new RedisCache({
          host: process.env['REDIS_HOST'] ?? 'localhost',
          port: Number(process.env['REDIS_PORT'] ?? 6379),
          password: process.env['REDIS_PASSWORD'],
          db: Number(process.env['REDIS_DB'] ?? 0),
          prefix: this.config?.prefix,
        });

      default:
        throw new Error(`[XAOCS Cache] Unknown driver: ${name}`);
    }
  }

  // Proxy methods for default driver
  async get<T = unknown>(key: string): Promise<T | null> {
    return this.driver().get<T>(key);
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    return this.driver().set(key, value, ttl);
  }

  async forget(key: string): Promise<void> {
    return this.driver().forget(key);
  }

  async flush(): Promise<void> {
    return this.driver().flush();
  }

  async has(key: string): Promise<boolean> {
    return this.driver().has(key);
  }

  async remember<T>(key: string, ttl: number, factory: () => Promise<T>): Promise<T> {
    return this.driver().remember(key, ttl, factory);
  }
}

