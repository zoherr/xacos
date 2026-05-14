import { describe, expect, it } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { middlewareRegistry } from "../middleware/MiddlewareRegistry";
import { Application } from "./Application";

describe("Application boot", () => {
  it("boots providers and discovers services", async () => {
    const app = new Application();

    const servicesDir = mkdtempSync(join(tmpdir(), "xaocs-services-"));
    const serviceFile = join(servicesDir, "PingService.js");

    writeFileSync(
      serviceFile,
      [
        "export class PingService {",
        "  ping() { return 'pong'; }",
        "}",
      ].join("\n"),
      "utf8",
    );

    try {
      await app.boot({ servicesDir });
      const ping = app.container.make<{ ping: () => string }>("PingService");
      expect(ping.ping()).toBe("pong");
    } finally {
      rmSync(servicesDir, { recursive: true, force: true });
    }
  });

  it("discovers middlewares into the registry", async () => {
    const app = new Application();
    const middlewaresDir = mkdtempSync(join(tmpdir(), "xaocs-mw-"));
    const mwFile = join(middlewaresDir, "auth.middleware.js");

    writeFileSync(
      mwFile,
      [
        "export async function authenticate(req, res, next) {",
        "  await next();",
        "}",
      ].join("\n"),
      "utf8",
    );

    try {
      await app.boot({ middlewaresDir });
      expect(middlewareRegistry.has("authenticate")).toBe(true);
    } finally {
      rmSync(middlewaresDir, { recursive: true, force: true });
    }
  });
});
