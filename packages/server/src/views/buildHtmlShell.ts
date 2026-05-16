export interface HtmlShellOptions {
  chunkUrl: string;     // e.g. /__xacos/index.js
  ssrHtml?: string;     // pre-rendered HTML (SSR only)
  meta?: {
    title?: string | undefined;
    description?: string | undefined;
  };
}

/**
 * Generate a complete HTML shell for a page.
 * Wires the page-specific JS chunk into the <script> tag.
 */
export function buildHtmlShell(options: HtmlShellOptions): string {
  const { chunkUrl, ssrHtml = '', meta = {} } = options;

  const headTags = [
    `<title>${meta.title ?? 'XAOCS App'}</title>`,
    meta.description ? `<meta name="description" content="${meta.description}" />` : '',
    `<script type="module" src="${chunkUrl}"></script>`,
  ].filter(Boolean).join('\n    ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${headTags}
</head>
<body>
  <div id="root">${ssrHtml}</div>
</body>
</html>`;
}

