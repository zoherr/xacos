import type { XMiddleware } from "@xacos/shared";

class MiddlewareRegistry {
  private readonly map = new Map<string, XMiddleware>();

  register(name: string, fn: XMiddleware): void {
    this.map.set(name, fn);
  }

  get(name: string): XMiddleware {
    const fn = this.map.get(name);
    if (!fn) {
      throw new Error(`[XAOCS] Middleware not found: ${name}`);
    }
    return fn;
  }

  has(name: string): boolean {
    return this.map.has(name);
  }

  getAll(): XMiddleware[] {
    return Array.from(this.map.values());
  }
}

export const middlewareRegistry = new MiddlewareRegistry();

