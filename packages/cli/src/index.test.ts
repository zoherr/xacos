import { describe, expect, it } from 'bun:test';
import runCLI from './index';

describe('@xacos/cli', () => {
  it('exports a CLI runner function', () => {
    expect(typeof runCLI).toBe('function');
  });
});

