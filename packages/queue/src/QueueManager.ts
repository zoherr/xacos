import { MemoryQueue } from './drivers/MemoryQueue';

export interface QueueDriver {
  push(job: import('./XJob').XJob): Promise<void> | void;
}

let _instance: QueueDriver | null = null;

export function resolveQueueDriver(): QueueDriver {
  if (_instance) return _instance;

  const driver = process.env['QUEUE_DRIVER'] ?? 'memory';

  switch (driver) {
    case 'redis': {
      const { BullMQQueue } = require('./drivers/BullMQQueue') as typeof import('./drivers/BullMQQueue');
      _instance = new BullMQQueue({
        host: process.env['REDIS_HOST'] ?? 'localhost',
        port: Number(process.env['REDIS_PORT'] ?? 6379),
        password: process.env['REDIS_PASSWORD'],
      });
      break;
    }
    case 'memory':
    default:
      _instance = new MemoryQueue();
      break;
  }

  return _instance;
}

export class QueueManager {
  static resolve(): QueueDriver {
    return resolveQueueDriver();
  }
}

