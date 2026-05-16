import type { Cache } from '../Cache';

interface CacheEntry<T> {
  value: T;
  expiresAt: number | null;
}

export class MemoryCache implements Cache {
  private store = new Map<string, CacheEntry<any>>();

  async get<T = unknown>(key: string): Promise<T | null> {
    const entry = this.store.get(key);

    if (!entry) return null;

    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const expiresAt = ttl ? Date.now() + (ttl * 1000) : null;
    this.store.set(key, { value, expiresAt });
  }

  async forget(key: string): Promise<void> {
    this.store.delete(key);
  }

  async flush(): Promise<void> {
    this.store.clear();
  }

  async has(key: string): Promise<boolean> {
    const entry = this.store.get(key);
    if (!entry) return false;

    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return false;
    }

    return true;
  }

  async remember<T>(key: string, ttl: number, factory: () => Promise<T>): Promise<T> {
    const value = await this.get<T>(key);
    if (value !== null) return value;

    const newValue = await factory();
    await this.set(key, newValue, ttl);
    return newValue;
  }
}

