import type { FieldError } from "./types";

export class ValidationError extends Error {
  readonly statusCode = 422;
  readonly errors: FieldError[];

  constructor(errors: FieldError[]) {
    super("Validation failed");
    this.name = "ValidationError";
    this.errors = errors;
  }
}

