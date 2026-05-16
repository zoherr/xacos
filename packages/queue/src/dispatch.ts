import { QueueManager } from './QueueManager';
import type { XJob } from './XJob';

/**
 * Dispatch a job to the queue.
 *
 * @example
 * import { dispatch } from '@xacos/queue';
 * await dispatch(new SendWelcomeEmailJob(user.id));
 */
export async function dispatch(job: XJob): Promise<void> {
  await QueueManager.resolve().push(job);
}

