import { describe, expect, it } from "bun:test";
import { validate, v, ValidationError } from "./index";

describe("validate", () => {
  const schema = v.object({
    name: v.string().min(2),
    email: v.string().email(),
  });

  it("returns typed data on success", () => {
    const data = validate({ name: "John", email: "john@example.com" }, schema);
    expect(data.name).toBe("John");
  });

  it("throws ValidationError on invalid data", () => {
    expect(() => validate({ name: "J", email: "not-an-email" }, schema)).toThrow(
      ValidationError,
    );
  });

  it("formats field errors correctly", () => {
    try {
      validate({ name: "J", email: "bad" }, schema);
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
      const ve = e as ValidationError;
      expect(ve.errors.some((err) => err.field === "name")).toBe(true);
      expect(ve.errors.some((err) => err.field === "email")).toBe(true);
      expect(ve.statusCode).toBe(422);
    }
  });
});

