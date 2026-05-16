import { z } from "zod";

/**
 * XAOCS validation helper — Zod under a concise alias (`v`).
 *
 * @example
 * import { v } from '@xacos/validation';
 *
 * const schema = v.object({
 *   name: v.string().min(2),
 *   email: v.string().email(),
 * });
 */
export const v = z;
export type { ZodType } from "zod";

