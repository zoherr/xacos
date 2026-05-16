import type { XMiddleware } from "@xacos/shared";

class GlobalMiddlewareRegistry {
  private readonly middlewares: XMiddleware[] = [];

  register(middleware: XMiddleware): void {
    this.middlewares.push(middleware);
  }

  registerMany(middlewares: readonly XMiddleware[]): void {
    this.middlewares.push(...middlewares);
  }

  getAll(): XMiddleware[] {
    return [...this.middlewares];
  }
}

export const globalMiddlewareRegistry = new GlobalMiddlewareRegistry();

