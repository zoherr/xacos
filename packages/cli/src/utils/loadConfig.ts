import { existsSync } from 'fs';
import { resolve } from 'path';

import type { XacosConfig } from '@xacos/config';
import { loadEnv } from '@xacos/config';

export async function loadProjectConfig(): Promise<XacosConfig> {
  // Always load .env first
  loadEnv(resolve(process.cwd(), '.env'));

  const configPath = resolve(process.cwd(), 'xacos.config.ts');
  if (!existsSync(configPath)) {
    throw new Error(
      '[XAOCS CLI] xacos.config.ts not found. Are you in an XAOCS project root?'
    );
  }

  const mod = await import(configPath) as { default: XacosConfig };
  return mod.default;
}

