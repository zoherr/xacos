import type { ServiceProvider } from "@xaocs/core";

export interface XaocsConfig {
  app?: {
    name?: string;
    env?: string;
    port?: number;
  };
  providers?: Array<new () => ServiceProvider>;
}
