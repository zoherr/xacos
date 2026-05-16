export abstract class Seeder {
  /**
   * Implement this method with your seed logic.
   * Called by the SeederRunner when `xacos db:seed` is invoked.
   */
  abstract run(): Promise<void>;
}

