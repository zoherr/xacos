import { describe, it, expect } from 'bun:test';
import { extractPageMeta } from './extractPageMeta';

describe('extractPageMeta', () => {
  it('extracts title and description from module object', () => {
    const mod = {
      meta: {
        title: 'Home Page',
        description: 'Welcome to XAOCS'
      }
    };
    const meta = extractPageMeta(mod);
    expect(meta.title).toBe('Home Page');
    expect(meta.description).toBe('Welcome to XAOCS');
  });

  it('returns empty object if no meta exported', () => {
    const mod = { default: () => {} };
    expect(extractPageMeta(mod)).toEqual({});
  });

  it('ignores non-string title/description', () => {
    const mod = {
      meta: {
        title: 123,
        description: true
      }
    };
    const meta = extractPageMeta(mod as any);
    expect(meta.title).toBeUndefined();
    expect(meta.description).toBeUndefined();
  });
});

