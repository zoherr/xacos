import Redis from 'ioredis';
import type { Cache } from '../Cache';

export interface RedisConfig {
  host?: string | undefined;
  port?: number | undefined;
  password?: string | undefined;
  db?: number | undefined;
  prefix?: string | undefined;
}


export class RedisCache implements Cache {
  private client: Redis;
  private prefix: string;

  constructor(config: RedisConfig = {}) {
    this.prefix = config.prefix ?? 'xacos:cache:';
    this.client = new Redis({
      host: config.host ?? 'localhost',
      port: config.port ?? 6379,
      password: config.password,
      db: config.db ?? 0,
    });
  }

  private key(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const data = await this.client.get(this.key(key));
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as any as T;
    }
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    const k = this.key(key);

    if (ttl) {
      await this.client.set(k, data, 'EX', ttl);
    } else {
      await this.client.set(k, data);
    }
  }

  async forget(key: string): Promise<void> {
    await this.client.del(this.key(key));
  }

  async flush(): Promise<void> {
    // Caution: this uses DEL on keys with prefix
    const keys = await this.client.keys(`${this.prefix}*`);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  async has(key: string): Promise<boolean> {
    const exists = await this.client.exists(this.key(key));
    return exists === 1;
  }

  async remember<T>(key: string, ttl: number, factory: () => Promise<T>): Promise<T> {
    const value = await this.get<T>(key);
    if (value !== null) return value;

    const newValue = await factory();
    await this.set(key, newValue, ttl);
    return newValue;
  }
}

