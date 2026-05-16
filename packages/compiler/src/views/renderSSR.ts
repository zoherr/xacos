import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

export interface SSRResult {
  html: string;
  meta: { title?: string; description?: string };
}

/**
 * Server-render a page component to an HTML string.
 * The page module must export `default` (the component) and optionally `meta`.
 */
export async function renderSSR(
  pagePath: string,
  props: Record<string, unknown> = {}
): Promise<SSRResult> {
  const mod = await import(pagePath);

  // Only render if page opts into SSR
  if (mod.ssr !== true) {
    throw new Error(`[XAOCS] Page at ${pagePath} does not export ssr = true`);
  }

  const Component = mod.default;
  if (typeof Component !== 'function') {
    throw new Error(`[XAOCS] Page at ${pagePath} does not have a default export component`);
  }

  const html = renderToString(createElement(Component, props));
  const meta = mod.meta ?? {};

  return { html, meta };
}

