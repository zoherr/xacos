import { Command } from 'commander';
import { log } from '../utils/logger';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

export function registerAddCommand(program: Command) {
  const add = program.command('add').description('Generate application files');

  // ─── xacos add model <Name> ─────────────────────────────────────────────
  add
    .command('model <name>')
    .description('Generate a new XModel')
    .action((name: string) => {
      const path = resolve(`./database/models/${name}.ts`);
      guard(path);
      writeFileSync(path, modelTemplate(name));
      log.success(`Model created: database/models/${name}.ts`);
    });

  // ─── xacos add middleware <name> ────────────────────────────────────────
  add
    .command('middleware <name>')
    .description('Generate a new middleware')
    .action((name: string) => {
      const path = resolve(`./app/middlewares/${name}.middleware.ts`);
      guard(path);
      writeFileSync(path, middlewareTemplate(name));
      log.success(`Middleware created: app/middlewares/${name}.middleware.ts`);
    });

  // ─── xacos add service <name> ───────────────────────────────────────────
  add
    .command('service <name>')
    .description('Generate a new service')
    .action((name: string) => {
      const path = resolve(`./app/services/${name}Service.ts`);
      guard(path);
      writeFileSync(path, serviceTemplate(name));
      log.success(`Service created: app/services/${name}Service.ts`);
    });

  // ─── xacos add controller <name> ────────────────────────────────────────
  add
    .command('controller <name>')
    .description('Generate a new controller')
    .action((name: string) => {
      const path = resolve(`./app/controllers/${name}Controller.ts`);
      guard(path);
      writeFileSync(path, controllerTemplate(name));
      log.success(`Controller created: app/controllers/${name}Controller.ts`);
    });

  // ─── xacos add api <name> ───────────────────────────────────────────────
  add
    .command('api <name>')
    .description('Generate a new *.api.ts route file')
    .option('-v, --version <version>', 'API version prefix (e.g. v1)')
    .action((name: string, options: { version?: string }) => {
      const prefix = options.version ? `${options.version}.` : '';
      const filename = `${prefix}${name}.api.ts`;
      const path = resolve(`./api/${filename}`);
      guard(path);
      writeFileSync(path, apiTemplate(name, options.version));
      log.success(`API route created: api/${filename}`);
      const urlPrefix = options.version ? `/api/${options.version}/${name}` : `/api/${name}`;
      log.info(`Routes available at: ${urlPrefix}/`);
    });
}

function guard(path: string) {
  if (existsSync(path)) {
    log.error(`File already exists: ${path}`);
    process.exit(1);
  }
  mkdirSync(dirname(path), { recursive: true });
}

function modelTemplate(name: string): string {
  return `import { XModel, Column } from '@xacos/orm';

export class ${name} extends XModel {
  static table = '${name.toLowerCase()}s';

  @Column()
  declare id: number;

  // Add your columns here

  @Column()
  declare created_at: Date;

  @Column()
  declare updated_at: Date;
}
`;
}

function middlewareTemplate(name: string): string {
  return `import type { XMiddleware } from '@xacos/shared';

export const ${name}: XMiddleware = async (req, res, next) => {
  // Your middleware logic here

  await next();
};
`;
}

function serviceTemplate(name: string): string {
  return `export class ${name}Service {
  // static inject = ['OtherService']; // Uncomment to inject dependencies

  async example(): Promise<void> {
    // Business logic here
  }
}
`;
}

function controllerTemplate(name: string): string {
  return `import { XController } from '@xacos/core';
import type { XRequest, XResponse } from '@xacos/shared';

export class ${name}Controller extends XController {
  async index(req: XRequest, res: XResponse) {
    return this.ok(res, { message: '${name} list' });
  }

  async show(req: XRequest, res: XResponse) {
    const { id } = req.params;
    return this.ok(res, { id });
  }

  async store(req: XRequest, res: XResponse) {
    return this.created(res, req.body);
  }

  async update(req: XRequest, res: XResponse) {
    const { id } = req.params;
    return this.ok(res, { id, ...req.body as object });
  }

  async destroy(req: XRequest, res: XResponse) {
    return this.noContent(res);
  }
}
`;
}

function apiTemplate(name: string, version?: string): string {
  const Name = name.charAt(0).toUpperCase() + name.slice(1);
  const urlPrefix = version ? `/api/${version}/${name}` : `/api/${name}`;
  return `import { XRouter } from '@xacos/core';
// import { authenticate } from '@xacos/auth';
// import { ${Name}Service } from '../app/services/${Name}Service';

export const router = new XRouter();

// GET ${urlPrefix}/
router.get('/', async (req, res) => {
  return res.json({ success: true, data: [] });
});

// GET ${urlPrefix}/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  return res.json({ success: true, data: { id } });
});

// POST ${urlPrefix}/
router.post('/', async (req, res) => {
  return res.status(201).json({ success: true, data: req.body });
});

// PUT ${urlPrefix}/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  return res.json({ success: true, data: { id, ...req.body as object } });
});

// DELETE ${urlPrefix}/:id
router.delete('/:id', async (req, res) => {
  return res.status(204).send();
});
`;
}

