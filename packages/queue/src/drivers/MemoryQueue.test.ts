import { describe, it, expect } from 'bun:test';
import { MemoryQueue } from './MemoryQueue';
import { XJob } from '../XJob';

class TestJob extends XJob {
  static executed = false;
  async handle() { TestJob.executed = true; }
}

class FailingJob extends XJob {
  static retries = 0;
  static failedCalled = false;
  async handle() { throw new Error('intentional fail'); }
  async failed(_err: Error) { FailingJob.failedCalled = true; }
}

describe('MemoryQueue', () => {
  it('executes a job', async () => {
    const queue = new MemoryQueue();
    queue.push(new TestJob());
    await new Promise(r => setTimeout(r, 10)); // let queue process
    expect(TestJob.executed).toBe(true);
  });

  it('calls failed() after exhausting retries', async () => {
    const queue = new MemoryQueue();
    queue.push(new FailingJob());
    await new Promise(r => setTimeout(r, 10));
    expect(FailingJob.failedCalled).toBe(true);
  });
});

