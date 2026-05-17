import { describe, expect, it } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { scanApiFiles } from "./ApiScanner";

describe("scanApiFiles", () => {
  it("builds prefixes for api files including dynamic segments", () => {
    const dir = mkdtempSync(join(tmpdir(), "xacos-api-"));

    try {
      writeFileSync(join(dir, "user.api.ts"), "export {};", "utf8");
      writeFileSync(join(dir, "user.[id].api.ts"), "export {};", "utf8");

      const routes = scanApiFiles(dir);
      const prefixes = routes.map((r) => r.urlPrefix).sort();

      expect(prefixes).toEqual(["/api/user/", "/api/user/:id/"]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("builds prefixes for versioned api files", () => {
    const dir = mkdtempSync(join(tmpdir(), "xacos-api-versioned-"));

    try {
      writeFileSync(join(dir, "v1.user.api.ts"), "export {};", "utf8");
      writeFileSync(join(dir, "v2.auth.api.ts"), "export {};", "utf8");

      const routes = scanApiFiles(dir);
      const prefixes = routes.map((r) => r.urlPrefix).sort();

      expect(prefixes).toEqual(["/api/v1/user/", "/api/v2/auth/"]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

