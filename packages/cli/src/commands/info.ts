import { Command } from 'commander';
import { loadProjectConfig } from '../utils/loadConfig';
import chalk from 'chalk';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export function registerInfoCommand(program: Command) {
  program
    .command('info')
    .description('Show XAOCS framework and environment info')
    .action(async () => {
      const __dirname = dirname(fileURLToPath(import.meta.url));
      const pkgPath = resolve(__dirname, '../package.json');
      
      let version = 'unknown';
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { version: string };
        version = pkg.version;
      } catch {
        // Fallback for dev environment
      }

      console.log('\n' + chalk.bold.cyan('  XAOCS Framework Info'));
      console.log('  ' + '─'.repeat(40));
      console.log(`  CLI Version:   ${chalk.white(version)}`);
      console.log(`  Bun Version:   ${chalk.white(process.versions.bun ?? 'unknown')}`);
      console.log(`  Node Version:  ${chalk.white(process.version)}`);
      console.log(`  Platform:      ${chalk.white(process.platform)} (${process.arch})`);
      console.log('  ' + '─'.repeat(40));

      try {
        const config = await loadProjectConfig();
        console.log(`  APP_ENV:       ${chalk.white(process.env['APP_ENV'] ?? 'development')}`);
        console.log(`  Port:          ${chalk.white(config.port ?? 5000)}`);
        console.log(`  DB Driver:     ${chalk.white(process.env['DB_DRIVER'] ?? 'sqlite')}`);
        console.log(`  Views Dir:     ${chalk.white(config.views?.dir ?? './views')}`);
        console.log(`  API Dir:       ${chalk.white(config.api?.dir ?? './api')}`);
        console.log(`  API Prefix:    ${chalk.white(config.api?.prefix ?? '/api')}`);
      } catch {
        console.log(chalk.yellow('  ⚠ Could not load xacos.config.ts or .env'));
      }

      console.log('  ' + '─'.repeat(40) + '\n');
    });
}

