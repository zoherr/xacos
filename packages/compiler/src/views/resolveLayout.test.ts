import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { resolveLayout } from './resolveLayout';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { resolve } from 'path';

const TMP = resolve('./tmp-layout-test');

describe('resolveLayout', () => {
  beforeEach(() => {
    mkdirSync(`${TMP}/layouts`, { recursive: true });
    writeFileSync(`${TMP}/layouts/main.tsx`, '');
  });

  afterEach(() => rmSync(TMP, { recursive: true, force: true }));

  it('returns main layout path when no layout exported', () => {
    const path = resolveLayout(undefined, TMP);
    expect(path).toContain('main.tsx');
  });

  it('returns null when layout = false', () => {
    expect(resolveLayout(false, TMP)).toBeNull();
  });

  it('returns null when named layout does not exist', () => {
    expect(resolveLayout('nonexistent', TMP)).toBeNull();
  });

  it('returns custom layout path when exported', () => {
    writeFileSync(`${TMP}/layouts/admin.tsx`, '');
    const path = resolveLayout('admin', TMP);
    expect(path).toContain('admin.tsx');
  });
});
