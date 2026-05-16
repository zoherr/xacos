import type { XacosConfig } from "./types";

export function defineConfig(config: XacosConfig): XacosConfig {
  return {
    port: 5000,
    api: { prefix: '/api', dir: './api' },
    views: { dir: './views', defaultLayout: 'main' },
    ...config,
  };
}

