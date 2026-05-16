/**
 * Base class for all XAOCS background jobs.
 * Extend this class and implement `handle()`.
 *
 * @example
 * export class SendWelcomeEmailJob extends XJob {
 *   constructor(public userId: number) { super(); }
 *
 *   async handle(): Promise<void> {
 *     const user = await User.findOrFail(this.userId);
 *     await mail.send({ to: user.email, subject: 'Welcome!' });
 *   }
 * }
 */
export abstract class XJob {
  /**
   * The queue this job should be placed on.
   * Defaults to 'default'.
   */
  static queue = 'default';

  /**
   * Number of times to retry on failure.
   * Defaults to 3.
   */
  static retries = 3;

  /**
   * Delay in milliseconds before first attempt.
   * Defaults to 0 (immediate).
   */
  static delay = 0;

  /**
   * Implement your job logic here.
   */
  abstract handle(): Promise<void>;

  /**
   * Called if all retries are exhausted.
   * Override to implement custom failure handling.
   */
  async failed(error: Error): Promise<void> {
    console.error(`[XAOCS Queue] Job failed: ${this.constructor.name}`, error.message);
  }
}

