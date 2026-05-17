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

  it("throws for JWT_SECRET shorter than 32 chars", () => {
    process.env["JWT_SECRET"] = "short";
    expect(() => requireEnv("JWT_SECRET")).toThrow(
      "[XAOCS Config] JWT_SECRET must be at least 32 characters long. Current length: 5. Generate one with: openssl rand -base64 32"
    );
  });

  it("accepts JWT_SECRET with 32 or more chars", () => {
    process.env["JWT_SECRET"] = "12345678901234567890123456789012";
    expect(requireEnv("JWT_SECRET")).toBe("12345678901234567890123456789012");
  });
});

