import { describe, expect, it } from "bun:test";
import { defineConfig } from "./defineConfig";

describe("defineConfig", () => {
  it("returns config with defaults and overrides", () => {
    const cfg = defineConfig({
      port: 3000,
      api: { dir: './custom-api' }
    });

    expect(cfg.port).toBe(3000);
    expect(cfg.api?.dir).toBe('./custom-api');
    expect(cfg.views?.dir).toBe('./views'); // default
  });
});

