import { Queue, Worker, type Job as BullJob } from 'bullmq';
import type { XJob } from '../XJob';

export interface BullMQConfig {
  host?: string | undefined;
  port?: number | undefined;
  password?: string | undefined;
}


export class BullMQQueue {
  private queues = new Map<string, Queue>();
  private workers = new Map<string, Worker>();
  private config: BullMQConfig;

  constructor(config: BullMQConfig = {}) {
    this.config = config;
  }

  private getConnection() {
    return {
      host: this.config.host ?? 'localhost',
      port: this.config.port ?? 6379,
      password: this.config.password,
    };
  }

  private getOrCreateQueue(name: string): Queue {
    if (!this.queues.has(name)) {
      this.queues.set(name, new Queue(name, {
        connection: this.getConnection(),
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
        },
      }));
    }
    return this.queues.get(name)!;
  }

  async push(job: XJob): Promise<void> {
    const JobClass = job.constructor as typeof XJob;
    const queueName = JobClass.queue;
    const queue = this.getOrCreateQueue(queueName);

    const jobName = JobClass.name;
    const payload = JSON.stringify(job);

    await queue.add(jobName, { jobName, payload }, {
      delay: JobClass.delay,
      attempts: JobClass.retries + 1,
    });
  }

  /**
   * Start a worker for the given queue name.
   * Workers process jobs in separate processes in production.
   */
  startWorker(queueName: string, jobClasses: Array<new (...args: unknown[]) => XJob>): Worker {
    // Build a registry: jobName → constructor
    const registry = new Map<string, new (...args: unknown[]) => XJob>();
    for (const JobClass of jobClasses) {
      registry.set(JobClass.name, JobClass);
    }

    const worker = new Worker(
      queueName,
      async (bullJob: BullJob) => {
        const { jobName, payload } = bullJob.data as { jobName: string; payload: string };
        const JobClass = registry.get(jobName);
        if (!JobClass) throw new Error(`[XAOCS Queue] Unknown job: ${jobName}`);

        const instance = Object.assign(new JobClass(), JSON.parse(payload));
        await instance.handle();
      },
      { connection: this.getConnection() }
    );

    this.workers.set(queueName, worker);
    return worker;
  }

  async close(): Promise<void> {
    for (const worker of this.workers.values()) await worker.close();
    for (const queue of this.queues.values()) await queue.close();
  }
}

