import { describe, it, expect } from "bun:test";
import { MemoryCache } from "./drivers/MemoryCache";
import { CacheManager } from "./CacheManager";

describe("MemoryCache", () => {
  it("stores and retrieves values", async () => {
    const cache = new MemoryCache();
    await cache.set("foo", "bar");
    expect(await cache.get<string>("foo")).toBe("bar");
  });

  it("handles TTL expiration", async () => {
    const cache = new MemoryCache();
    await cache.set("foo", "bar", 0.1); // 100ms
    expect(await cache.get<string>("foo")).toBe("bar");


    await new Promise(r => setTimeout(r, 150));
    expect(await cache.get("foo")).toBe(null);
  });

  it("handles remember helper", async () => {
    const cache = new MemoryCache();
    let calls = 0;
    const factory = async () => {
      calls++;
      return "fresh";
    };

    const val1 = await cache.remember("key", 60, factory);
    const val2 = await cache.remember("key", 60, factory);

    expect(val1).toBe("fresh");
    expect(val2).toBe("fresh");
    expect(calls).toBe(1);
  });
});

describe("CacheManager", () => {
  it("resolves default memory driver", () => {
    const manager = new CacheManager();
    const driver = manager.driver();
    expect(driver).toBeInstanceOf(MemoryCache);
  });
});

import { cacheResponse } from "./middleware/ResponseCache";

describe("cacheResponse Middleware", () => {
  it("caches and returns cached response", async () => {
    const mockCache = new MemoryCache();
    const mockApp = {
      make: (key: string) => key === 'cache' ? mockCache : null
    };

    const req: any = { app: mockApp, url: "/test", headers: { method: 'GET' } };
    const res: any = { 
      json: function(data: any) { 
        this.data = data;
        return this;
      } 
    };
    const next = async () => {
      res.json({ foo: "bar" });
    };

    const middleware = cacheResponse(60);
    
    // First call - should populate cache
    await middleware(req, res, next);
    
    expect(await mockCache.get<any>("response:/test")).toEqual({ foo: "bar" });

    // Second call - should return cached value
    res.data = null;
    await middleware(req, res, async () => {
      throw new Error("Next should not be called");
    });
    
    expect(res.data as any).toEqual({ foo: "bar" });
  });
});



