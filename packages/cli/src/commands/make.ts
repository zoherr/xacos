import { Command } from 'commander';
import { log } from '../utils/logger';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

export function registerMakeCommand(program: Command) {
  const make = program.command('make').description('Generate database files');

  // ─── xacos make migration <name> ─────────────────────────────────────────
  make
    .command('migration <name>')
    .description('Generate a new migration file')
    .action((name: string) => {
      const timestamp = Date.now();
      const filename = `${timestamp}_${name}.ts`;
      const path = resolve(`./database/migrations/${filename}`);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, migrationTemplate(name));
      log.success(`Migration created: database/migrations/${filename}`);
    });

  // ─── xacos make seeder <name> ────────────────────────────────────────────
  make
    .command('seeder <name>')
    .description('Generate a new seeder file')
    .action((name: string) => {
      const path = resolve(`./database/seeders/${name}.ts`);
      if (existsSync(path)) {
        log.error(`Already exists: ${path}`);
        process.exit(1);
      }
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, seederTemplate(name));
      log.success(`Seeder created: database/seeders/${name}.ts`);
    });
}

function migrationTemplate(name: string): string {
  return `import { Migration, Schema } from '@xacos/orm';

export default class ${toPascalCase(name)} extends Migration {
  async up(schema: Schema): Promise<void> {
    await schema.createTable('table_name', (table) => {
      table.bigIncrements('id');
      // Add columns here
      table.timestamps(true, true);
    });
  }

  async down(schema: Schema): Promise<void> {
    await schema.dropTable('table_name');
  }
}
`;
}

function seederTemplate(name: string): string {
  return `import { Seeder } from '@xacos/orm';

export default class ${name} extends Seeder {
  async run(): Promise<void> {
    // Seed your data here
    // await User.create({ name: 'Test', email: 'test@example.com' });
  }
}
`;
}

function toPascalCase(str: string): string {
  return str.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

