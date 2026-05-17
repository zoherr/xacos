import { Command } from 'commander';
import { log } from '../utils/logger';
import chalk from 'chalk';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

interface EcosystemPackage {
  name: string;
  npm: string;
  description: string;
  envVars: string[];
  docs: string;
}

const ECOSYSTEM_PACKAGES: EcosystemPackage[] = [
  {
    name: 'Mail',
    npm: '@xacos/mail',
    description: 'Email sending (SMTP, SES, Mailgun, Postmark, Resend)',
    envVars: ['MAIL_DRIVER=smtp', 'MAIL_HOST=', 'MAIL_PORT=587', 'MAIL_USERNAME=', 'MAIL_PASSWORD=', 'MAIL_FROM='],
    docs: 'https://xaocs.dev/docs/packages/mail',
  },
  {
    name: 'Cache',
    npm: '@xacos/cache',
    description: 'Caching (Memory, Redis)',
    envVars: ['CACHE_DRIVER=memory', 'REDIS_HOST=localhost', 'REDIS_PORT=6379'],
    docs: 'https://xaocs.dev/docs/packages/cache',
  },
  {
    name: 'Storage',
    npm: '@xacos/storage',
    description: 'File storage (Local, S3, R2, MinIO)',
    envVars: ['STORAGE_DRIVER=local', 'S3_BUCKET=', 'S3_REGION=us-east-1', 'S3_ACCESS_KEY_ID=', 'S3_SECRET_ACCESS_KEY='],
    docs: 'https://xaocs.dev/docs/packages/storage',
  },
  {
    name: 'Queue',
    npm: '@xacos/queue',
    description: 'Background jobs (Memory, Redis/BullMQ)',
    envVars: ['QUEUE_DRIVER=memory'],
    docs: 'https://xaocs.dev/docs/packages/queue',
  },
  {
    name: 'Events',
    npm: '@xacos/events',
    description: 'Real-time WebSocket events (Socket.IO)',
    envVars: [],
    docs: 'https://xaocs.dev/docs/packages/events',
  },
  {
    name: 'Validation',
    npm: '@xacos/validation',
    description: 'Request validation with Zod',
    envVars: [],
    docs: 'https://xaocs.dev/docs/packages/validation',
  },
  {
    name: 'UI',
    npm: '@xacos/ui',
    description: 'React component library with Tailwind',
    envVars: [],
    docs: 'https://xaocs.dev/docs/packages/ui',
  },
  {
    name: 'Testing',
    npm: '@xacos/testing',
    description: 'Test utilities (testClient, mockAuth, useTestDb)',
    envVars: [],
    docs: 'https://xaocs.dev/docs/packages/testing',
  },
];

export function registerAddPackageCommand(program: Command) {
  program
    .command('add:package')
    .alias('install')
    .description('Add an official XAOCS ecosystem package')
    .argument('[package]', 'Package name (e.g. mail, cache, storage)')
    .action(async (packageArg?: string) => {
      log.blank();
      console.log(chalk.bold('XAOCS Ecosystem Packages\n'));

      let selected: EcosystemPackage | undefined;

      if (packageArg) {
        selected = ECOSYSTEM_PACKAGES.find(
          p => p.name.toLowerCase() === packageArg.toLowerCase() ||
               p.npm === packageArg ||
               p.npm === `@xacos/${packageArg}`
        );
        if (!selected) {
          log.error(`Unknown package: ${packageArg}`);
          log.info(`Available: ${ECOSYSTEM_PACKAGES.map(p => p.name.toLowerCase()).join(', ')}`);
          process.exit(1);
        }
      } else {
        // Show interactive menu
        ECOSYSTEM_PACKAGES.forEach((pkg, i) => {
          console.log(`  ${chalk.cyan(String(i + 1).padEnd(3))} ${chalk.bold(pkg.npm.padEnd(25))} ${chalk.gray(pkg.description)}`);
        });
        log.blank();

        const readline = await import('node:readline');
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const choice = await new Promise<string>(resolve => {
          rl.question('Select package number: ', resolve);
        });
        rl.close();

        const idx = parseInt(choice.trim(), 10) - 1;
        selected = ECOSYSTEM_PACKAGES[idx];
        if (!selected) {
          log.error('Invalid selection');
          process.exit(1);
        }
      }

      log.blank();
      log.step(`Installing ${selected.npm}…`);
      execSync(`bun add ${selected.npm}`, { stdio: 'inherit' });
      log.success(`${selected.npm} installed`);

      // Append env vars to .env.example if they don't exist
      if (selected.envVars.length > 0) {
        const envPath = resolve('.env.example');
        if (existsSync(envPath)) {
          const existing = readFileSync(envPath, 'utf-8');
          const toAdd = selected.envVars
            .filter(v => !existing.includes(v.split('=')[0]!))
            .join('\n');
          if (toAdd) {
            writeFileSync(envPath, existing + `\n# ${selected.name}\n${toAdd}\n`);
            log.info('Added env vars to .env.example');
          }
        }
      }

      log.blank();
      log.success(`Done! Read the docs: ${selected.docs}`);
      log.blank();
    });
}
