// XAOCS Compiler Package Entry Point
// This will eventually export Vite/esbuild/Scanner utilities.

export { createViteConfig } from './vite/createViteConfig';
export { ViewScanner, type ViewRoute } from './scanner/ViewScanner';
export { resolveLayout } from './views/resolveLayout';
export { extractPageMeta, type PageMeta } from './views/extractPageMeta';
export { renderSSR, type SSRResult } from './views/renderSSR';
export { scanViews } from './views/scanViews';
export { buildProduction, type BuildResult } from './esbuild/buildProduction';







