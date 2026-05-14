export interface PageMeta {
  title?: string;
  description?: string;
}

/**
 * Extract static meta from a page module.
 * Works for statically-analyzable exports only (no dynamic values at build time).
 * At runtime, the server imports the page module and reads `mod.meta`.
 */
export function extractPageMeta(mod: Record<string, unknown>): PageMeta {
  const meta = mod['meta'];
  if (!meta || typeof meta !== 'object') return {};
  const m = meta as Record<string, unknown>;
  const result: PageMeta = {};
  if (typeof m['title'] === 'string') result.title = m['title'];
  if (typeof m['description'] === 'string') result.description = m['description'];
  return result;

}
