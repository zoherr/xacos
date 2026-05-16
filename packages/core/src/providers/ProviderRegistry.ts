import { XContainer } from "../container/XContainer";
import { ServiceProvider } from "./ServiceProvider";

type ProviderConstructor = new (app: XContainer) => ServiceProvider;

export class ProviderRegistry {
  private readonly providers: ServiceProvider[] = [];

  constructor(private readonly container: XContainer) {}

  register(ProviderClass: ProviderConstructor): void {
    const provider = new ProviderClass(this.container);
    provider.register();
    this.providers.push(provider);
  }

  boot(): void {
    for (const provider of this.providers) {
      provider.boot();
    }
  }
}

