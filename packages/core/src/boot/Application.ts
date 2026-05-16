import { XContainer } from "../container/XContainer";
import { discoverServices } from "../discovery/ServiceDiscovery";
import { discoverMiddlewares } from "../middleware/discoverMiddlewares";
import { ProviderRegistry } from "../providers/ProviderRegistry";
import { ServiceProvider } from "../providers/ServiceProvider";

interface BootOptions {
  providers?: Array<new (app: XContainer) => ServiceProvider>;
  servicesDir?: string | undefined;
  middlewaresDir?: string | undefined;
}

export class Application {
  public readonly container: XContainer;
  private readonly registry: ProviderRegistry;

  constructor() {
    this.container = new XContainer();
    this.registry = new ProviderRegistry(this.container);
  }

  async boot(options: BootOptions = {}): Promise<void> {
    for (const Provider of options.providers ?? []) {
      this.registry.register(Provider);
    }

    if (options.servicesDir) {
      await discoverServices(this.container, options.servicesDir);
    }

    if (options.middlewaresDir) {
      await discoverMiddlewares(options.middlewaresDir);
    }

    this.registry.boot();
  }
}

export const application = new Application();

