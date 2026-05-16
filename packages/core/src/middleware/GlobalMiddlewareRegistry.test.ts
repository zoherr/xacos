import { describe, expect, it } from "bun:test";
import { globalMiddlewareRegistry } from "./GlobalMiddlewareRegistry";

describe("globalMiddlewareRegistry", () => {
  it("registers global middleware entries", () => {
    const start = globalMiddlewareRegistry.getAll().length;

    globalMiddlewareRegistry.register(async (_req, _res, next) => {
      await next();
    });

    expect(globalMiddlewareRegistry.getAll().length).toBe(start + 1);
  });
});

