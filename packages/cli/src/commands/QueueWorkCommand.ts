import { Command } from 'commander';

export function registerQueueWorkCommand(program: Command) {
  program
    .command('queue:work')
    .description('Start a queue worker')
    .option('--queue <name>', 'Queue name to work', 'default')
    .option('--driver <driver>', 'Queue driver override (memory|redis)')
    .action(async (options: { queue: string; driver?: string }) => {
      try {
        if (options.driver) {
          process.env['QUEUE_DRIVER'] = options.driver;
        }

        // We could load project config here if needed
        // await loadProjectConfig();

        const { resolveQueueDriver } = await import('@xacos/queue');
        const driver = resolveQueueDriver();

        // For BullMQ: start a worker
        if ('startWorker' in driver && typeof (driver as any).startWorker === 'function') {
          console.log(`[XAOCS Queue] Starting BullMQ worker for queue: ${options.queue}`);
          // In a real app we'd load all jobs from an api or app folder to pass them to startWorker
          // (driver as any).startWorker(options.queue, loadedJobs);
        } else {
          console.log(`[XAOCS Queue] Driver is using a synchronous/memory strategy or does not require a long-running worker process.`);
        }
      } catch (err: any) {
        console.error(`[XAOCS Queue] Failed to start worker: ${err.message}`);
      }
    });
}

