import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { ViewScanner } from './ViewScanner';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { resolve, join } from 'path';

const TMP = resolve('./tmp-views-test');

describe('ViewScanner', () => {
  beforeEach(() => {
    mkdirSync(TMP, { recursive: true });
    mkdirSync(join(TMP, 'users'), { recursive: true });
    writeFileSync(join(TMP, 'index.tsx'), '');
    writeFileSync(join(TMP, 'about.jsx'), '');
    writeFileSync(join(TMP, 'users', 'index.tsx'), '');
    writeFileSync(join(TMP, 'users', '[id].tsx'), '');
  });

  afterEach(() => rmSync(TMP, { recursive: true, force: true }));

  it('maps file paths to routes correctly', () => {
    const scanner = new ViewScanner(TMP);
    const routes = scanner.scan();

    const paths = routes.map(r => r.path).sort();

    expect(paths).toEqual([
      '/',
      '/about',
      '/users',
      '/users/:id'
    ].sort());
  });
});
