import { Command } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';

export function registerStartCommand(program: Command) {
  program
    .command('start')
    .description('Start the production server')
    .action(async () => {
      try {
        process.env['NODE_ENV'] = 'production';
        process.env['APP_ENV'] = 'production';

        const config = await loadProjectConfig();
        const port = config.port || 5000;
        const apiDir = config.api?.dir ?? './api';
        const viewsDir = config.views?.dir ?? './views';

        const { XServer } = await import('@xacos/server');
        const { mountApiRoutes } = await import('@xacos/server');
        const { mountViewRoutes } = await import('@xacos/server');
        const { serveStaticChunks } = await import('@xacos/server');
        const { app } = await import('@xacos/core');

        const server = new XServer();

        await serveStaticChunks(server.fastify, '.xacos/client');
        await mountViewRoutes(server.fastify, viewsDir);
        await mountApiRoutes(server.fastify, apiDir, app);

        await server.listen(port);
        log.success(`XAOCS production server running at http://localhost:${port}`);
      } catch (err) {
        log.error((err as Error).message);
        process.exit(1);
      }
    });
}

