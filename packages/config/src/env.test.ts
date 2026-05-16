import { describe, expect, it } from "bun:test";
import { requireEnv } from "./env";

describe("requireEnv", () => {
  it("returns existing env var", () => {
    process.env["XAOCS_TEST_ENV"] = "ok";
    expect(requireEnv("XAOCS_TEST_ENV")).toBe("ok");
  });

  it("throws for missing env var", () => {
    delete process.env["XAOCS_MISSING_ENV"];
    expect(() => requireEnv("XAOCS_MISSING_ENV")).toThrow();
  });
});

