import { program } from 'commander';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { registerDevCommand } from './commands/dev';
import { registerBuildCommand } from './commands/build';
import { registerStartCommand } from './commands/start';
import { registerMigrateCommand } from './commands/migrate';
import { registerSeedCommand } from './commands/seed';
import { registerRoutesCommand } from './commands/routes';
import { registerTinkerCommand } from './commands/tinker';
import { registerInfoCommand } from './commands/info';
import { registerAddCommand } from './commands/add';
import { registerMakeCommand } from './commands/make';
import { registerStorageLinkCommand } from './commands/StorageLinkCommand';
import { registerQueueWorkCommand } from './commands/QueueWorkCommand';

import { fileURLToPath } from 'node:url';


import { dirname } from 'node:path';

export async function runCLI(argv: string[]): Promise<void> {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const pkgPath = resolve(__dirname, '../package.json');
  
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { version: string };

  program
    .name('xacos')
    .description('XAOCS Framework CLI')
    .version(pkg.version);

  // Register all commands
  registerDevCommand(program);
  registerBuildCommand(program);
  registerStartCommand(program);
  registerMigrateCommand(program);
  registerSeedCommand(program);
  registerRoutesCommand(program);
  registerTinkerCommand(program);
  registerInfoCommand(program);
  registerAddCommand(program);
  registerMakeCommand(program);
  registerStorageLinkCommand(program);
  registerQueueWorkCommand(program);

  program.parse(argv);

}

export default runCLI;
export { program } from 'commander';

