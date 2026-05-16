/**
 * Unified cache interface. All drivers implement this.
 */
export interface Cache {
  /**
   * Get a value from cache. Returns null if not found or expired.
   */
  get<T = unknown>(key: string): Promise<T | null>;

  /**
   * Set a value in cache.
   * @param ttl Time-to-live in seconds. Omit for no expiration.
   */
  set(key: string, value: unknown, ttl?: number): Promise<void>;

  /**
   * Delete a key from cache.
   */
  forget(key: string): Promise<void>;

  /**
   * Flush the entire cache. Use with caution in production.
   */
  flush(): Promise<void>;

  /**
   * Check if a key exists and has not expired.
   */
  has(key: string): Promise<boolean>;

  /**
   * Get or set a value. If key doesn't exist, calls factory and stores result.
   *
   * @example
   * const user = await cache.remember('user:1', 60, () => User.find(1));
   */
  remember<T>(key: string, ttl: number, factory: () => Promise<T>): Promise<T>;
}

