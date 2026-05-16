import { Command } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';
import { resolve } from 'path';

export function registerSeedCommand(program: Command) {
  program
    .command('db:seed')
    .description('Run database seeders')
    .option('--seeder <name>', 'Run a specific seeder by class name')
    .action(async (options: { seeder?: string }) => {
      try {
        await loadProjectConfig();
        
        const { SeederRunner } = await import('@xacos/orm');
        const { initOrmFromEnv } = await import('@xacos/orm');
        
        await initOrmFromEnv();
        
        const seedersDir = resolve(process.cwd(), 'database/seeders');
        const runner = new SeederRunner(seedersDir);

        if (options.seeder) {
          log.step(`Running seeder: ${options.seeder}…`);
          await runner.runOne(options.seeder);
        } else {
          log.step('Running all seeders…');
          await runner.runAll();
        }

        log.success('Seeding complete');
        process.exit(0);
      } catch (err) {
        log.error((err as Error).message);
        process.exit(1);
      }
    });
}

