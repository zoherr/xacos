import { Command } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';

export function registerBuildCommand(program: Command) {
  program
    .command('build')
    .description('Build the application for production')
    .action(async () => {
      try {
        const config = await loadProjectConfig();
        const viewsDir = config.views?.dir ?? './views';

        // Dynamically import to avoid loading compiler deps at CLI startup
        const { buildProduction } = await import('@xacos/compiler');

        log.step('Building production bundles…');
        const result = await buildProduction(viewsDir, '.xacos/client', process.cwd());

        log.success('Build complete');
        log.blank();
        
        // Display stats from metafile
        const stats = Object.entries(result.metafile.outputs)
          .filter(([file]) => file.endsWith('.js'))
          .map(([file, info]) => ({
            File: file,
            Size: (info.bytes / 1024).toFixed(2) + ' KB'
          }));

        console.table(stats);
        log.blank();
        process.exit(0);
      } catch (err) {
        log.error((err as Error).message);
        process.exit(1);
      }
    });
}

