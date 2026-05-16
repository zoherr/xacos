type Factory<T> = () => T;

export class XContainer {
  private readonly bindings = new Map<string, Factory<unknown>>();
  private readonly singletonCache = new Map<string, unknown>();

  bind<T>(key: string, factory: Factory<T>): void {
    this.bindings.set(key, factory as Factory<unknown>);
  }

  singleton<T>(key: string, factory: Factory<T>): void {
    this.bindings.set(key, () => {
      if (!this.singletonCache.has(key)) {
        this.singletonCache.set(key, factory());
      }
      return this.singletonCache.get(key) as T;
    });
  }

  make<T>(key: string): T {
    const factory = this.bindings.get(key);
    if (!factory) {
      throw new Error(`[XAOCS Container] No binding registered for: "${key}"`);
    }
    return factory() as T;
  }

  has(key: string): boolean {
    return this.bindings.has(key);
  }

  flush(): void {
    this.bindings.clear();
    this.singletonCache.clear();
  }
}

export const app = new XContainer();

