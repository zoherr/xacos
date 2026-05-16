import { Command } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';
import ora from 'ora';

export function registerDevCommand(program: Command) {
  program
    .command('dev')
    .description('Start development server with HMR')
    .option('-p, --port <port>', 'Port to listen on', '5000')
    .action(async (options: { port: string }) => {
      const spinner = ora('Starting XAOCS dev server…').start();

      try {
        const config = await loadProjectConfig();
        const port = parseInt(options.port, 10) || config.port || 5000;

        // Dynamically import to avoid loading server deps at CLI startup
        const { XServer } = await import('@xacos/server');
        const { mountApiRoutes } = await import('@xacos/server');
        const { mountViteDev } = await import('@xacos/server');
        const { application, app } = await import('@xacos/core');

        const server = new XServer();
        await server.bootstrap(config);

        const apiDir = config.api?.dir ?? './api';

        const viewsDir = config.views?.dir ?? './views';

        await mountViteDev(server.fastify, viewsDir, process.cwd());
        await mountApiRoutes(server.fastify, apiDir, app);

        await server.listen(port);
        spinner.stop();

        log.blank();
        log.success(`XAOCS dev server running`);
        log.info(`Local:   http://localhost:${port}`);
        log.info(`API:     http://localhost:${port}/api`);
        log.blank();
      } catch (err) {
        spinner.fail('Failed to start dev server');
        log.error((err as Error).message);
        process.exit(1);
      }
    });
}

