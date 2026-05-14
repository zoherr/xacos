import { resolve, join } from 'path';
import { existsSync } from 'fs';

/**
 * Given a page's exported `layout` value and the views directory,
 * return the absolute path to the layout file, or null if no layout.
 */
export function resolveLayout(
  layoutExport: string | false | undefined,
  viewsDir: string,
  defaultLayout = 'main'
): string | null {
  // Explicit opt-out
  if (layoutExport === false) return null;

  const layoutName = typeof layoutExport === 'string' ? layoutExport : defaultLayout;
  const candidates = [
    join(viewsDir, 'layouts', `${layoutName}.tsx`),
    join(viewsDir, 'layouts', `${layoutName}.jsx`),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return resolve(candidate);
  }

  // No layout file found — log warning but don't throw
  if (layoutExport !== undefined) {
    console.warn(`[XAOCS] Layout "${layoutName}" not found in ${viewsDir}/layouts/`);
  }
  return null;
}
