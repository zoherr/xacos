import { XContainer } from "../container/XContainer";

export abstract class ServiceProvider {
  constructor(protected readonly app: XContainer) {}

  abstract register(): void;

  boot(): void {
    // Optional lifecycle hook for subclasses.
  }
}

