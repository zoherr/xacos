import { describe, expect, it } from "bun:test";
import { defineConfig } from "./defineConfig";

describe("defineConfig", () => {
  it("returns exact config object", () => {
    const cfg = defineConfig({
      app: { name: "XAOCS", env: "test", port: 3000 },
      providers: [],
    });

    expect(cfg.app?.name).toBe("XAOCS");
    expect(cfg.app?.port).toBe(3000);
  });
});
