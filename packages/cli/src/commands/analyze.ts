import { Command } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';
import { writeFileSync } from 'fs';

export function registerAnalyzeCommand(program: Command) {
  program
    .command('analyze')
    .description('Analyze production bundle sizes')
    .option('--out <dir>', 'Output directory', '.xacos/client')
    .action(async (options: { out: string }) => {
      try {
        const config = await loadProjectConfig();
        const { analyzeBundle, formatBundleReport } = await import('@xacos/compiler');

        log.step('Analyzing bundle…');
        const report = await analyzeBundle(
          config.views?.dir ?? './views',
          options.out,
          process.cwd()
        );
        const formatted = formatBundleReport(report);
        writeFileSync('bundle-report.md', formatted);
        console.log('\n' + formatted + '\n');
        log.success('Report saved to bundle-report.md');

        // Warn on large bundles
        for (const page of report.pages) {
          if (page.sizeKb > 200) {
            log.warn(`Large bundle: ${page.page} (${page.sizeKb.toFixed(1)} KB). Consider code splitting.`);
          }
        }
        process.exit(0);
      } catch (err) {
        log.error((err as Error).message);
        process.exit(1);
      }
    });
}
