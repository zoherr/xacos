import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { buildProduction } from './buildProduction';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { resolve } from 'path';

const TMP_VIEWS = resolve('./tmp-esbuild-views');
const TMP_OUT = resolve('./tmp-esbuild-out');

describe('buildProduction', () => {
  beforeEach(() => {
    mkdirSync(TMP_VIEWS, { recursive: true });
    writeFileSync(`${TMP_VIEWS}/index.tsx`, `export default function Home() { return null; }`);
    writeFileSync(`${TMP_VIEWS}/about.tsx`, `export default function About() { return null; }`);
  });

  afterEach(() => {
    rmSync(TMP_VIEWS, { recursive: true, force: true });
    rmSync(TMP_OUT, { recursive: true, force: true });
  });

  it('generates JS bundles for each view', async () => {
    const result = await buildProduction(TMP_VIEWS, TMP_OUT, process.cwd());
    
    expect(result.outputFiles.length).toBeGreaterThanOrEqual(2);
    expect(existsSync(`${TMP_OUT}/index.js`)).toBe(true);
    expect(existsSync(`${TMP_OUT}/about.js`)).toBe(true);
    expect(result.metafile).toBeDefined();
  }, 50000);

  it('handles dynamic routes in chunk naming', async () => {
    mkdirSync(`${TMP_VIEWS}/blog`, { recursive: true });
    writeFileSync(`${TMP_VIEWS}/blog/[id].tsx`, `export default function Post() { return null; }`);
    
    await buildProduction(TMP_VIEWS, TMP_OUT, process.cwd());
    
    expect(existsSync(`${TMP_OUT}/blog_id.js`)).toBe(true);
  }, 50000);
});

