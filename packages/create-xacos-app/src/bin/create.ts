#!/usr/bin/env bun
import { program } from 'commander';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = resolve(__dirname, '../../package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { version: string };

program
  .name('create-xacos-app')
  .description('Create a new XAOCS application')
  .version(pkg.version)
  .argument('[project-name]', 'Name of the project')
  .action(async (projectName?: string) => {
    const { scaffold } = await import('../scaffold');
    await scaffold(projectName);
  });

program.parse(process.argv);

