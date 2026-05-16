import { Command } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';
import repl from 'node:repl';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

export function registerTinkerCommand(program: Command) {
  program
    .command('tinker')
    .description('Open an interactive REPL with XAOCS app context')
    .action(async () => {
      try {
        const config = await loadProjectConfig();
        
        log.info('Starting XAOCS Tinker REPL…');
        log.info('Available: app, config, XModel, User');
        log.blank();

        // Boot the application container
        const { application } = await import('@xacos/core');
        const { XModel } = await import('@xacos/orm');
        
        // Ensure we are in a project root and have the expected directories
        const servicesDir = resolve(process.cwd(), 'app/services');
        const middlewaresDir = resolve(process.cwd(), 'app/middlewares');

        await application.boot({
          servicesDir: existsSync(servicesDir) ? servicesDir : undefined,
          middlewaresDir: existsSync(middlewaresDir) ? middlewaresDir : undefined,
        });

        // Start REPL
        const server = repl.start({ 
          prompt: 'xacos> ',
          useGlobal: true,
        });

        // Inject context
        server.context['app'] = application.container;
        server.context['config'] = config;
        server.context['XModel'] = XModel;

        // Try to load User model if it exists in the standard location
        const userModelPath = resolve(process.cwd(), 'database/models/User.ts');
        if (existsSync(userModelPath)) {
          try {
            const mod = await import(userModelPath);
            server.context['User'] = mod.default ?? mod.User;
          } catch (e) {
            log.warn('Could not load User model: ' + (e as Error).message);
          }
        }

        server.on('exit', () => {
          log.blank();
          log.info('Exiting tinker. Goodbye!');
          process.exit(0);
        });
      } catch (err) {
        log.error((err as Error).message);
        process.exit(1);
      }
    });
}

