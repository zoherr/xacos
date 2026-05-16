import { Command } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';
import { resolve } from 'path';
import chalk from 'chalk';

export function registerMigrateCommand(program: Command) {
  const migrateCmd = program
    .command('migrate')
    .description('Run pending database migrations')
    .action(async () => {
      try {
        await loadProjectConfig();
        
        // Dynamically import to avoid loading ORM deps at CLI startup
        const { MigrationRunner } = await import('@xacos/orm');
        const { initOrmFromEnv } = await import('@xacos/orm');
        
        await initOrmFromEnv();
        
        const runner = new MigrationRunner();
        const migrationsDir = resolve(process.cwd(), 'database/migrations');
        
        log.step('Running migrations…');
        await runner.run(migrationsDir);
        log.success('Migrations complete');
        process.exit(0);
      } catch (err) {
        log.error((err as Error).message);
        process.exit(1);
      }
    });

  migrateCmd
    .command('rollback')
    .description('Rollback the last batch of migrations')
    .action(async () => {
      try {
        await loadProjectConfig();
        
        const { MigrationRunner } = await import('@xacos/orm');
        const { initOrmFromEnv } = await import('@xacos/orm');
        
        await initOrmFromEnv();
        
        const runner = new MigrationRunner();
        const migrationsDir = resolve(process.cwd(), 'database/migrations');
        
        log.step('Rolling back last batch…');
        await runner.rollback(migrationsDir);
        log.success('Rollback complete');
        process.exit(0);
      } catch (err) {
        log.error((err as Error).message);
        process.exit(1);
      }
    });

  migrateCmd
    .command('fresh')
    .description('Drop all tables and re-run all migrations')
    .action(async () => {
      try {
        await loadProjectConfig();
        
        const { MigrationRunner } = await import('@xacos/orm');
        const { initOrmFromEnv } = await import('@xacos/orm');
        
        await initOrmFromEnv();
        
        const runner = new MigrationRunner();
        const migrationsDir = resolve(process.cwd(), 'database/migrations');
        
        log.warn('Dropping all tables and re-running migrations…');
        await runner.fresh(migrationsDir);
        log.success('Fresh migration complete');
        process.exit(0);
      } catch (err) {
        log.error((err as Error).message);
        process.exit(1);
      }
    });

  migrateCmd
    .command('status')
    .description('Show status of all migrations')
    .action(async () => {
      try {
        await loadProjectConfig();
        
        const { MigrationRunner } = await import('@xacos/orm');
        const { initOrmFromEnv } = await import('@xacos/orm');
        
        await initOrmFromEnv();
        
        const runner = new MigrationRunner();
        const migrationsDir = resolve(process.cwd(), 'database/migrations');
        
        const status = await runner.status(migrationsDir);
        
        log.blank();
        console.log(chalk.bold(' Migration Status:'));
        console.log(' ' + '─'.repeat(40));
        
        if (status.length === 0) {
          log.info('  No migrations found.');
        } else {
          for (const row of status) {
            const icon = row.ran ? chalk.green('✓') : chalk.gray('○');
            const batch = row.batch ? chalk.gray(`(Batch: ${row.batch})`) : '';
            console.log(`  ${icon} ${row.name.padEnd(30)} ${batch}`);
          }
        }
        log.blank();
        process.exit(0);
      } catch (err) {
        log.error((err as Error).message);
        process.exit(1);
      }
    });
}

