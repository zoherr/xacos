import * as esbuild from 'esbuild';
import { scanViews } from '../views/scanViews';
import { resolve, join } from 'path';
import { mkdirSync } from 'fs';

export interface BuildResult {
  outputFiles: string[];
  metafile: esbuild.Metafile;
}

/**
 * Generates one JS chunk per page into the specified outDir.
 */
export async function buildProduction(
  viewsDir: string,
  outDir: string,
  root: string
): Promise<BuildResult> {
  const views = scanViews(viewsDir);
  const outPath = resolve(outDir);
  mkdirSync(outPath, { recursive: true });

  // Build entry points map: chunk name → file path
  const entryPoints: Record<string, string> = {};
  for (const view of views) {
    // Derive chunk name from URL: /blog/:id → blog_id
    const chunkName = view.urlPattern
      .replace(/^\//, '')
      .replace(/\//g, '_')
      .replace(/:/g, '')
      .replace(/[^a-zA-Z0-9_]/g, '') || 'index';
    entryPoints[chunkName] = view.filePath;
  }

  const result = await esbuild.build({
    entryPoints,
    bundle: true,
    splitting: true,     // shared chunks via code splitting
    format: 'esm',
    outdir: outPath,
    metafile: true,
    minify: true,
    sourcemap: false,
    jsx: 'automatic',
    jsxImportSource: 'react',
    define: {
      'process.env.NODE_ENV': '"production"',
    },
    external: [],        // bundle everything including React
    alias: {
      '@views': resolve(viewsDir),
      '@app': resolve(root, 'app'),
      '@api': resolve(root, 'api'),
      '@db': resolve(root, 'database'),
    },
  });

  return {
    outputFiles: Object.keys(entryPoints).map(name => join(outPath, `${name}.js`)),
    metafile: result.metafile!,
  };
}
