import type { XJob } from '../XJob';

interface QueuedJob {
  job: XJob;
  retries: number;
  maxRetries: number;
}

export class MemoryQueue {
  private queues = new Map<string, QueuedJob[]>();
  private running = false;

  /**
   * Add a job to the queue.
   */
  push(job: XJob): void {
    const queueName = (job.constructor as typeof XJob).queue;
    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, []);
    }
    this.queues.get(queueName)!.push({
      job,
      retries: 0,
      maxRetries: (job.constructor as typeof XJob).retries,
    });

    if (!this.running) {
      void this.processNext();
    }
  }

  private async processNext(): Promise<void> {
    this.running = true;

    for (const [, queue] of this.queues) {
      while (queue.length > 0) {
        const item = queue.shift()!;
        try {
          await item.job.handle();
        } catch (error) {
          if (item.retries < item.maxRetries) {
            item.retries++;
            queue.push(item); // re-queue with incremented retries
          } else {
            await item.job.failed(error as Error);
          }
        }
      }
    }

    this.running = false;
  }

  /**
   * Get the number of pending jobs across all queues.
   */
  pending(): number {
    let total = 0;
    for (const queue of this.queues.values()) {
      total += queue.length;
    }
    return total;
  }
}

