import { describe, expect, it } from "bun:test";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { XServer } from "./XServer";

describe("XServer", () => {
  it("registers global middleware", () => {
    const server = new XServer();

    server.useGlobal(async (_req, _res, next) => {
      await next();
    });

    expect(server.getGlobalMiddlewares().length).toBe(1);
  });

  it("mountApi registers scanned routes", async () => {
    const apiDir = join(fileURLToPath(new URL(".", import.meta.url)), "..", "test-fixtures", "api");
    const app = { make: <T>(_key: string) => ({}) as T };

    const server = new XServer();
    const port = 18_900 + Math.floor(Math.random() * 500);
    try {
      await server.mountApi(apiDir, app);
      await server.listen(port);
      const res = await fetch(`http://127.0.0.1:${String(port)}/api/echo/`);
      expect(res.ok).toBe(true);
      const body = (await res.json()) as { ok?: boolean };
      expect(body.ok).toBe(true);
    } finally {
      await server.close();
    }
  });

  it("returns 422 JSON for route schema validation failures", async () => {
    const apiDir = join(fileURLToPath(new URL(".", import.meta.url)), "..", "test-fixtures", "api");
    const app = { make: <T>(_key: string) => ({}) as T };

    const server = new XServer();
    const port = 19_050 + Math.floor(Math.random() * 500);
    try {
      await server.mountApi(apiDir, app);
      await server.listen(port);

      const bad = await fetch(`http://127.0.0.1:${String(port)}/api/validated/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "x" }),
      });
      expect(bad.status).toBe(422);
      const payload = (await bad.json()) as { errors?: { field: string; message: string }[] };
      expect(Array.isArray(payload.errors)).toBe(true);

      const good = await fetch(`http://127.0.0.1:${String(port)}/api/validated/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Ada" }),
      });
      expect(good.ok).toBe(true);
      const okBody = (await good.json()) as { name?: string };
      expect(okBody.name).toBe("Ada");
    } finally {
      await server.close();
    }
  });

  it("provides a health check endpoint", async () => {
    const server = new XServer();
    const port = 19_200 + Math.floor(Math.random() * 500);
    try {
      await server.listen(port);
      const res = await fetch(`http://127.0.0.1:${String(port)}/health`);
      expect(res.ok).toBe(true);
      const body = (await res.json()) as { status?: string; version?: string; env?: string };
      expect(body.status).toBe("ok");
      expect(body.version).toBeDefined();
      expect(body.env).toBeDefined();
    } finally {
      await server.close();
    }
  });
});

