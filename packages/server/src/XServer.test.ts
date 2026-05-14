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
});
