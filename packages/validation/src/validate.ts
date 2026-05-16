import type { z } from "zod";
import { ValidationError } from "./ValidationError";
import type { FieldError } from "./types";

/**
 * Validate data against a Zod schema.
 * Returns typed data or throws {@link ValidationError}.
 */
export function validate<Schema extends z.ZodType>(data: unknown, schema: Schema): z.infer<Schema> {
  const result = schema.safeParse(data);

  if (result.success) return result.data;

  const errors: FieldError[] = result.error.issues.map((issue) => ({
    field: issue.path.map(String).join(".") || "(root)",
    message: issue.message,
  }));

  throw new ValidationError(errors);
}

