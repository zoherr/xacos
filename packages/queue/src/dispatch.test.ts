import { describe, it, expect } from 'bun:test';
import { dispatch } from './dispatch';
import { XJob } from './XJob';

let handled = false;
class SimpleJob extends XJob {
  async handle() { handled = true; }
}

describe('dispatch', () => {
  it('dispatches a job and executes it', async () => {
    process.env['QUEUE_DRIVER'] = 'memory';
    await dispatch(new SimpleJob());
    await new Promise(r => setTimeout(r, 10));
    expect(handled).toBe(true);
  });
});

