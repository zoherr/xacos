import { Command } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';
import chalk from 'chalk';

export function registerRoutesCommand(program: Command) {
  program
    .command('routes')
    .description('List all registered routes')
    .action(async () => {
      try {
        const config = await loadProjectConfig();
        const apiDir = config.api?.dir ?? './api';
        const viewsDir = config.views?.dir ?? './views';

        // Dynamically import to avoid loading heavy deps at CLI startup
        const { scanApiFiles } = await import('@xacos/core');
        const { scanViews } = await import('@xacos/compiler');

        log.blank();
        console.log(chalk.bold(' API Routes:'));
        console.log(' ' + '─'.repeat(50));

        const apiFiles = scanApiFiles(apiDir);
        let apiRouteCount = 0;

        for (const { filePath, urlPrefix } of apiFiles) {
          // Import to read the router's routes
          const mod = await import(filePath);
          const router = mod.router;
          
          if (router && Array.isArray(router.routes)) {
            for (const route of router.routes) {
              const fullPath = urlPrefix + (route.path === '/' ? '' : route.path);
              const method = chalk.green(route.method.padEnd(7));
              console.log(`  ${method} ${fullPath || '/'}`);
              apiRouteCount++;
            }
          }
        }

        if (apiRouteCount === 0) {
          console.log(chalk.gray('  No API routes found.'));
        }

        log.blank();
        console.log(chalk.bold(' View Routes:'));
        console.log(' ' + '─'.repeat(50));

        const views = scanViews(viewsDir);
        if (views.length === 0) {
          console.log(chalk.gray('  No view routes found.'));
        } else {
          for (const view of views) {
            const method = chalk.cyan('GET'.padEnd(7));
            console.log(`  ${method} ${view.urlPattern}`);
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

