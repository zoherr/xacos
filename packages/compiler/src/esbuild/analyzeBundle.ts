import * as esbuild from 'esbuild';
import { buildProduction } from './buildProduction';

export interface BundleReport {
  pages: Array<{
    page: string;
    sizeKb: number;
    gzipKb: number;
    imports: string[];
  }>;
  totalKb: number;
  sharedChunks: number;
  largestPage: string;
}

export async function analyzeBundle(
  viewsDir: string,
  outDir: string,
  root: string
): Promise<BundleReport> {
  const result = await buildProduction(viewsDir, outDir, root);
  const { metafile } = result;

  const pages: BundleReport['pages'] = [];
  let totalBytes = 0;

  for (const [outputPath, output] of Object.entries(metafile.outputs)) {
    if (!outputPath.endsWith('.js') || outputPath.includes('chunk-')) continue;

    const pageName = outputPath.split('/').pop()!.replace('.js', '');
    const sizeKb = output.bytes / 1024;
    totalBytes += output.bytes;

    // Estimate gzip size (roughly 30% of raw)
    const gzipKb = sizeKb * 0.3;

    const imports = Object.keys(output.imports ?? {}).map(i =>
      i.split('/').pop() ?? i
    );

    pages.push({ page: pageName, sizeKb, gzipKb, imports });
  }

  pages.sort((a, b) => b.sizeKb - a.sizeKb);

  return {
    pages,
    totalKb: totalBytes / 1024,
    sharedChunks: Object.keys(metafile.outputs).filter(k => k.includes('chunk-')).length,
    largestPage: pages[0]?.page ?? 'none',
  };
}

export function formatBundleReport(report: BundleReport): string {
  const lines = [
    '# XAOCS Bundle Analysis',
    '',
    `Total size: ${report.totalKb.toFixed(1)} KB`,
    `Shared chunks: ${report.sharedChunks}`,
    `Largest page: ${report.largestPage}`,
    '',
    '## Per-Page Sizes',
    '',
    '| Page | Size | Gzip |',
    '|------|------|------|',
    ...report.pages.map(p =>
      `| ${p.page} | ${p.sizeKb.toFixed(1)} KB | ~${p.gzipKb.toFixed(1)} KB |`
    ),
  ];
  return lines.join('\n');
}
