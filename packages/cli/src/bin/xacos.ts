#!/usr/bin/env node
import { runCLI } from '../index';

runCLI(process.argv).catch((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error('CLI error:', err);
  process.exit(1);
});

