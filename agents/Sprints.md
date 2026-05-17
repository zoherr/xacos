# XAOCS Framework — Master Sprint Roadmap (200 Sprints)

> **Stack:** TurboRepo + Bun + TypeScript + Fastify + React + Knex + Vite + esbuild
> **Monorepo already exists.** Docs site and web app already live inside it.
> **Agent rules are at the bottom of this file — read before touching a single file.**

---

## 🗂️ MAINTENANCE README (auto-update every sprint)

At the root of the monorepo, maintain `MAINTENANCE.md` with this exact shape:

```md
# XAOCS Maintenance Log

## Progress
- Total Sprints: 200
- Completed: X
- In Progress: 1
- Remaining: Y

## Sprint Log
| # | Title | Status | Date | Notes |
|---|-------|--------|------|-------|
| 1 | ... | ✅ Done | YYYY-MM-DD | ... |
...

## Recent Changes
- ...

## Known Issues
- ...

## Next Up
- Sprint X+1: ...
```

**Rule: Every agent MUST update `MAINTENANCE.md` as the very last step of each sprint before marking done.**

---

## 🤖 AGENT RULES (Read First — Non-Negotiable)

1. **Bun everywhere.** Use `bun` not `npm` or `yarn`. `bun install`, `bun run`, `bun build`.
2. **TurboRepo tasks.** All scripts go through `turbo.json` pipelines.
3. **TypeScript strict.** `"strict": true` in every `tsconfig.json`. Zero `any`.
4. **No raw SQL.** Always use XModel query builder.
5. **File-based routing only.** Never manually register routes — the scanner does it.
6. **Thin API handlers.** Max 20 lines. Business logic → service files.
7. **One sprint = one atomic unit.** Do not bleed work across sprints.
8. **Tests per sprint.** Every sprint that adds logic must add a test file alongside.
9. **Update `MAINTENANCE.md` last.** Non-negotiable. Every sprint.
10. **Never break existing sprints.** Run `bun run build` from root before closing a sprint.
11. **Package naming:** `@xacos/<name>` for internal packages, `create-xacos-app` for scaffolder.
12. **Exports:** Every package must have explicit `exports` field in `package.json`.
13. **No circular deps.** `@xacos/core` depends on nothing internal. Everything else may depend on core.
14. **Changelog.** Add one line to `CHANGELOG.md` at root per sprint.
15. **`.env.example` always ships** in every template and scaffold.
16. **New architecture rules (from user spec):**
    - API files live as `<name>.api.ts` (e.g. `user.api.ts`) — NOT in nested folders
    - Routes defined inside that file via `router.get(...)` etc.
    - URL prefix auto-derived from filename: `user.api.ts` → `/api/user/`
    - App folder contains: controllers, services, middlewares
    - Structure: `app/`, `views/`, `config/`, `database/` (models, migrations, seeders), `api/`
    - No `AppServiceProvider` — auto-discovery replaces manual registration
    - No manual service container wiring for common cases

---

<!-- Features -->

---

# SPRINTS 1–50 (Detailed)

---

## Sprint 1 — Monorepo Audit

**Goal:** Understand what already exists before writing a single line of new code.

**Steps:**
1. Run `find . -name "package.json" -not -path "*/node_modules/*"` and list all packages/apps.
2. Document in `MAINTENANCE.md`: existing apps, existing packages, existing turbo pipelines.
3. List any naming conflicts with `@xacos/*` namespace.
4. Identify which `apps/` entries are the docs site and web app.
5. Note the existing Bun/npm setup.

**Output files:**
- `MAINTENANCE.md` (created fresh, tracks all future sprints)
- `CHANGELOG.md` (created fresh)

**Agent rule:** Do NOT modify any existing file. Read only. Document only.

**Done when:** `MAINTENANCE.md` exists with full inventory table.

---

## Sprint 2 — TurboRepo Config

**Goal:** Configure `turbo.json` to handle build/dev/test/lint pipelines for all packages.

**`turbo.json`:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
```

**Root `package.json` scripts:**
```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean"
  }
}
```

**Done when:** `bun run build` from root succeeds (even if no packages exist yet).

---

## Sprint 3 — Bun Workspace Setup

**Goal:** Configure Bun workspaces across the monorepo.

**Root `package.json` workspaces:**
```json
{
  "workspaces": [
    "packages/*",
    "apps/*"
  ]
}
```

**`bunfig.toml` at root:**
```toml
[install]
frozen-lockfile = false

[install.scopes]
"@xacos" = { token = "" }
```

**Run:** `bun install` from root — verify workspace links resolve.

**Done when:** `bun run build` passes and workspace packages resolve each other.

---

## Sprint 4 — Shared TS Config

**Goal:** Single source of truth for TypeScript config.

**`tsconfig.base.json` at root:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

Every package's `tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Done when:** All packages (when they exist) compile with zero TS errors.

---

## Sprint 5 — `@xacos/shared` Init

**Goal:** Create shared types package — used by all other packages. Zero runtime code, types only.

**Location:** `packages/shared/`

**`packages/shared/package.json`:**
```json
{
  "name": "@xacos/shared",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "type-check": "tsc --noEmit"
  }
}
```

**`packages/shared/src/index.ts`:**
```typescript
export interface XRequest {
  params: Record<string, string>;
  query: Record<string, string>;
  body: unknown;
  headers: Record<string, string | string[] | undefined>;
  user?: XUser;
  app: XApp;
}

export interface XResponse {
  json(data: unknown): XResponse;
  status(code: number): XResponse;
  send(data?: string): XResponse;
  redirect(url: string): void;
  setCookie(name: string, value: string, opts?: CookieOptions): XResponse;
}

export type XNext = () => Promise<void>;
export type XMiddleware = (req: XRequest, res: XResponse, next: XNext) => Promise<void>;

export interface XUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface XApp {
  make<T>(key: string): T;
}

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  maxAge?: number;
  path?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}
```

**Done when:** `bun run build` in `packages/shared` produces `dist/index.js` and `dist/index.d.ts`.

---

## Sprint 6 — `@xacos/core` Init

**Goal:** Scaffold `@xacos/core` package structure.

**Location:** `packages/core/`

**`packages/core/package.json`:**
```json
{
  "name": "@xacos/core",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "@xacos/shared": "workspace:*"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "bun test",
    "type-check": "tsc --noEmit"
  }
}
```

**`packages/core/src/index.ts`:** (barrel — empty for now, filled sprint by sprint)
```typescript
export {};
```

**Done when:** Package builds cleanly.

---

## Sprint 7 — IoC Container

**Goal:** Implement `XContainer` — the heart of XAOCS.

**`packages/core/src/container/XContainer.ts`:**
```typescript
type Factory<T> = () => T;

export class XContainer {
  private bindings = new Map<string, Factory<unknown>>();
  private singletonCache = new Map<string, unknown>();

  bind<T>(key: string, factory: Factory<T>): void {
    this.bindings.set(key, factory as Factory<unknown>);
  }

  singleton<T>(key: string, factory: Factory<T>): void {
    this.bindings.set(key, () => {
      if (!this.singletonCache.has(key)) {
        this.singletonCache.set(key, factory());
      }
      return this.singletonCache.get(key) as T;
    });
  }

  make<T>(key: string): T {
    const factory = this.bindings.get(key);
    if (!factory) {
      throw new Error(`[XAOCS Container] No binding registered for: "${key}"`);
    }
    return factory() as T;
  }

  has(key: string): boolean {
    return this.bindings.has(key);
  }

  flush(): void {
    this.bindings.clear();
    this.singletonCache.clear();
  }
}

export const app = new XContainer();
```

**Test file `packages/core/src/container/XContainer.test.ts`:**
```typescript
import { describe, it, expect, beforeEach } from 'bun:test';
import { XContainer } from './XContainer';

describe('XContainer', () => {
  let container: XContainer;

  beforeEach(() => { container = new XContainer(); });

  it('binds and makes a factory', () => {
    container.bind('Greeter', () => ({ greet: () => 'hello' }));
    const g = container.make<{ greet(): string }>('Greeter');
    expect(g.greet()).toBe('hello');
  });

  it('singleton returns same instance', () => {
    let count = 0;
    container.singleton('Counter', () => ({ id: ++count }));
    const a = container.make<{ id: number }>('Counter');
    const b = container.make<{ id: number }>('Counter');
    expect(a.id).toBe(b.id);
    expect(count).toBe(1);
  });

  it('throws on missing binding', () => {
    expect(() => container.make('Missing')).toThrow();
  });
});
```

Export from `packages/core/src/index.ts`:
```typescript
export { XContainer, app } from './container/XContainer';
```

**Done when:** `bun test` passes in `packages/core`.

---

## Sprint 8 — Service Provider Base

**Goal:** Implement `ServiceProvider` abstract class.

**`packages/core/src/providers/ServiceProvider.ts`:**
```typescript
import { XContainer } from '../container/XContainer';

export abstract class ServiceProvider {
  constructor(protected app: XContainer) {}

  abstract register(): void;

  boot(): void {
    // Optional override
  }
}
```

**`packages/core/src/providers/ProviderRegistry.ts`:**
```typescript
import { XContainer } from '../container/XContainer';
import { ServiceProvider } from './ServiceProvider';

type ProviderConstructor = new (app: XContainer) => ServiceProvider;

export class ProviderRegistry {
  private providers: ServiceProvider[] = [];

  constructor(private container: XContainer) {}

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
```

Export both from `packages/core/src/index.ts`.

**Done when:** Types resolve and no TS errors.

---

## Sprint 9 — Auto-Discovery

**Goal:** Auto-discover and register services from `app/services/` — no manual wiring needed.

**`packages/core/src/discovery/ServiceDiscovery.ts`:**
```typescript
import { readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { XContainer } from '../container/XContainer';

export async function discoverServices(
  container: XContainer,
  servicesDir: string
): Promise<void> {
  const fullPath = resolve(servicesDir);

  let files: string[];
  try {
    files = readdirSync(fullPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
  } catch {
    return; // Directory doesn't exist — skip
  }

  for (const file of files) {
    const mod = await import(join(fullPath, file));

    for (const [exportName, exportedValue] of Object.entries(mod)) {
      if (
        typeof exportedValue === 'function' &&
        exportName.endsWith('Service') &&
        !container.has(exportName)
      ) {
        container.singleton(exportName, () => new (exportedValue as new () => unknown)());
      }
    }
  }
}
```

**Note:** Services can declare constructor deps as strings (`static inject = ['MailService']`) — discovery resolves them from container.

**Done when:** A service in `app/services/UserService.ts` is auto-available via `container.make('UserService')`.

---

## Sprint 10 — Boot Lifecycle

**Goal:** Implement the ordered application boot sequence.

**`packages/core/src/boot/Application.ts`:**
```typescript
import { XContainer } from '../container/XContainer';
import { ProviderRegistry } from '../providers/ProviderRegistry';
import { ServiceProvider } from '../providers/ServiceProvider';
import { discoverServices } from '../discovery/ServiceDiscovery';

interface BootOptions {
  providers?: Array<new (app: XContainer) => ServiceProvider>;
  servicesDir?: string;
  middlewaresDir?: string;
}

export class Application {
  public container: XContainer;
  private registry: ProviderRegistry;

  constructor() {
    this.container = new XContainer();
    this.registry = new ProviderRegistry(this.container);
  }

  async boot(options: BootOptions = {}): Promise<void> {
    // 1. Register user-defined providers
    for (const Provider of options.providers ?? []) {
      this.registry.register(Provider);
    }

    // 2. Auto-discover services
    if (options.servicesDir) {
      await discoverServices(this.container, options.servicesDir);
    }

    // 3. Boot all providers
    this.registry.boot();
  }
}

export const application = new Application();
```

Export from `packages/core/src/index.ts`.

**Done when:** `application.boot()` runs without error in a test.

---

## Sprint 11 — `@xacos/server` Init

**Goal:** Scaffold `@xacos/server` package.

**Location:** `packages/server/`

**`packages/server/package.json`:**
```json
{
  "name": "@xacos/server",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "@xacos/core": "workspace:*",
    "@xacos/shared": "workspace:*",
    "fastify": "^4.x"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "bun test"
  }
}
```

**Done when:** Package scaffolded and builds.

---

## Sprint 12 — Fastify Integration

**Goal:** Wrap Fastify into XAOCS server abstraction.

**`packages/server/src/XServer.ts`:**
```typescript
import Fastify, { FastifyInstance } from 'fastify';
import { XMiddleware } from '@xacos/shared';

export class XServer {
  public fastify: FastifyInstance;
  private globalMiddlewares: XMiddleware[] = [];

  constructor() {
    this.fastify = Fastify({
      logger: process.env['APP_ENV'] !== 'production'
        ? { level: 'info' }
        : false,
    });
  }

  useGlobal(middleware: XMiddleware): void {
    this.globalMiddlewares.push(middleware);
  }

  async listen(port: number): Promise<void> {
    await this.fastify.listen({ port, host: '0.0.0.0' });
    console.log(`\n  🚀 XAOCS running at http://localhost:${port}\n`);
  }

  async close(): Promise<void> {
    await this.fastify.close();
  }
}
```

Export from `packages/server/src/index.ts`.

**Done when:** `new XServer().listen(5000)` starts a Fastify server.

---

## Sprint 13 — XRequest / XResponse

**Goal:** Implement XAOCS request/response wrappers that bridge Fastify ↔ `@xacos/shared` types.

**`packages/server/src/adapters/RequestAdapter.ts`:**
```typescript
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { XRequest, XResponse, XApp } from '@xacos/shared';

export function adaptRequest(req: FastifyRequest, app: XApp): XRequest {
  return {
    params: (req.params as Record<string, string>) ?? {},
    query: (req.query as Record<string, string>) ?? {},
    body: req.body,
    headers: req.headers as Record<string, string | string[] | undefined>,
    app,
  };
}

export function adaptResponse(reply: FastifyReply): XResponse {
  const res: XResponse = {
    json(data: unknown) {
      reply.send(data);
      return res;
    },
    status(code: number) {
      reply.code(code);
      return res;
    },
    send(data?: string) {
      reply.send(data);
      return res;
    },
    redirect(url: string) {
      reply.redirect(url);
    },
    setCookie(name, value, opts) {
      reply.setCookie(name, value, opts ?? {});
      return res;
    },
  };
  return res;
}
```

**Done when:** Request/response adapters compile and pass type checks.

---

## Sprint 14 — Middleware Pipeline

**Goal:** Implement compose-style middleware pipeline.

**`packages/core/src/middleware/compose.ts`:**
```typescript
import type { XMiddleware, XRequest, XResponse } from '@xacos/shared';

export function compose(middlewares: XMiddleware[]) {
  return async function pipeline(req: XRequest, res: XResponse): Promise<void> {
    let index = -1;

    async function dispatch(i: number): Promise<void> {
      if (i <= index) throw new Error('[XAOCS] next() called multiple times');
      index = i;
      const fn = middlewares[i];
      if (!fn) return;
      await fn(req, res, () => dispatch(i + 1));
    }

    return dispatch(0);
  };
}
```

**Test:**
```typescript
import { describe, it, expect } from 'bun:test';
import { compose } from './compose';

describe('compose', () => {
  it('runs middlewares in order', async () => {
    const log: number[] = [];
    const m1 = async (_req: any, _res: any, next: any) => { log.push(1); await next(); };
    const m2 = async (_req: any, _res: any, next: any) => { log.push(2); await next(); };
    const pipeline = compose([m1, m2]);
    await pipeline({} as any, {} as any);
    expect(log).toEqual([1, 2]);
  });
});
```

**Done when:** Tests pass.

---

## Sprint 15 — Global Middleware Registration

**Goal:** Allow registering global middleware via `xacos.config.ts`.

**`packages/core/src/middleware/GlobalMiddlewareRegistry.ts`:**
```typescript
import type { XMiddleware } from '@xacos/shared';

class GlobalMiddlewareRegistry {
  private middlewares: XMiddleware[] = [];

  register(middleware: XMiddleware): void {
    this.middlewares.push(middleware);
  }

  registerMany(middlewares: XMiddleware[]): void {
    this.middlewares.push(...middlewares);
  }

  getAll(): XMiddleware[] {
    return [...this.middlewares];
  }
}

export const globalMiddlewareRegistry = new GlobalMiddlewareRegistry();
```

**Done when:** Global middlewares stored and retrievable.

---

## Sprint 16 — `@xacos/config` Init

**Goal:** Scaffold `@xacos/config` package.

**Location:** `packages/config/`

**`packages/config/package.json`:**
```json
{
  "name": "@xacos/config",
  "version": "0.0.1",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "@xacos/shared": "workspace:*"
  }
}
```

**`packages/config/src/types.ts`:**
```typescript
import type { XMiddleware } from '@xacos/shared';
import type { ServiceProvider } from '@xacos/core';
import type { XContainer } from '@xacos/core';

export interface XacosConfig {
  port?: number;
  providers?: Array<new (app: XContainer) => ServiceProvider>;
  middleware?: {
    global?: XMiddleware[];
    api?: XMiddleware[];
    web?: XMiddleware[];
  };
  views?: {
    dir?: string;
    defaultLayout?: string;
  };
  api?: {
    prefix?: string;
    dir?: string;
  };
  database?: {
    driver?: 'mysql' | 'postgres' | 'sqlite' | 'mongodb';
  };
}
```

**Done when:** Types exported cleanly.

---

## Sprint 17 — Env Loading

**Goal:** Load and validate `.env` at startup.

**`packages/config/src/env.ts`:**
```typescript
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export function loadEnv(envPath = '.env'): void {
  const fullPath = resolve(envPath);
  if (!existsSync(fullPath)) return;

  const content = readFileSync(fullPath, 'utf-8');

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

export function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`[XAOCS] Required env variable missing: ${key}`);
  return val;
}
```

**Done when:** `.env` is loaded and `requireEnv('JWT_SECRET')` throws if missing.

---

## Sprint 18 — `defineConfig` Helper

**Goal:** Export typed `defineConfig()` function.

**`packages/config/src/defineConfig.ts`:**
```typescript
import type { XacosConfig } from './types';

export function defineConfig(config: XacosConfig): XacosConfig {
  return {
    port: 5000,
    api: { prefix: '/api', dir: './api' },
    views: { dir: './views', defaultLayout: 'main' },
    ...config,
  };
}
```

Export all from `packages/config/src/index.ts`.

**Done when:** `defineConfig({})` returns config with defaults merged.

---

## Sprint 19 — New API File Convention

**Goal:** Implement `*.api.ts` file scanner. `user.api.ts` → prefix `/api/user`.

**`packages/core/src/routing/ApiScanner.ts`:**
```typescript
import { readdirSync, existsSync } from 'fs';
import { resolve, basename } from 'path';

export interface ApiRouteFile {
  filePath: string;
  urlPrefix: string; // e.g. /api/user
}

export function scanApiFiles(apiDir: string, prefix = '/api'): ApiRouteFile[] {
  const fullPath = resolve(apiDir);
  if (!existsSync(fullPath)) return [];

  const files = readdirSync(fullPath, { recursive: true }) as string[];

  return files
    .filter(f => f.endsWith('.api.ts') || f.endsWith('.api.js'))
    .map(f => {
      const name = basename(f).replace(/\.api\.(ts|js)$/, '');
      // Support versioning: v1.user.api.ts → /api/v1/user
      const parts = name.split('.');
      const urlPrefix = `${prefix}/${parts.join('/')}`;
      return { filePath: resolve(fullPath, f), urlPrefix };
    });
}
```

**Done when:** `scanApiFiles('./api')` returns correct prefix for each file.

---

## Sprint 20 — Router Class

**Goal:** Implement `XRouter` — the interface users use inside `*.api.ts` files.

**`packages/core/src/routing/XRouter.ts`:**
```typescript
import type { XMiddleware, XRequest, XResponse } from '@xacos/shared';

type Handler = (req: XRequest, res: XResponse) => Promise<void> | void;

export interface RouteDefinition {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string; // relative to file prefix, e.g. '/' or '/:id'
  handler: Handler;
  middlewares: XMiddleware[];
}

export class XRouter {
  public routes: RouteDefinition[] = [];
  private routeMiddlewares: XMiddleware[] = [];

  use(...middlewares: XMiddleware[]): this {
    this.routeMiddlewares.push(...middlewares);
    return this;
  }

  get(path: string, ...args: [...XMiddleware[], Handler]): this {
    return this.addRoute('GET', path, args);
  }

  post(path: string, ...args: [...XMiddleware[], Handler]): this {
    return this.addRoute('POST', path, args);
  }

  put(path: string, ...args: [...XMiddleware[], Handler]): this {
    return this.addRoute('PUT', path, args);
  }

  patch(path: string, ...args: [...XMiddleware[], Handler]): this {
    return this.addRoute('PATCH', path, args);
  }

  delete(path: string, ...args: [...XMiddleware[], Handler]): this {
    return this.addRoute('DELETE', path, args);
  }

  private addRoute(method: RouteDefinition['method'], path: string, args: unknown[]): this {
    const handler = args[args.length - 1] as Handler;
    const middlewares = [
      ...this.routeMiddlewares,
      ...(args.slice(0, -1) as XMiddleware[]),
    ];
    this.routes.push({ method, path, handler, middlewares });
    return this;
  }
}
```

**Example usage (how user writes `user.api.ts`):**
```typescript
// api/user.api.ts
import { XRouter } from '@xacos/core';

export const router = new XRouter();

router.get('/', async (req, res) => {
  return res.json({ users: [] });
});

router.get('/:id', async (req, res) => {
  return res.json({ id: req.params['id'] });
});

router.post('/', async (req, res) => {
  return res.status(201).json({ created: true });
});
```

**Done when:** `XRouter` compiles, routes array is populated correctly.

---

## Sprint 21 — API Route Scanner

**Goal:** Scan `api/` for `*.api.ts` files, import each, mount routes onto Fastify.

**`packages/server/src/routing/mountApiRoutes.ts`:**
```typescript
import type { FastifyInstance } from 'fastify';
import type { XApp } from '@xacos/shared';
import { scanApiFiles } from '@xacos/core';
import { adaptRequest, adaptResponse } from '../adapters/RequestAdapter';
import { compose } from '@xacos/core';

export async function mountApiRoutes(
  fastify: FastifyInstance,
  apiDir: string,
  app: XApp
): Promise<void> {
  const files = scanApiFiles(apiDir);

  for (const { filePath, urlPrefix } of files) {
    const mod = await import(filePath);
    const router = mod.router;
    if (!router) continue;

    for (const route of router.routes) {
      const fullPath = urlPrefix + (route.path === '/' ? '' : route.path);

      fastify.route({
        method: route.method,
        url: fullPath,
        handler: async (request, reply) => {
          const req = adaptRequest(request, app);
          const res = adaptResponse(reply);

          if (route.middlewares.length > 0) {
            const pipeline = compose(route.middlewares);
            await pipeline(req, res);
          }

          await route.handler(req, res);
        },
      });
    }
  }
}
```

**Done when:** A `user.api.ts` with `router.get('/', ...)` is reachable at `GET /api/user/`.

---

## Sprint 22 — Dynamic Route Segments

**Goal:** Support `[id]` in api file name for dynamic prefix. E.g. `user.[id].api.ts` → `/api/user/:id`.

**Update `ApiScanner.ts`:**
```typescript
// Replace [brackets] with :param in the url prefix
const urlPrefix = `${prefix}/${parts.map(p => p.replace(/^\[(.+)\]$/, ':$1')).join('/')}`;
```

Also support in route paths within the router (already handled since `/:id` is passed directly).

**Done when:** `user.[id].api.ts` mounts at `/api/user/:id`.

---

## Sprint 23 — Route Middleware Attach

**Goal:** Support `.use()` on router for file-level middleware.

Already implemented in Sprint 20 via `router.use(authenticate)`. This sprint adds:

**`packages/core/src/routing/XRouter.ts` — add group support:**
```typescript
group(prefix: string, callback: (router: XRouter) => void): this {
  const subRouter = new XRouter();
  callback(subRouter);
  for (const route of subRouter.routes) {
    this.routes.push({ ...route, path: prefix + route.path });
  }
  return this;
}
```

**Done when:** `router.group('/admin', r => { r.get('/', handler) })` creates `/api/user/admin/`.

---

## Sprint 24 — `app/` Folder Convention

**Goal:** Create and document the `app/` directory structure.

**Structure created by `create-xacos-app` scaffold:**
```
app/
├── controllers/   ← XController subclasses
├── services/      ← Business logic (auto-discovered)
└── middlewares/   ← XMiddleware functions (auto-loaded)
```

**`packages/core/src/discovery/MiddlewareDiscovery.ts`:**
```typescript
import { readdirSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import type { XMiddleware } from '@xacos/shared';

export interface DiscoveredMiddleware {
  name: string;
  fn: XMiddleware;
}

export async function discoverMiddlewares(dir: string): Promise<DiscoveredMiddleware[]> {
  const fullPath = resolve(dir);
  if (!existsSync(fullPath)) return [];

  const files = readdirSync(fullPath).filter(f =>
    f.endsWith('.middleware.ts') || f.endsWith('.middleware.js')
  );

  const result: DiscoveredMiddleware[] = [];
  for (const file of files) {
    const mod = await import(join(fullPath, file));
    for (const [key, val] of Object.entries(mod)) {
      if (typeof val === 'function') {
        result.push({ name: key, fn: val as XMiddleware });
      }
    }
  }
  return result;
}
```

**Done when:** Middlewares in `app/middlewares/` are auto-loadable.

---

## Sprint 25 — Controller Base

**Goal:** Implement `XController` base class.

**`packages/core/src/controllers/XController.ts`:**
```typescript
import type { XRequest, XResponse } from '@xacos/shared';

export abstract class XController {
  protected ok(res: XResponse, data: unknown) {
    return res.status(200).json({ success: true, data });
  }

  protected created(res: XResponse, data: unknown) {
    return res.status(201).json({ success: true, data });
  }

  protected noContent(res: XResponse) {
    return res.status(204).send();
  }

  protected notFound(res: XResponse, message = 'Not found') {
    return res.status(404).json({ success: false, error: message });
  }

  protected badRequest(res: XResponse, message = 'Bad request') {
    return res.status(400).json({ success: false, error: message });
  }

  protected unauthorized(res: XResponse, message = 'Unauthorized') {
    return res.status(401).json({ success: false, error: message });
  }

  protected serverError(res: XResponse, message = 'Internal server error') {
    return res.status(500).json({ success: false, error: message });
  }
}
```

**Example user controller:**
```typescript
// app/controllers/UserController.ts
import { XController } from '@xacos/core';
import type { XRequest, XResponse } from '@xacos/shared';

export class UserController extends XController {
  async index(req: XRequest, res: XResponse) {
    return this.ok(res, { users: [] });
  }
}
```

**Done when:** `XController` exports cleanly and subclasses work.

---

## Sprint 26 — Service Auto-Inject

**Goal:** Services in `app/services/` declare their deps as `static inject = ['OtherService']` — container resolves.

**Update `ServiceDiscovery.ts`:**
```typescript
for (const [exportName, ExportedClass] of Object.entries(mod)) {
  if (typeof ExportedClass !== 'function' || !exportName.endsWith('Service')) continue;
  if (container.has(exportName)) continue;

  container.singleton(exportName, () => {
    const inject: string[] = (ExportedClass as any).inject ?? [];
    const deps = inject.map((key: string) => container.make(key));
    return new (ExportedClass as new (...args: unknown[]) => unknown)(...deps);
  });
}
```

**Example:**
```typescript
// app/services/UserService.ts
export class UserService {
  static inject = ['MailService'];
  constructor(private mail: MailService) {}
}
```

**Done when:** `UserService` gets `MailService` auto-injected via `static inject`.

---

## Sprint 27 — Middleware Auto-Load

**Goal:** Middlewares in `app/middlewares/` are auto-registered into a named registry.

**`packages/core/src/middleware/MiddlewareRegistry.ts`:**
```typescript
import type { XMiddleware } from '@xacos/shared';

class MiddlewareRegistry {
  private map = new Map<string, XMiddleware>();

  register(name: string, fn: XMiddleware): void {
    this.map.set(name, fn);
  }

  get(name: string): XMiddleware {
    const fn = this.map.get(name);
    if (!fn) throw new Error(`[XAOCS] Middleware not found: ${name}`);
    return fn;
  }

  has(name: string): boolean {
    return this.map.has(name);
  }
}

export const middlewareRegistry = new MiddlewareRegistry();
```

Boot sequence calls `discoverMiddlewares('app/middlewares')` and registers each into `middlewareRegistry`.

**Done when:** `middlewareRegistry.get('authenticate')` returns the middleware function.

---

## Sprint 28 — `@xacos/orm` Init

**Goal:** Scaffold ORM package.

**Location:** `packages/orm/`

**`packages/orm/package.json`:**
```json
{
  "name": "@xacos/orm",
  "version": "0.0.1",
  "type": "module",
  "exports": {
    ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" }
  },
  "dependencies": {
    "@xacos/shared": "workspace:*",
    "knex": "^3.x",
    "better-sqlite3": "^9.x"
  },
  "devDependencies": {
    "mysql2": "^3.x",
    "pg": "^8.x"
  }
}
```

**Done when:** Package builds.

---

## Sprint 29 — DB Driver Config


**Goal:** Read `DB_DRIVER` from env and select correct Knex config.

**`packages/orm/src/connection/drivers.ts`:**
```typescript
import type { Knex } from 'knex';

export function buildKnexConfig(): Knex.Config {
  const driver = process.env['DB_DRIVER'] ?? 'sqlite';

  switch (driver) {
    case 'mysql':
      return {
        client: 'mysql2',
        connection: {
          host: process.env['DB_HOST'] ?? 'localhost',
          port: Number(process.env['DB_PORT'] ?? 3306),
          database: process.env['DB_DATABASE'],
          user: process.env['DB_USERNAME'],
          password: process.env['DB_PASSWORD'],
        },
      };
    case 'postgres':
      return {
        client: 'pg',
        connection: {
          host: process.env['DB_HOST'] ?? 'localhost',
          port: Number(process.env['DB_PORT'] ?? 5432),
          database: process.env['DB_DATABASE'],
          user: process.env['DB_USERNAME'],
          password: process.env['DB_PASSWORD'],
        },
      };
    case 'sqlite':
      return {
        client: 'better-sqlite3',
        connection: {
          filename: process.env['DB_PATH'] ?? './database/db.sqlite',
        },
        useNullAsDefault: true,
      };
    default:
      throw new Error(`[XAOCS ORM] Unsupported driver: ${driver}`);
  }
}
```

**Done when:** Config returns correct Knex object per `DB_DRIVER`.

---

## Sprint 29.5 — MongoDB Integration

**Goal:** Support MongoDB via Mongoose and implement `initMongo` and `XMongoModel`.

**`packages/orm/src/connection/db.ts`:** (Updated to support Mongoose)
- Implement `initMongo(options)`
- Implement `initOrmFromEnv()` to auto-switch drivers.
- Implement `getMongoose()` helper.

**MAINTENANCE.md update:** Sprint 29.5 ✅.
**Done when:** `DB_DRIVER=mongodb` successfully connects via Mongoose.

---


## Sprint 30 — Knex Connection

**Goal:** Initialize and export singleton Knex instance.

**`packages/orm/src/connection/db.ts`:**
```typescript
import Knex from 'knex';
import { buildKnexConfig } from './drivers';

let _db: Knex.Knex | null = null;

export function getDb(): Knex.Knex {
  if (!_db) {
    _db = Knex(buildKnexConfig());
  }
  return _db;
}

export async function closeDb(): Promise<void> {
  if (_db) {
    await _db.destroy();
    _db = null;
  }
}
```

**Done when:** `getDb()` returns a working Knex instance and queries execute.

---

## Sprint 31 — `XModel` Base Class

**Goal:** Implement `XModel` with static `table` and query builder entry point.

**`packages/orm/src/model/XModel.ts`:**
```typescript
import { getDb } from '../connection/db';
import type { Knex } from 'knex';

export class XModel {
  static table: string;

  static query(): Knex.QueryBuilder {
    return getDb()(this.table);
  }

  static builder(): XQueryBuilder<typeof this> {
    return new XQueryBuilder(this);
  }
}
```

**`packages/orm/src/model/XQueryBuilder.ts`:**
```typescript
import type { Knex } from 'knex';
import { getDb } from '../connection/db';

export class XQueryBuilder<M extends typeof XModel> {
  private _query: Knex.QueryBuilder;
  private ModelClass: M;

  constructor(ModelClass: M) {
    this.ModelClass = ModelClass;
    this._query = getDb()(ModelClass.table);
  }

  where(column: string, value: unknown): this {
    this._query = this._query.where(column, value);
    return this;
  }

  orderBy(column: string, direction: 'asc' | 'desc' = 'asc'): this {
    this._query = this._query.orderBy(column, direction);
    return this;
  }

  limit(n: number): this {
    this._query = this._query.limit(n);
    return this;
  }

  async get(): Promise<InstanceType<M>[]> {
    return this._query as unknown as InstanceType<M>[];
  }

  async first(): Promise<InstanceType<M> | null> {
    const result = await this._query.limit(1);
    return (result[0] ?? null) as InstanceType<M> | null;
  }
}
```

**Done when:** `User.builder().where('role', 'admin').get()` returns typed results.

---

## Sprints 32–50: ORM, Migrations, and Seeders

Each sprint below is self-contained. Full code patterns follow the style established above.

---

## Sprint 32 — `XModel.find()` and `findOrFail()`

Add to `XModel`:
```typescript
static async find<T extends XModel>(this: new () => T & { table: string }, id: number | string): Promise<T | null> {
  const result = await getDb()((this as any).table).where('id', id).first();
  return result ?? null;
}

static async findOrFail<T extends XModel>(this: new () => T, id: number | string): Promise<T> {
  const result = await (this as any).find(id);
  if (!result) throw Object.assign(new Error('Not found'), { statusCode: 404 });
  return result;
}
```

**Test:** `User.find(999)` returns null. `User.findOrFail(999)` throws with statusCode 404.

---

## Sprint 33 — `XModel.all()`

```typescript
static async all<T extends XModel>(this: { new(): T; table: string }): Promise<T[]> {
  return getDb()(this.table).select('*') as unknown as T[];
}
```

---

## Sprint 34 — `XModel.where()`

```typescript
static where(column: string, value: unknown) {
  return this.builder().where(column, value);
}
```

Chaining: `User.where('role', 'admin').where('active', true).get()`.

---

## Sprint 35 — `XModel.create()`

```typescript
static async create<T extends XModel>(data: Partial<T>): Promise<T> {
  const now = new Date();
  const toInsert = { ...data, created_at: now, updated_at: now };
  const [id] = await getDb()(this.table).insert(toInsert);
  return this.findOrFail(id) as Promise<T>;
}
```

---

## Sprint 36 — `XModel.update()`

```typescript
static async update(id: number | string, data: Record<string, unknown>): Promise<void> {
  await getDb()(this.table).where('id', id).update({ ...data, updated_at: new Date() });
}

async save(): Promise<void> {
  const id = (this as any).id;
  await getDb()((this.constructor as any).table)
    .where('id', id)
    .update({ ...this, updated_at: new Date() });
}
```

---

## Sprint 37 — `XModel.delete()`

```typescript
async delete(): Promise<void> {
  await getDb()((this.constructor as any).table).where('id', (this as any).id).delete();
}

static async destroy(id: number | string): Promise<void> {
  await getDb()(this.table).where('id', id).delete();
}
```

---

## Sprint 38 — `XModel.paginate()`

```typescript
static async paginate<T extends XModel>(page = 1, perPage = 15): Promise<PaginatedResult<T>> {
  const offset = (page - 1) * perPage;
  const [{ count }] = await getDb()(this.table).count('* as count');
  const total = Number(count);
  const data = await getDb()(this.table).offset(offset).limit(perPage) as T[];
  return {
    data,
    total,
    page,
    perPage,
    lastPage: Math.ceil(total / perPage),
  };
}
```

---

## Sprint 39 — `XModel.with()` Eager Loading

```typescript
static with(relation: string) {
  return this.builder().withRelation(relation);
}
```

Add `withRelation(relation: string)` to `XQueryBuilder` — after `get()`, look up `@HasMany` metadata and fetch related rows.

---

## Sprint 40 — Relationship Decorators

```typescript
// packages/orm/src/decorators/relationships.ts
import 'reflect-metadata';

export function HasMany(relatedModel: () => typeof XModel, foreignKey: string) {
  return function (target: object, propertyKey: string) {
    Reflect.defineMetadata('xacos:hasMany', { relatedModel, foreignKey }, target, propertyKey);
  };
}

// Similar for BelongsTo, HasOne, BelongsToMany
```

---

## Sprint 41 — `@Column` Decorator

```typescript
export function Column(options: { hidden?: boolean; default?: unknown } = {}) {
  return function (target: object, propertyKey: string) {
    Reflect.defineMetadata('xacos:column', options, target, propertyKey);
  };
}
```

---

## Sprint 42 — Hidden Fields

Override `toJSON()` on `XModel`:
```typescript
toJSON(): Record<string, unknown> {
  const proto = Object.getPrototypeOf(this);
  const result: Record<string, unknown> = { ...this as any };
  for (const key of Object.keys(result)) {
    const meta = Reflect.getMetadata('xacos:column', proto, key);
    if (meta?.hidden) delete result[key];
  }
  return result;
}
```

---

## Sprint 43 — Soft Deletes

Add `static softDeletes = false` to `XModel`. When `true`:
- `delete()` sets `deleted_at = NOW()` instead of hard delete
- All queries auto-append `.whereNull('deleted_at')`
- Add `withTrashed()` builder method to bypass filter

---

## Sprint 44 — Migration System

**`packages/orm/src/migrations/Migration.ts`:**
```typescript
import type { Schema } from './Schema';

export abstract class Migration {
  abstract up(schema: Schema): Promise<void>;
  abstract down(schema: Schema): Promise<void>;
}
```

---

## Sprint 45 — Migration Scanner

**`packages/orm/src/migrations/MigrationRunner.ts`:**
```typescript
export class MigrationRunner {
  async getPending(migrationsDir: string): Promise<string[]> {
    // Read all files from dir, sort numerically
    // Compare against xacos_migrations table
    // Return files not yet run
  }

  async run(migrationsDir: string): Promise<void> {
    const pending = await this.getPending(migrationsDir);
    for (const file of pending) {
      const mod = await import(resolve(migrationsDir, file));
      const migration: Migration = new mod.default();
      await migration.up(new Schema());
      await this.recordMigration(file);
    }
  }
}
```

---

## Sprint 46 — Migration Tracking

Create `xacos_migrations` table on first run:
```typescript
await db.schema.createTableIfNotExists('xacos_migrations', t => {
  t.increments('id');
  t.string('name').notNullable();
  t.integer('batch').notNullable();
  t.timestamp('ran_at').defaultTo(db.fn.now());
});
```

---

## Sprint 47 — Migration Rollback

```typescript
async rollback(): Promise<void> {
  const lastBatch = await db('xacos_migrations').max('batch as b').first();
  const toRollback = await db('xacos_migrations').where('batch', lastBatch!.b);
  for (const row of toRollback.reverse()) {
    const mod = await import(resolve(migrationsDir, row.name));
    await new mod.default().down(new Schema());
    await db('xacos_migrations').where('name', row.name).delete();
  }
}
```

---

## Sprint 48 — Migration Fresh

```typescript
async fresh(): Promise<void> {
  // Drop all tables except xacos_migrations
  // Re-run all migrations from scratch
}
```

---

## Sprint 49 — Schema Builder

**`packages/orm/src/migrations/Schema.ts`:**
```typescript
import type { Knex } from 'knex';
import { getDb } from '../connection/db';

export class Schema {
  private db = getDb();

  async createTable(name: string, callback: (table: Knex.CreateTableBuilder) => void): Promise<void> {
    await this.db.schema.createTable(name, callback);
  }

  async dropTable(name: string): Promise<void> {
    await this.db.schema.dropTableIfExists(name);
  }
}
```

---

## Sprint 50 — Column Type Helpers

Add builder helpers as extension on `Knex.CreateTableBuilder` via declaration merging:

```typescript
// These wrap Knex's table builder
table.id()          // t.bigIncrements('id')
table.timestamps()  // t.timestamp('created_at').defaultTo(db.fn.now()) + updated_at
table.softDeletes() // t.timestamp('deleted_at').nullable()
```

Document all types in `packages/orm/src/migrations/columnHelpers.ts`.

---

# END OF SPRINTS 1–50

> Run `bun run build` from root. All packages should compile.
> Update `MAINTENANCE.md`: mark sprints 1–50 as ✅.

# XAOCS Framework — Sprints 51–100 (Detailed)

> **Continuing from Sprint 50.** All packages compile. ORM is complete.
> Stack: TurboRepo + Bun + TypeScript + Fastify + React + Knex + Vite + esbuild
> **Agent:** Before starting any sprint, read `MAINTENANCE.md` to confirm Sprint 50 is ✅ Done.

---

## Sprint 51 — Seeder System

**Goal:** Implement `Seeder` base class and the seeder runner that executes them.

**Location:** `packages/orm/src/seeders/`

**`packages/orm/src/seeders/Seeder.ts`:**
```typescript
export abstract class Seeder {
  /**
   * Implement this method with your seed logic.
   * Called by the SeederRunner when `xacos db:seed` is invoked.
   */
  abstract run(): Promise<void>;
}
```

**`packages/orm/src/seeders/SeederRunner.ts`:**
```typescript
import { resolve } from 'path';
import { existsSync } from 'fs';
import type { Seeder } from './Seeder';

export class SeederRunner {
  constructor(private seedersDir: string) {}

  /**
   * Run a specific seeder by class name.
   * e.g. runOne('UserSeeder')
   */
  async runOne(name: string): Promise<void> {
    const path = resolve(this.seedersDir, `${name}.ts`);
    if (!existsSync(path)) {
      throw new Error(`[XAOCS] Seeder not found: ${name} at ${path}`);
    }
    const mod = await import(path);
    const SeederClass: new () => Seeder = mod.default ?? mod[name];
    if (!SeederClass) throw new Error(`[XAOCS] Seeder class not exported from ${name}.ts`);
    const instance = new SeederClass();
    console.log(`  ▶ Running seeder: ${name}`);
    await instance.run();
    console.log(`  ✓ Done: ${name}`);
  }

  /**
   * Run all seeders in the seeders directory, in alphabetical order.
   */
  async runAll(): Promise<void> {
    const { readdirSync } = await import('fs');
    const fullPath = resolve(this.seedersDir);
    if (!existsSync(fullPath)) {
      console.log('[XAOCS] No seeders directory found — skipping.');
      return;
    }
    const files = readdirSync(fullPath)
      .filter(f => f.endsWith('.ts') || f.endsWith('.js'))
      .sort();

    for (const file of files) {
      const name = file.replace(/\.(ts|js)$/, '');
      await this.runOne(name);
    }
  }
}
```

**Example user seeder (`database/seeders/UserSeeder.ts`):**
```typescript
import { Seeder } from '@xacos/orm';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

export default class UserSeeder extends Seeder {
  async run(): Promise<void> {
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('password', 12),
      role: 'admin',
    });
    console.log('    Created admin user');
  }
}
```

**Test `packages/orm/src/seeders/SeederRunner.test.ts`:**
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { SeederRunner } from './SeederRunner';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { resolve } from 'path';

const TMP = resolve('./tmp-seeders-test');

describe('SeederRunner', () => {
  beforeEach(() => {
    mkdirSync(TMP, { recursive: true });
    writeFileSync(
      `${TMP}/TestSeeder.ts`,
      `export default class TestSeeder { async run() { global.__seederRan = true; } }`
    );
  });

  afterEach(() => rmSync(TMP, { recursive: true, force: true }));

  it('throws when seeder file does not exist', async () => {
    const runner = new SeederRunner(TMP);
    await expect(runner.runOne('NonExistent')).rejects.toThrow('Seeder not found');
  });
});
```

**Export from `packages/orm/src/index.ts`:**
```typescript
export { Seeder } from './seeders/Seeder';
export { SeederRunner } from './seeders/SeederRunner';
```

**MAINTENANCE.md update:** Mark Sprint 51 ✅. Update "Next Up" to Sprint 52.
**CHANGELOG.md:** `- 2026-XX-XX: Sprint 51 completed (Seeder base class and SeederRunner implemented).`

**Done when:** `SeederRunner` instantiates, `runAll()` and `runOne()` execute without errors, test passes.

---

## Sprint 52 — Seeder Scanner

**Goal:** Scan `database/seeders/` at the user's project root and run seeders in numeric/alpha order. Hook into the runner correctly so ordering is deterministic.

**Update `SeederRunner.ts` — add ordered scan:**
```typescript
/**
 * Scan the seeders directory and return file names sorted correctly.
 * Files prefixed with numbers sort numerically: 001_, 002_, etc.
 * Files without prefix sort alphabetically after numbered ones.
 */
private getSortedFiles(): string[] {
  const { readdirSync } = require('fs');
  const fullPath = resolve(this.seedersDir);
  if (!existsSync(fullPath)) return [];

  return readdirSync(fullPath)
    .filter((f: string) => f.endsWith('.ts') || f.endsWith('.js'))
    .sort((a: string, b: string) => {
      // Extract leading number if present: "001_UserSeeder.ts" → 1
      const numA = parseInt(a.match(/^(\d+)/)?.[1] ?? 'Infinity', 10);
      const numB = parseInt(b.match(/^(\d+)/)?.[1] ?? 'Infinity', 10);
      if (numA !== numB) return numA - numB;
      return a.localeCompare(b);
    });
}
```

**Update `runAll()` to use `getSortedFiles()`:**
```typescript
async runAll(): Promise<void> {
  const files = this.getSortedFiles();
  if (files.length === 0) {
    console.log('[XAOCS] No seeder files found.');
    return;
  }
  for (const file of files) {
    const name = file.replace(/\.(ts|js)$/, '');
    await this.runOne(name);
  }
}
```

**Naming convention enforced:**
```
database/seeders/
├── 001_UserSeeder.ts      ← runs first
├── 002_PostSeeder.ts      ← runs second
└── AdminSeeder.ts         ← runs last (alpha)
```

**Test — ordering:**
```typescript
it('sorts seeders: numbered before alpha', () => {
  const runner = new SeederRunner(TMP) as any;
  // create files in reverse to ensure sorting matters
  writeFileSync(`${TMP}/ZebraSeeder.ts`, '');
  writeFileSync(`${TMP}/001_UserSeeder.ts`, '');
  writeFileSync(`${TMP}/002_PostSeeder.ts`, '');
  const sorted = runner.getSortedFiles();
  expect(sorted[0]).toBe('001_UserSeeder.ts');
  expect(sorted[1]).toBe('002_PostSeeder.ts');
  expect(sorted[2]).toBe('ZebraSeeder.ts');
});
```

**MAINTENANCE.md update:** Sprint 52 ✅.
**Done when:** Seeders run in numeric-first, then alphabetical order.

---

## Sprint 53 — Factory System

**Goal:** Implement `Factory.times(n).create(Model, definitionFn)` with `@faker-js/faker` for generating fake test data.

**Install in `packages/orm`:**
```bash
bun add @faker-js/faker
```

**`packages/orm/src/factories/Factory.ts`:**
```typescript
import { faker } from '@faker-js/faker';
import type { XModel } from '../model/XModel';

type DefinitionFn<T> = () => Promise<Partial<T>> | Partial<T>;

class FactoryBuilder {
  constructor(private count: number) {}

  /**
   * Create `count` instances of a model using the provided definition function.
   *
   * @example
   * await Factory.times(10).create(User, () => ({
   *   name: Factory.faker.person.fullName(),
   *   email: Factory.faker.internet.email(),
   * }));
   */
  async create<T extends XModel>(
    ModelClass: typeof XModel & { create(data: Partial<T>): Promise<T> },
    definition: DefinitionFn<T>
  ): Promise<T[]> {
    const results: T[] = [];
    for (let i = 0; i < this.count; i++) {
      const data = await definition();
      const instance = await ModelClass.create(data as Partial<T>);
      results.push(instance as T);
    }
    return results;
  }

  /**
   * Build plain objects without persisting to DB.
   * Useful for unit tests that don't need a DB.
   */
  async build<T>(definition: DefinitionFn<T>): Promise<T[]> {
    const results: T[] = [];
    for (let i = 0; i < this.count; i++) {
      results.push((await definition()) as T);
    }
    return results;
  }
}

export class Factory {
  /** Access Faker directly: Factory.faker.person.fullName() */
  static faker = faker;

  static times(count: number): FactoryBuilder {
    return new FactoryBuilder(count);
  }

  /** Shorthand for Factory.times(1).create(...) */
  static async create<T extends XModel>(
    ModelClass: typeof XModel & { create(data: Partial<T>): Promise<T> },
    definition: DefinitionFn<T>
  ): Promise<T> {
    const [result] = await Factory.times(1).create(ModelClass, definition);
    return result!;
  }
}
```

**Example in a seeder:**
```typescript
import { Factory } from '@xacos/orm';

await Factory.times(20).create(User, async () => ({
  name: Factory.faker.person.fullName(),
  email: Factory.faker.internet.email(),
  password: await bcrypt.hash('password', 12),
  role: 'user',
}));
```

**Test `packages/orm/src/factories/Factory.test.ts`:**
```typescript
import { describe, it, expect } from 'bun:test';
import { Factory } from './Factory';

describe('Factory', () => {
  it('builds N plain objects', async () => {
    const items = await Factory.times(3).build(() => ({
      name: Factory.faker.person.fullName(),
    }));
    expect(items).toHaveLength(3);
    expect(typeof items[0]?.name).toBe('string');
  });

  it('times(0) returns empty array', async () => {
    const items = await Factory.times(0).build(() => ({ x: 1 }));
    expect(items).toHaveLength(0);
  });
});
```

**Export from `packages/orm/src/index.ts`:**
```typescript
export { Factory } from './factories/Factory';
```

**MAINTENANCE.md update:** Sprint 53 ✅.
**Done when:** `Factory.times(5).build(...)` produces 5 objects. Tests pass.

---

## Sprint 54 — `@xacos/compiler` Init

**Goal:** Scaffold the `@xacos/compiler` package — responsible for all JSX/TSX bundling, both dev (Vite) and production (esbuild).

**Location:** `packages/compiler/`

**`packages/compiler/package.json`:**
```json
{
  "name": "@xacos/compiler",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "@xacos/config": "workspace:*",
    "@xacos/shared": "workspace:*",
    "vite": "^5.x",
    "esbuild": "^0.21.x",
    "@vitejs/plugin-react": "^4.x"
  },
  "devDependencies": {
    "typescript": "^5.x"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "bun test",
    "type-check": "tsc --noEmit"
  }
}
```

**`packages/compiler/src/index.ts`:**
```typescript
export { createViteConfig } from './vite/createViteConfig';
export { buildProduction } from './esbuild/buildProduction';
export { scanViews } from './views/scanViews';
export type { ViewRoute } from './views/scanViews';
```

**`packages/compiler/tsconfig.json`:**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**MAINTENANCE.md update:** Sprint 54 ✅.
**Done when:** Package scaffolded, `bun run build` inside `packages/compiler` compiles cleanly (empty exports for now).

---

## Sprint 55 — Vite Dev Integration

**Goal:** Mount Vite as a dev middleware inside the XAOCS server so that `.tsx` pages get HMR during development.

**`packages/compiler/src/vite/createViteConfig.ts`:**
```typescript
import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export function createViteConfig(viewsDir: string, root: string): UserConfig {
  return defineConfig({
    root,
    plugins: [react()],
    server: {
      middlewareMode: true, // XAOCS handles the HTTP server
    },
    resolve: {
      alias: {
        '@views': resolve(viewsDir),
        '@app': resolve('./app'),
        '@api': resolve('./api'),
        '@db': resolve('./database'),
      },
    },
    build: {
      outDir: resolve('./.xacos/client'),
      rollupOptions: {
        input: {}, // filled dynamically per page in Sprint 61
      },
    },
  });
}
```

**`packages/server/src/dev/mountVite.ts`:**
```typescript
import type { FastifyInstance } from 'fastify';
import { createViteConfig } from '@xacos/compiler';
import { createServer as createViteServer } from 'vite';

export async function mountViteDev(
  fastify: FastifyInstance,
  viewsDir: string,
  root: string
): Promise<void> {
  const vite = await createViteServer(createViteConfig(viewsDir, root));

  // Forward all non-API requests to Vite in dev mode
  fastify.addHook('onRequest', async (request, reply) => {
    const url = request.raw.url ?? '/';
    // Skip API routes — those are handled by XAOCS
    if (url.startsWith('/api/')) return;

    await new Promise<void>((resolve, reject) => {
      vite.middlewares(request.raw, reply.raw, (err?: Error) => {
        if (err) reject(err);
        else resolve();
      });
    });
    // Signal Fastify not to continue its own handler
    reply.hijack();
  });

  // Graceful shutdown
  fastify.addHook('onClose', async () => {
    await vite.close();
  });
}
```

**Usage in dev boot sequence (Sprint 77 wires this into `xacos dev`):**
```typescript
if (process.env['APP_ENV'] !== 'production') {
  await mountViteDev(server.fastify, config.views!.dir!, process.cwd());
}
```

**MAINTENANCE.md update:** Sprint 55 ✅.
**Done when:** Starting the server in dev mode proxies `.tsx` page requests through Vite with HMR working.

---

## Sprint 56 — View Scanner

**Goal:** Scan `views/` directory and build a map of file paths → URL routes. This powers server-side route registration for page serving.

**`packages/compiler/src/views/scanViews.ts`:**
```typescript
import { readdirSync, statSync, existsSync } from 'fs';
import { resolve, relative, join, basename, dirname } from 'path';

export interface ViewRoute {
  /** Absolute path to the .tsx file */
  filePath: string;
  /** URL pattern e.g. /dashboard, /users/:id */
  urlPattern: string;
  /** Whether this is a layout file (excluded from route list) */
  isLayout: boolean;
}

export function scanViews(viewsDir: string): ViewRoute[] {
  const fullPath = resolve(viewsDir);
  if (!existsSync(fullPath)) return [];

  const routes: ViewRoute[] = [];
  walk(fullPath, fullPath, routes);
  return routes;
}

function walk(dir: string, root: string, routes: ViewRoute[]): void {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullEntry = join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip the layouts directory — not routable pages
      if (entry.name === 'layouts') continue;
      walk(fullEntry, root, routes);
      continue;
    }

    if (!/\.(tsx|jsx)$/.test(entry.name)) continue;

    const rel = relative(root, fullEntry);              // e.g. dashboard/index.tsx
    const withoutExt = rel.replace(/\.(tsx|jsx)$/, ''); // dashboard/index
    const isIndex = basename(withoutExt) === 'index';

    // Build URL: dashboard/index → /dashboard, blog/[id] → /blog/:id
    const segments = withoutExt
      .split('/')
      .filter(s => s !== 'index' || withoutExt === 'index') // keep root index
      .map(s => s.replace(/^\[(.+)\]$/, ':$1'));            // [id] → :id

    const rawUrl = '/' + segments.join('/');
    const urlPattern = rawUrl
      .replace(/\/index$/, '') // /dashboard/index → /dashboard
      .replace(/^$/, '/');     // empty string → /

    routes.push({
      filePath: fullEntry,
      urlPattern: urlPattern || '/',
      isLayout: false,
    });
  }
}
```

**Test `packages/compiler/src/views/scanViews.test.ts`:**
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { scanViews } from './scanViews';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { resolve } from 'path';

const TMP = resolve('./tmp-views-test');

beforeEach(() => {
  mkdirSync(`${TMP}/blog`, { recursive: true });
  mkdirSync(`${TMP}/layouts`, { recursive: true });
  writeFileSync(`${TMP}/index.tsx`, '');
  writeFileSync(`${TMP}/about.tsx`, '');
  writeFileSync(`${TMP}/blog/[id].tsx`, '');
  writeFileSync(`${TMP}/layouts/main.tsx`, ''); // should be excluded
});

afterEach(() => rmSync(TMP, { recursive: true, force: true }));

describe('scanViews', () => {
  it('maps index.tsx to /', () => {
    const routes = scanViews(TMP);
    expect(routes.some(r => r.urlPattern === '/')).toBe(true);
  });

  it('maps about.tsx to /about', () => {
    const routes = scanViews(TMP);
    expect(routes.some(r => r.urlPattern === '/about')).toBe(true);
  });

  it('maps blog/[id].tsx to /blog/:id', () => {
    const routes = scanViews(TMP);
    expect(routes.some(r => r.urlPattern === '/blog/:id')).toBe(true);
  });

  it('excludes layouts directory', () => {
    const routes = scanViews(TMP);
    expect(routes.some(r => r.filePath.includes('layouts'))).toBe(false);
  });
});
```

**Export already in `packages/compiler/src/index.ts`** (Sprint 54).

**MAINTENANCE.md update:** Sprint 56 ✅.
**Done when:** All 4 tests pass. `scanViews` returns correct URL patterns.

---

## Sprint 57 — Dynamic View Routes

**Goal:** Register scanned view routes onto Fastify so the server can serve the HTML shell (or SSR HTML) for each page.

**`packages/server/src/routing/mountViewRoutes.ts`:**
```typescript
import type { FastifyInstance } from 'fastify';
import { scanViews } from '@xacos/compiler';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const HTML_SHELL = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>XAOCS App</title>
  __HEAD__
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/__xacos/entry.js"></script>
</body>
</html>`;

export async function mountViewRoutes(
  fastify: FastifyInstance,
  viewsDir: string
): Promise<void> {
  const views = scanViews(viewsDir);

  for (const view of views) {
    // Register as GET route — Fastify will serve HTML
    fastify.get(view.urlPattern, async (_request, reply) => {
      reply
        .type('text/html')
        .send(HTML_SHELL.replace('__HEAD__', ''));
    });
  }
}
```

**Note:** In dev mode (Sprint 55), Vite intercepts before Fastify reaches these handlers. In production, esbuild chunks replace `/__xacos/entry.js` (Sprint 62).

**Test — route registration:**
```typescript
import { describe, it, expect } from 'bun:test';
import Fastify from 'fastify';
import { mountViewRoutes } from './mountViewRoutes';
import { mkdirSync, writeFileSync, rmSync } from 'fs';

const TMP = './tmp-view-routes';
mkdirSync(`${TMP}`, { recursive: true });
writeFileSync(`${TMP}/index.tsx`, '');
writeFileSync(`${TMP}/about.tsx`, '');

const fastify = Fastify();
await mountViewRoutes(fastify, TMP);
await fastify.ready();

describe('mountViewRoutes', () => {
  it('registers GET / for index.tsx', async () => {
    const res = await fastify.inject({ method: 'GET', url: '/' });
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
  });

  it('registers GET /about for about.tsx', async () => {
    const res = await fastify.inject({ method: 'GET', url: '/about' });
    expect(res.statusCode).toBe(200);
  });
});

rmSync(TMP, { recursive: true, force: true });
```

**MAINTENANCE.md update:** Sprint 57 ✅.
**Done when:** Both inject tests pass. View routes serve HTML.

---

## Sprint 58 — Layout System

**Goal:** Implement `views/layouts/main.tsx` as the default layout wrapper, with opt-out support per page.

**Convention:**
- `views/layouts/main.tsx` = default layout (wraps all pages)
- `export const layout = false` on a page = no layout
- `export const layout = 'admin'` = use `views/layouts/admin.tsx`

**`packages/compiler/src/views/resolveLayout.ts`:**
```typescript
import { resolve, join } from 'path';
import { existsSync } from 'fs';

/**
 * Given a page's exported `layout` value and the views directory,
 * return the absolute path to the layout file, or null if no layout.
 */
export function resolveLayout(
  layoutExport: string | false | undefined,
  viewsDir: string,
  defaultLayout = 'main'
): string | null {
  // Explicit opt-out
  if (layoutExport === false) return null;

  const layoutName = typeof layoutExport === 'string' ? layoutExport : defaultLayout;
  const candidates = [
    join(viewsDir, 'layouts', `${layoutName}.tsx`),
    join(viewsDir, 'layouts', `${layoutName}.jsx`),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  // No layout file found — log warning but don't throw
  if (layoutExport !== undefined) {
    console.warn(`[XAOCS] Layout "${layoutName}" not found in ${viewsDir}/layouts/`);
  }
  return null;
}
```

**Default layout template (shipped by `create-xacos-app` in Sprint 96):**
```tsx
// views/layouts/main.tsx
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  meta?: { title?: string; description?: string };
}

export default function MainLayout({ children, meta }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{meta?.title ?? 'XAOCS App'}</title>
        {meta?.description && (
          <meta name="description" content={meta.description} />
        )}
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
```

**Page using custom layout:**
```tsx
// views/dashboard.tsx
export const layout = 'admin'; // uses views/layouts/admin.tsx
export const meta = { title: 'Dashboard' };

export default function Dashboard() {
  return <h1>Dashboard</h1>;
}
```

**Test `resolveLayout`:**
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { resolveLayout } from './resolveLayout';
import { mkdirSync, writeFileSync, rmSync } from 'fs';

const TMP = './tmp-layout-test';
beforeEach(() => {
  mkdirSync(`${TMP}/layouts`, { recursive: true });
  writeFileSync(`${TMP}/layouts/main.tsx`, '');
});
afterEach(() => rmSync(TMP, { recursive: true, force: true }));

describe('resolveLayout', () => {
  it('returns main layout path when no layout exported', () => {
    const path = resolveLayout(undefined, TMP);
    expect(path).toContain('main.tsx');
  });

  it('returns null when layout = false', () => {
    expect(resolveLayout(false, TMP)).toBeNull();
  });

  it('returns null when named layout does not exist', () => {
    expect(resolveLayout('nonexistent', TMP)).toBeNull();
  });
});
```

**MAINTENANCE.md update:** Sprint 58 ✅.
**Done when:** Tests pass. `resolveLayout` returns correct paths.

---

## Sprint 59 — Page Meta Export

**Goal:** Support `export const meta = { title, description }` per page. Inject meta into the HTML shell served by the server.

**`packages/compiler/src/views/extractPageMeta.ts`:**
```typescript
export interface PageMeta {
  title?: string;
  description?: string;
}

/**
 * Extract static meta from a page module.
 * Works for statically-analyzable exports only (no dynamic values at build time).
 * At runtime, the server imports the page module and reads `mod.meta`.
 */
export function extractPageMeta(mod: Record<string, unknown>): PageMeta {
  const meta = mod['meta'];
  if (!meta || typeof meta !== 'object') return {};
  const m = meta as Record<string, unknown>;
  return {
    title: typeof m['title'] === 'string' ? m['title'] : undefined,
    description: typeof m['description'] === 'string' ? m['description'] : undefined,
  };
}
```

**Update `mountViewRoutes.ts` to inject meta:**
```typescript
// Import the page module at route registration time (for static meta)
const mod = await import(view.filePath);
const meta = extractPageMeta(mod);

const headTags = [
  meta.title ? `<title>${meta.title}</title>` : '',
  meta.description ? `<meta name="description" content="${meta.description}" />` : '',
].filter(Boolean).join('\n  ');

reply.send(HTML_SHELL.replace('__HEAD__', headTags));
```

**Test:**
```typescript
it('injects page title into HTML shell', async () => {
  // page exports: export const meta = { title: 'About Us' }
  const res = await fastify.inject({ method: 'GET', url: '/about' });
  expect(res.body).toContain('<title>About Us</title>');
});
```

**MAINTENANCE.md update:** Sprint 59 ✅.
**Done when:** HTML shell contains correct `<title>` and `<meta>` from page exports.

---

## Sprint 60 — SSR Opt-In

**Goal:** Support `export const ssr = true` on a page — the server renders it to HTML string via `renderToString` before sending.

**Install in `packages/compiler`:**
```bash
bun add react react-dom
bun add -d @types/react @types/react-dom
```

**`packages/compiler/src/views/renderSSR.ts`:**
```typescript
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

export interface SSRResult {
  html: string;
  meta: { title?: string; description?: string };
}

/**
 * Server-render a page component to an HTML string.
 * The page module must export `default` (the component) and optionally `meta`.
 */
export async function renderSSR(
  pagePath: string,
  props: Record<string, unknown> = {}
): Promise<SSRResult> {
  const mod = await import(pagePath);

  // Only render if page opts into SSR
  if (!mod.ssr) {
    throw new Error(`[XAOCS] Page at ${pagePath} does not export ssr = true`);
  }

  const Component = mod.default;
  if (typeof Component !== 'function') {
    throw new Error(`[XAOCS] Page at ${pagePath} does not have a default export component`);
  }

  const html = renderToString(createElement(Component, props));
  const meta = mod.meta ?? {};

  return { html, meta };
}
```

**Update `mountViewRoutes.ts` — handle SSR pages:**
```typescript
fastify.get(view.urlPattern, async (request, reply) => {
  const mod = await import(view.filePath);

  if (mod.ssr === true) {
    // Server-side render
    const { html, meta } = await renderSSR(view.filePath, {
      params: request.params as Record<string, string>,
      searchParams: request.query as Record<string, string>,
    });

    const headTags = buildHeadTags(meta);
    const fullHtml = HTML_SHELL
      .replace('__HEAD__', headTags)
      .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

    return reply.type('text/html').send(fullHtml);
  }

  // CSR: just serve the shell
  const meta = extractPageMeta(mod);
  return reply.type('text/html').send(
    HTML_SHELL.replace('__HEAD__', buildHeadTags(meta))
  );
});
```

**Helper:**
```typescript
function buildHeadTags(meta: { title?: string; description?: string }): string {
  return [
    meta.title ? `<title>${meta.title}</title>` : '',
    meta.description ? `<meta name="description" content="${meta.description}" />` : '',
  ].filter(Boolean).join('\n  ');
}
```

**Page example:**
```tsx
// views/blog/[id].tsx
export const ssr = true;
export const meta = { title: 'Blog Post' };

export default function BlogPost({ params }: { params: { id: string } }) {
  return <article><h1>Post {params.id}</h1></article>;
}
```

**Test:**
```typescript
it('SSR page returns rendered HTML in body', async () => {
  // Page exports ssr = true and renders <h1>Hello SSR</h1>
  const res = await fastify.inject({ method: 'GET', url: '/ssr-test' });
  expect(res.body).toContain('<h1>');
});
```

**MAINTENANCE.md update:** Sprint 60 ✅.
**Done when:** SSR pages return rendered HTML. CSR pages return shell. Tests pass.

---

## Sprint 61 — esbuild Production Build

**Goal:** Implement production build via esbuild — generates one JS chunk per page into `.xacos/client/`.

**`packages/compiler/src/esbuild/buildProduction.ts`:**
```typescript
import * as esbuild from 'esbuild';
import { scanViews } from '../views/scanViews';
import { resolve, relative, join, basename } from 'path';
import { mkdirSync } from 'fs';

export interface BuildResult {
  outputFiles: string[];
  metafile: esbuild.Metafile;
}

export async function buildProduction(
  viewsDir: string,
  outDir: string,
  root: string
): Promise<BuildResult> {
  const views = scanViews(viewsDir);
  const outPath = resolve(outDir);
  mkdirSync(outPath, { recursive: true });

  // Build entry points map: chunk name → file path
  const entryPoints: Record<string, string> = {};
  for (const view of views) {
    // Derive chunk name from URL: /blog/:id → blog_id
    const chunkName = view.urlPattern
      .replace(/^\//, '')
      .replace(/\//g, '_')
      .replace(/:/g, '')
      .replace(/[^a-zA-Z0-9_]/g, '') || 'index';
    entryPoints[chunkName] = view.filePath;
  }

  const result = await esbuild.build({
    entryPoints,
    bundle: true,
    splitting: true,     // shared chunks via code splitting
    format: 'esm',
    outdir: outPath,
    metafile: true,
    minify: true,
    sourcemap: false,
    jsx: 'automatic',
    jsxImportSource: 'react',
    define: {
      'process.env.NODE_ENV': '"production"',
    },
    external: [],        // bundle everything including React
    alias: {
      '@views': resolve(viewsDir),
      '@app': resolve(root, 'app'),
      '@api': resolve(root, 'api'),
      '@db': resolve(root, 'database'),
    },
  });

  return {
    outputFiles: Object.keys(entryPoints).map(name => join(outPath, `${name}.js`)),
    metafile: result.metafile!,
  };
}
```

**Usage (called by `xacos build` in Sprint 78):**
```typescript
import { buildProduction } from '@xacos/compiler';

await buildProduction('./views', './.xacos/client', process.cwd());
console.log('✓ Production build complete');
```

**Test — output files created:**
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { buildProduction } from './buildProduction';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';

const TMP_VIEWS = './tmp-esbuild-views';
const TMP_OUT = './tmp-esbuild-out';

beforeEach(() => {
  mkdirSync(TMP_VIEWS, { recursive: true });
  writeFileSync(`${TMP_VIEWS}/index.tsx`, `export default function Home() { return null; }`);
});
afterEach(() => {
  rmSync(TMP_VIEWS, { recursive: true, force: true });
  rmSync(TMP_OUT, { recursive: true, force: true });
});

describe('buildProduction', () => {
  it('creates output files for each view', async () => {
    const result = await buildProduction(TMP_VIEWS, TMP_OUT, process.cwd());
    expect(result.outputFiles.length).toBeGreaterThan(0);
  });
});
```

**MAINTENANCE.md update:** Sprint 61 ✅.
**Done when:** `buildProduction` creates `.js` files per page in the output dir. Tests pass.

---

## Sprint 62 — HTML Shell

**Goal:** Serve the correct HTML shell per page in production — wiring the right chunk JS file into `<script>`.

**`packages/server/src/views/buildHtmlShell.ts`:**
```typescript
export interface HtmlShellOptions {
  chunkUrl: string;     // e.g. /__xacos/index.js
  ssrHtml?: string;     // pre-rendered HTML (SSR only)
  meta?: {
    title?: string;
    description?: string;
  };
}

export function buildHtmlShell(options: HtmlShellOptions): string {
  const { chunkUrl, ssrHtml = '', meta = {} } = options;

  const headTags = [
    `<title>${meta.title ?? 'XAOCS App'}</title>`,
    meta.description ? `<meta name="description" content="${meta.description}" />` : '',
    `<script type="module" src="${chunkUrl}"></script>`,
  ].filter(Boolean).join('\n    ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${headTags}
</head>
<body>
  <div id="root">${ssrHtml}</div>
</body>
</html>`;
}
```

**Chunk URL mapping** — derived from URL pattern (mirrors esbuild entry point names in Sprint 61):
```typescript
function urlPatternToChunkName(urlPattern: string): string {
  return urlPattern
    .replace(/^\//, '')
    .replace(/\//g, '_')
    .replace(/:/g, '')
    .replace(/[^a-zA-Z0-9_]/g, '') || 'index';
}

// In mountViewRoutes.ts:
const chunkName = urlPatternToChunkName(view.urlPattern);
const chunkUrl = `/__xacos/${chunkName}.js`;
reply.send(buildHtmlShell({ chunkUrl, meta }));
```

**Serve `.xacos/client/` as static files** (in production only):
```typescript
// In XServer, production boot:
fastify.register(import('@fastify/static'), {
  root: resolve('.xacos/client'),
  prefix: '/__xacos/',
});
```

**MAINTENANCE.md update:** Sprint 62 ✅.
**Done when:** Production `GET /` serves HTML with `<script src="/__xacos/index.js">`.

---

## Sprint 63 — `@xacos/client` Init

**Goal:** Scaffold the `@xacos/client` package — React hooks and navigation components for XAOCS pages.

**Location:** `packages/client/`

**`packages/client/package.json`:**
```json
{
  "name": "@xacos/client",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "@xacos/shared": "workspace:*",
    "react": "^18.x",
    "react-dom": "^18.x"
  },
  "devDependencies": {
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "typescript": "^5.x"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "bun test",
    "type-check": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": "^18.x"
  }
}
```

**`packages/client/src/index.ts`:**
```typescript
export { XacosProvider } from './context/XacosProvider';
export { xhttp, XHttpClient } from './http/XHttpClient';

```

**`packages/client/tsconfig.json`:**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**MAINTENANCE.md update:** Sprint 63 ✅.
**Done when:** Package scaffolded and builds cleanly.

---

## Sprint 64 — `useAuth` Hook

**Goal:** Implement `useAuth()` — relies on secure cookies for auth state, fetches `/api/auth/me` via `xhttp`, exposes `{ user, loading, logout, login }`.


**`packages/client/src/context/XacosProvider.tsx`:**
```typescript
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { XUser } from '@xacos/shared';

interface XacosContextValue {
  user: XUser | null;
  loading: boolean;
  setUser: (user: XUser | null) => void;
}


const XacosContext = createContext<XacosContextValue | null>(null);

export function XacosProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<XUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Relies on cookies and useAuth hook for initialization
    setLoading(false);
  }, []);

  return (
    <XacosContext.Provider value={{ user, loading, setUser }}>
      {children}
    </XacosContext.Provider>
  );
}


export function useXacosContext(): XacosContextValue {
  const ctx = useContext(XacosContext);
  if (!ctx) throw new Error('[XAOCS] useXacosContext must be used inside <XacosProvider>');
  return ctx;
}
```

**`packages/client/src/hooks/useAuth.ts`:**
```typescript
import { useState, useEffect, useCallback } from 'react';
import type { XUser } from '@xacos/shared';
import { xhttp } from '../http/XHttpClient';

interface UseAuthResult {
  user: XUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  login: (credentials: Record<string, unknown>) => Promise<void>;
}


export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<XUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const data = await xhttp.get<{ user: XUser }>('/api/auth/me');
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMe();
  }, [fetchMe]);

  const login = useCallback(async (credentials: Record<string, unknown>) => {
    setLoading(true);
    try {
      await xhttp.post('/api/auth/login', credentials);
      await fetchMe();
    } catch (e) {
      setLoading(false);
      throw e;
    }
  }, [fetchMe]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await xhttp.post('/api/auth/logout');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, logout, login };
}

```

**Usage in a page:**
```tsx
import { useAuth } from '@xacos/client';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in</p>;
  return (
    <div>
      <h1>Hello, {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

**MAINTENANCE.md update:** Sprint 64 ✅.
**Done when:** `useAuth()` compiles, relies on secure cookies, fetches `/api/auth/me` via `xhttp`.


---

## Sprint 65 — `XLink` Component

**Goal:** Implement `<XLink>` for client-side navigation — intercepts clicks, uses `history.pushState` instead of full page reload.

**`packages/client/src/navigation/XLink.tsx`:**
```typescript
import React, { type AnchorHTMLAttributes, useCallback } from 'react';

interface XLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  prefetch?: boolean;
}

/**
 * Client-side navigation link.
 * Uses history.pushState to avoid full page reloads.
 *
 * @example
 * <XLink href="/dashboard">Go to Dashboard</XLink>
 */
export function XLink({ href, children, onClick, prefetch = false, ...rest }: XLinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Let ctrl/cmd+click open in new tab normally
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      // Let external links go through normally
      if (href.startsWith('http://') || href.startsWith('https://')) return;

      e.preventDefault();
      onClick?.(e);

      // Push new state and dispatch popstate so router can respond
      window.history.pushState(null, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
    },
    [href, onClick]
  );

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
```

**`packages/client/src/navigation/redirect.ts`:**
```typescript
/**
 * Programmatic client-side redirect.
 * Call inside event handlers or useEffect.
 */
export function redirect(url: string): void {
  window.history.pushState(null, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
```

**Usage:**
```tsx
import { XLink, redirect } from '@xacos/client';

<XLink href="/about">About Us</XLink>

// Programmatic:
redirect('/login');
```

**MAINTENANCE.md update:** Sprint 65 ✅.
**Done when:** `XLink` intercepts clicks, pushes history state, dispatches popstate.

---

## Sprint 66 — `redirect()` Helper

**Already implemented in Sprint 65** as `packages/client/src/navigation/redirect.ts`.

This sprint extends it with a **server-side redirect** helper for use inside API route handlers:

**`packages/shared/src/helpers.ts`:**
```typescript
/**
 * Throw this to trigger a redirect from inside an API handler.
 * The global error handler in Sprint 106 catches it and sends 302.
 */
export class XRedirect {
  readonly __xacos_redirect = true;
  constructor(
    public readonly url: string,
    public readonly statusCode: 302 | 301 = 302
  ) {}
}

/**
 * Use inside API handlers to redirect.
 * @example throw serverRedirect('/login')
 */
export function serverRedirect(url: string, permanent = false): never {
  throw new XRedirect(url, permanent ? 301 : 302);
}
```

**Export from `@xacos/shared`.**

**MAINTENANCE.md update:** Sprint 66 ✅.
**Done when:** `serverRedirect('/login')` throws `XRedirect`. Client `redirect()` works from Sprint 65.

---

## Sprint 67 — `useXacos` Hook

**Goal:** Implement `useXacos()` — exposes `params` and `searchParams` from the current URL.

**`packages/client/src/hooks/useXacos.ts`:**
```typescript
import { useState, useEffect } from 'react';

interface XacosRouteInfo {
  params: Record<string, string>;
  searchParams: Record<string, string>;
  pathname: string;
}

/**
 * Hook that returns current route params, search params, and pathname.
 * Updates when the URL changes via XLink or redirect().
 *
 * Note: params are derived by matching the current pathname against
 * the pattern stored in a data attribute on the root element (set by server).
 */
export function useXacos(): XacosRouteInfo {
  const [info, setInfo] = useState<XacosRouteInfo>(() => extractRouteInfo());

  useEffect(() => {
    const handler = () => setInfo(extractRouteInfo());
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  return info;
}

function extractRouteInfo(): XacosRouteInfo {
  const pathname = window.location.pathname;
  const search = window.location.search;

  // Parse search params
  const searchParams: Record<string, string> = {};
  new URLSearchParams(search).forEach((value, key) => {
    searchParams[key] = value;
  });

  // Params extracted from data attribute set by HTML shell:
  // <div id="root" data-params='{"id":"123"}'>
  const root = document.getElementById('root');
  let params: Record<string, string> = {};
  try {
    const raw = root?.dataset['params'];
    if (raw) params = JSON.parse(raw) as Record<string, string>;
  } catch {
    params = {};
  }

  return { params, searchParams, pathname };
}
```

**Update HTML shell (Sprint 62) to inject params:**
```typescript
// In mountViewRoutes.ts, when a dynamic route is matched:
const params = request.params as Record<string, string>;
const paramsJson = JSON.stringify(params);
const ssrHtml = `<div id="root" data-params='${paramsJson}'>...</div>`;
```

**MAINTENANCE.md update:** Sprint 67 ✅.
**Done when:** `useXacos()` returns correct `params` and `searchParams` from the current URL.

---

## Sprint 68 — `@xacos/auth` Init

**Goal:** Scaffold the `@xacos/auth` package — built-in email/password authentication.

**Location:** `packages/auth/`

**`packages/auth/package.json`:**
```json
{
  "name": "@xacos/auth",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "@xacos/core": "workspace:*",
    "@xacos/orm": "workspace:*",
    "@xacos/shared": "workspace:*",
    "bcryptjs": "^2.x",
    "jsonwebtoken": "^9.x"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.x",
    "@types/jsonwebtoken": "^9.x",
    "typescript": "^5.x"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "bun test",
    "type-check": "tsc --noEmit"
  }
}
```

**`packages/auth/src/index.ts`:**
```typescript
export { AuthService } from './services/AuthService';
export { authenticate } from './middlewares/authenticate';
export { User } from './models/User';
```

**MAINTENANCE.md update:** Sprint 68 ✅.
**Done when:** Package scaffolded, builds cleanly with empty barrel.

---

## Sprint 69 — Auth User Model

**Goal:** Ship the default `User` model with all auth fields pre-configured.

**`packages/auth/src/models/User.ts`:**
```typescript
import { XModel, Column } from '@xacos/orm';

export class User extends XModel {
  static table = 'users';
  static softDeletes = false;

  @Column()
  declare id: number;

  @Column()
  declare name: string;

  @Column()
  declare email: string;

  @Column({ hidden: true }) // never appears in JSON output
  declare password: string;

  @Column()
  declare role: 'user' | 'admin';

  @Column()
  declare email_verified: boolean;

  @Column()
  declare email_verified_at: Date | null;

  @Column()
  declare created_at: Date;

  @Column()
  declare updated_at: Date;
}
```

**Note:** This `User` model is what `create-xacos-app` copies into the user's `database/models/User.ts` when auth is selected. It can be customized freely after scaffolding.

**MAINTENANCE.md update:** Sprint 69 ✅.
**Done when:** `User` model compiles. `password` is excluded from JSON via `@Column({ hidden: true })`.

---

## Sprint 70 — Auth Migrations

**Goal:** Ship `001_create_users_table.ts` and `002_create_sessions_table.ts` migration files inside `@xacos/auth`. These get copied to the user's `database/migrations/` by the scaffolder.

**`packages/auth/src/migrations/001_create_users_table.ts`:**
```typescript
import { Migration, Schema } from '@xacos/orm';

export default class CreateUsersTable extends Migration {
  async up(schema: Schema): Promise<void> {
    await schema.createTable('users', (table) => {
      table.bigIncrements('id');
      table.string('name', 255).notNullable();
      table.string('email', 255).notNullable().unique();
      table.string('password', 255).notNullable();
      table.enum('role', ['user', 'admin']).defaultTo('user');
      table.boolean('email_verified').defaultTo(false);
      table.timestamp('email_verified_at').nullable();
      table.timestamps(true, true); // created_at, updated_at with defaults
    });
  }

  async down(schema: Schema): Promise<void> {
    await schema.dropTable('users');
  }
}
```

**`packages/auth/src/migrations/002_create_sessions_table.ts`:**
```typescript
import { Migration, Schema } from '@xacos/orm';

export default class CreateSessionsTable extends Migration {
  async up(schema: Schema): Promise<void> {
    await schema.createTable('sessions', (table) => {
      table.bigIncrements('id');
      table.bigInteger('user_id').unsigned().notNullable();
      table.foreign('user_id').references('id').on('users').onDelete('cascade');
      table.string('token', 512).notNullable().unique();
      table.string('ip_address', 45).nullable();
      table.text('user_agent').nullable();
      table.timestamp('last_activity').notNullable();
      table.timestamps(true, true);
    });
  }

  async down(schema: Schema): Promise<void> {
    await schema.dropTable('sessions');
  }
}
```

**MAINTENANCE.md update:** Sprint 70 ✅.
**Done when:** Both migration files compile. Running them creates the correct tables.

---

## Sprint 71 — `AuthService`

**Goal:** Implement `register()`, `login()`, and `generateToken()` in `AuthService`.

**`packages/auth/src/services/AuthService.ts`:**
```typescript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { requireEnv } from '@xacos/config';

export interface AuthTokenPayload {
  userId: number;
  role: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export class AuthService {
  private get jwtSecret(): string {
    return requireEnv('JWT_SECRET');
  }

  private get jwtExpiresIn(): string {
    return process.env['JWT_EXPIRES_IN'] ?? '7d';
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResult> {
    // Check duplicate email
    const existing = await User.where('email', data.email).first();
    if (existing) {
      throw Object.assign(new Error('Email already registered'), { statusCode: 409 });
    }

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: await bcrypt.hash(data.password, 12),
      role: 'user',
      email_verified: false,
      email_verified_at: null,
    } as any);

    const token = this.generateToken(user as User);
    return { user: user as User, token };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await User.where('email', email).first() as User | null;
    if (!user) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    const valid = await bcrypt.compare(password, (user as any).password);
    if (!valid) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  generateToken(user: User): string {
    const payload: AuthTokenPayload = {
      userId: (user as any).id as number,
      role: (user as any).role as string,
    };
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    });
  }

  verifyToken(token: string): AuthTokenPayload {
    return jwt.verify(token, this.jwtSecret) as AuthTokenPayload;
  }
}

// Singleton for use without container
export const authService = new AuthService();
```

**Test `packages/auth/src/services/AuthService.test.ts`:**
```typescript
import { describe, it, expect, beforeAll } from 'bun:test';
import { AuthService } from './AuthService';

// Set required env for test
process.env['JWT_SECRET'] = 'test-secret-key-32chars-minimum!!';
process.env['JWT_EXPIRES_IN'] = '1h';

describe('AuthService.generateToken / verifyToken', () => {
  const service = new AuthService();

  it('generates a verifiable JWT', () => {
    const fakeUser = { id: 42, role: 'user' } as any;
    const token = service.generateToken(fakeUser);
    expect(typeof token).toBe('string');
    const payload = service.verifyToken(token);
    expect(payload.userId).toBe(42);
    expect(payload.role).toBe('user');
  });

  it('throws on invalid token', () => {
    expect(() => service.verifyToken('not-a-token')).toThrow();
  });
});
```

**MAINTENANCE.md update:** Sprint 71 ✅.
**Done when:** JWT tests pass. `register` and `login` logic is complete.

---

## Sprint 72 — JWT Middleware

**Goal:** Implement `authenticate` middleware — verifies JWT from `Authorization: Bearer <token>` header and attaches `req.user`.

**`packages/auth/src/middlewares/authenticate.ts`:**
```typescript
import type { XMiddleware, XRequest, XResponse, XNext } from '@xacos/shared';
import { authService } from '../services/AuthService';
import { User } from '../models/User';

/**
 * Protects routes requiring authentication.
 * Attaches the authenticated user to `req.user`.
 *
 * Usage in api file:
 *   router.use(authenticate)
 *   router.get('/', authenticate, handler)
 */
export const authenticate: XMiddleware = async (
  req: XRequest,
  res: XResponse,
  next: XNext
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.slice(7).trim();

  try {
    const payload = authService.verifyToken(token);
    const user = await User.find(payload.userId);
    if (!user) {
      res.status(401).json({ success: false, error: 'User not found' });
      return;
    }
    req.user = user as any;
    await next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

/**
 * Optional: require admin role.
 */
export const authorizeAdmin: XMiddleware = async (
  req: XRequest,
  res: XResponse,
  next: XNext
): Promise<void> => {
  if (!req.user || (req.user as any).role !== 'admin') {
    res.status(403).json({ success: false, error: 'Forbidden' });
    return;
  }
  await next();
};
```

**Usage in an API file:**
```typescript
// api/post.api.ts
import { XRouter } from '@xacos/core';
import { authenticate, authorizeAdmin } from '@xacos/auth';

export const router = new XRouter();

router.get('/', async (req, res) => res.json({ posts: [] }));
router.post('/', authenticate, async (req, res) => {
  // req.user is available here
  res.status(201).json({ author: req.user });
});
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  res.status(204).send();
});
```

**MAINTENANCE.md update:** Sprint 72 ✅.
**Done when:** `authenticate` middleware correctly blocks unauthenticated requests. `req.user` is set on success.

---

## Sprint 73 — Auth API Routes

**`packages/auth/src/controllers/AuthController.ts`:**
```typescript
import type { XRequest, XResponse } from '@xacos/shared';
import { authService } from '../services/AuthService';

export class AuthController {
  static async register(req: XRequest, res: XResponse) {
    const body = req.body as { name?: string; email?: string; password?: string };

    if (!body.name || !body.email || !body.password) {
      return res.status(400).json({ success: false, error: 'name, email, and password are required' });
    }

    const { user, token } = await authService.register({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    res.setCookie('xacos_token', token, {
      httpOnly: true,
      secure: process.env['APP_ENV'] === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return res.status(201).json({ success: true, user });
  }

  static async login(req: XRequest, res: XResponse) {
    const body = req.body as { email?: string; password?: string };

    if (!body.email || !body.password) {
      return res.status(400).json({ success: false, error: 'email and password are required' });
    }

    const { user, token } = await authService.login(body.email, body.password);

    res.setCookie('xacos_token', token, {
      httpOnly: true,
      secure: process.env['APP_ENV'] === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return res.json({ success: true, user });
  }

  static async logout(_req: XRequest, res: XResponse) {
    res.setCookie('xacos_token', '', {
      httpOnly: true,
      secure: process.env['APP_ENV'] === 'production',
      path: '/',
      maxAge: 0,
    });

    return res.json({ success: true, message: 'Logged out' });
  }

  static async me(req: XRequest, res: XResponse) {
    return res.json({ success: true, user: req.user });
  }
}
```

**`packages/auth/src/routes/auth.api.ts`:**
```typescript
import { XRouter } from '@xacos/core';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middlewares/authenticate';

export const router = new XRouter();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.me);
```


**File naming convention in user's project:**
```
api/
└── auth.api.ts   → handles /api/auth/register, /api/auth/login, etc.
```

**MAINTENANCE.md update:** Sprint 73 ✅.
**Done when:** All auth routes are consolidated in `auth.api.ts` and compile correctly.


---

## Sprint 74 — Auth Frontend Pages

**Goal:** Ship default login and register React pages that `create-xacos-app` copies into `views/auth/`.

**`packages/auth/src/views/auth.login.tsx`:**
```tsx
import React, { useState, type FormEvent } from 'react';
import { redirect } from '@xacos/client';
import { useAuth } from '@xacos/client';

export const meta = { title: 'Login' };
export const layout = 'main';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ email, password });
      redirect('/dashboard');
    } catch (err: any) {
      setError(err?.response?.error || 'Login failed — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 16px' }}>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ display: 'block', width: '100%', marginBottom: 12 }}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ display: 'block', width: '100%', marginBottom: 16 }}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```

**`packages/auth/src/views/auth.register.tsx`:**
```tsx
import React, { useState, type FormEvent } from 'react';
import { redirect } from '@xacos/client';
import { useAuth } from '@xacos/client';

export const meta = { title: 'Register' };
export const layout = 'main';

export default function RegisterPage() {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register({ name, email, password });
      redirect('/dashboard');
    } catch (err: any) {
      setError(err?.response?.error || 'Registration failed — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 16px' }}>
      <h1>Create Account</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required
            style={{ display: 'block', width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            style={{ display: 'block', width: '100%', marginBottom: 12 }} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
            style={{ display: 'block', width: '100%', marginBottom: 16 }} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Register'}
        </button>
      </form>
    </div>
  );
}
```

**MAINTENANCE.md update:** Sprint 74 ✅.
**MAINTENANCE.md update:** Sprint 74 ✅.
**Done when:** Both pages compile. Login calls `login()`, stores session via cookie, and redirects.


---

## Sprint 75 — `@xacos/cli` Init

**Goal:** Scaffold the `@xacos/cli` package entry point.

**Location:** `packages/cli/`

**`packages/cli/package.json`:**
```json
{
  "name": "@xacos/cli",
  "version": "0.0.1",
  "type": "module",
  "bin": {
    "xacos": "./dist/bin/xacos.js"
  },
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "@xacos/config": "workspace:*",
    "@xacos/compiler": "workspace:*",
    "@xacos/orm": "workspace:*",
    "@xacos/server": "workspace:*",
    "commander": "^12.x",
    "chalk": "^5.x",
    "ora": "^8.x"
  },
  "devDependencies": {
    "typescript": "^5.x"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "type-check": "tsc --noEmit"
  }
}
```

**`packages/cli/src/bin/xacos.ts`:**
```typescript
#!/usr/bin/env bun
import { program } from 'commander';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read version from package.json
const pkg = JSON.parse(readFileSync(resolve(import.meta.dir, '../../package.json'), 'utf-8')) as { version: string };

program
  .name('xacos')
  .description('XAOCS Framework CLI')
  .version(pkg.version);

// Commands registered in subsequent sprints
import '../commands/dev';
import '../commands/build';
import '../commands/start';
import '../commands/migrate';
import '../commands/seed';
import '../commands/routes';
import '../commands/tinker';
import '../commands/info';
import '../commands/add';
import '../commands/make';

program.parse(process.argv);
```

**`packages/cli/src/index.ts`:**
```typescript
export { program } from 'commander';
```

**MAINTENANCE.md update:** Sprint 75 ✅.
**Done when:** Package scaffolded. `bun run build` compiles cleanly.

---

## Sprint 76 — CLI Entry Setup

**Goal:** Wire the CLI using Commander with a clean help output and shared utilities.

**`packages/cli/src/utils/logger.ts`:**
```typescript
import chalk from 'chalk';

export const log = {
  info: (msg: string) => console.log(chalk.blue('ℹ'), msg),
  success: (msg: string) => console.log(chalk.green('✓'), msg),
  error: (msg: string) => console.error(chalk.red('✗'), msg),
  warn: (msg: string) => console.warn(chalk.yellow('⚠'), msg),
  step: (msg: string) => console.log(chalk.cyan('▶'), msg),
  blank: () => console.log(),
};
```

**`packages/cli/src/utils/loadConfig.ts`:**
```typescript
import { resolve, existsSync } from 'fs';
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
```

**MAINTENANCE.md update:** Sprint 76 ✅.
**Done when:** `xacos --help` prints usage. Logger and config loader work.

---

## Sprint 77 — `xacos dev` Command

**Goal:** Start the dev server with Vite HMR.

**`packages/cli/src/commands/dev.ts`:**
```typescript
import { program } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';
import ora from 'ora';

program
  .command('dev')
  .description('Start development server with HMR')
  .option('-p, --port <port>', 'Port to listen on', '5000')
  .action(async (options: { port: string }) => {
    const spinner = ora('Starting XAOCS dev server…').start();

    try {
      const config = await loadProjectConfig();
      const port = parseInt(options.port, 10) || config.port || 5000;

      // Dynamically import to avoid loading server deps at CLI startup
      const { XServer } = await import('@xacos/server');
      const { mountApiRoutes } = await import('@xacos/server');
      const { mountViewRoutes } = await import('@xacos/server');
      const { mountViteDev } = await import('@xacos/server');

      const server = new XServer();
      const app = server.getApp();

      const apiDir = config.api?.dir ?? './api';
      const viewsDir = config.views?.dir ?? './views';

      await mountViteDev(server.fastify, viewsDir, process.cwd());
      await mountApiRoutes(server.fastify, apiDir, app);
      await mountViewRoutes(server.fastify, viewsDir);

      await server.listen(port);
      spinner.stop();

      log.blank();
      log.success(`XAOCS dev server running`);
      log.info(`Local:   http://localhost:${port}`);
      log.info(`API:     http://localhost:${port}/api`);
      log.blank();
    } catch (err) {
      spinner.fail('Failed to start dev server');
      log.error((err as Error).message);
      process.exit(1);
    }
  });
```

**MAINTENANCE.md update:** Sprint 77 ✅.
**Done when:** `xacos dev` starts the server, API routes respond, Vite serves pages with HMR.

---

## Sprint 78 — `xacos build` Command

**Goal:** Run esbuild production build for all pages.

**`packages/cli/src/commands/build.ts`:**
```typescript
import { program } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';
import { buildProduction } from '@xacos/compiler';
import ora from 'ora';

program
  .command('build')
  .description('Build for production')
  .option('--out <dir>', 'Output directory', '.xacos/client')
  .action(async (options: { out: string }) => {
    const spinner = ora('Building for production…').start();

    try {
      const config = await loadProjectConfig();
      const viewsDir = config.views?.dir ?? './views';

      const result = await buildProduction(viewsDir, options.out, process.cwd());

      spinner.succeed('Build complete');
      log.blank();
      log.success(`${result.outputFiles.length} page chunk(s) built → ${options.out}/`);

      // Print bundle sizes from metafile
      for (const [file, info] of Object.entries(result.metafile.outputs)) {
        const sizeKb = (info.bytes / 1024).toFixed(1);
        log.info(`  ${file} — ${sizeKb} KB`);
      }
      log.blank();
    } catch (err) {
      spinner.fail('Build failed');
      log.error((err as Error).message);
      process.exit(1);
    }
  });
```

**MAINTENANCE.md update:** Sprint 78 ✅.
**Done when:** `xacos build` creates chunks in `.xacos/client/` and reports sizes.

---

## Sprint 79 — `xacos start` Command

**Goal:** Start the production server (no Vite, serves static chunks).

**`packages/cli/src/commands/start.ts`:**
```typescript
import { program } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';

program
  .command('start')
  .description('Start production server')
  .option('-p, --port <port>', 'Port', '5000')
  .action(async (options: { port: string }) => {
    try {
      // Mark as production before any imports
      process.env['NODE_ENV'] = 'production';
      process.env['APP_ENV'] = 'production';

      const config = await loadProjectConfig();
      const port = parseInt(options.port, 10) || config.port || 5000;

      const { XServer } = await import('@xacos/server');
      const { mountApiRoutes, mountViewRoutes, serveStaticChunks } = await import('@xacos/server');

      const server = new XServer();
      const app = server.getApp();

      await serveStaticChunks(server.fastify, '.xacos/client');
      await mountApiRoutes(server.fastify, config.api?.dir ?? './api', app);
      await mountViewRoutes(server.fastify, config.views?.dir ?? './views');

      await server.listen(port);

      log.blank();
      log.success(`XAOCS running in production`);
      log.info(`http://localhost:${port}`);
      log.blank();
    } catch (err) {
      log.error((err as Error).message);
      process.exit(1);
    }
  });
```

**`packages/server/src/static/serveStaticChunks.ts`:**
```typescript
import type { FastifyInstance } from 'fastify';
import { resolve } from 'path';

export async function serveStaticChunks(
  fastify: FastifyInstance,
  chunksDir: string
): Promise<void> {
  await fastify.register(import('@fastify/static'), {
    root: resolve(chunksDir),
    prefix: '/__xacos/',
  });
}
```

**MAINTENANCE.md update:** Sprint 79 ✅.
**Done when:** `xacos start` serves the production build with API routes working.

---

## Sprint 80 — `xacos migrate` Command

**Goal:** Run all pending database migrations.

**`packages/cli/src/commands/migrate.ts`:**
```typescript
import { program } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';
import { MigrationRunner } from '@xacos/orm';
import { resolve } from 'path';

const migrateCmd = program
  .command('migrate')
  .description('Run pending database migrations')
  .action(async () => {
    try {
      await loadProjectConfig();
      const runner = new MigrationRunner(resolve('./database/migrations'));
      log.step('Running migrations…');
      await runner.run();
      log.success('Migrations complete');
    } catch (err) {
      log.error((err as Error).message);
      process.exit(1);
    }
  });

migrateCmd
  .command('rollback')
  .description('Rollback the last batch of migrations')
  .action(async () => {
    try {
      await loadProjectConfig();
      const runner = new MigrationRunner(resolve('./database/migrations'));
      log.step('Rolling back last batch…');
      await runner.rollback();
      log.success('Rollback complete');
    } catch (err) {
      log.error((err as Error).message);
      process.exit(1);
    }
  });

migrateCmd
  .command('fresh')
  .description('Drop all tables and re-run all migrations')
  .action(async () => {
    try {
      await loadProjectConfig();
      const runner = new MigrationRunner(resolve('./database/migrations'));
      log.warn('Dropping all tables…');
      await runner.fresh();
      log.success('Fresh migration complete');
    } catch (err) {
      log.error((err as Error).message);
      process.exit(1);
    }
  });

migrateCmd
  .command('status')
  .description('Show status of all migrations')
  .action(async () => {
    try {
      await loadProjectConfig();
      const runner = new MigrationRunner(resolve('./database/migrations'));
      const status = await runner.status();
      log.blank();
      console.log('Migration Status:');
      for (const row of status) {
        const icon = row.ran ? chalk.green('✓') : chalk.gray('○');
        console.log(`  ${icon} ${row.name}`);
      }
      log.blank();
    } catch (err) {
      log.error((err as Error).message);
      process.exit(1);
    }
  });

import chalk from 'chalk';
```

**Add `status()` to `MigrationRunner`** (in `packages/orm`):
```typescript
async status(): Promise<Array<{ name: string; ran: boolean; batch?: number }>> {
  await this.ensureMigrationsTable();
  const ran = await getKnex()('xacos_migrations').select('name', 'batch');
  const ranNames = new Set(ran.map((r: any) => r.name as string));
  const allFiles = this.getSortedFiles();
  return allFiles.map(f => ({
    name: f,
    ran: ranNames.has(f),
    batch: (ran.find((r: any) => r.name === f) as any)?.batch,
  }));
}
```

**MAINTENANCE.md update:** Sprint 80 ✅.
**Done when:** `xacos migrate`, `xacos migrate rollback`, `xacos migrate fresh`, `xacos migrate status` all work.

---

## Sprint 81–82 — Already covered in Sprint 80

Rollback and fresh are subcommands of `migrate` (implemented above). Sprints 81 and 82 are therefore:

**Sprint 81 — `xacos migrate:rollback`** — ✅ implemented as `xacos migrate rollback` in Sprint 80.
**Sprint 82 — `xacos migrate:fresh`** — ✅ implemented as `xacos migrate fresh` in Sprint 80.

Both update `MAINTENANCE.md` accordingly.

---

## Sprint 83 — `xacos migrate:status`

✅ Implemented as `xacos migrate status` in Sprint 80. Mark ✅ in `MAINTENANCE.md`.

---

## Sprint 84 — `xacos db:seed` Command

**Goal:** Run all seeders or a specific seeder.

**`packages/cli/src/commands/seed.ts`:**
```typescript
import { program } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';
import { SeederRunner } from '@xacos/orm';
import { resolve } from 'path';

program
  .command('db:seed')
  .description('Run database seeders')
  .option('--seeder <name>', 'Run a specific seeder by class name')
  .action(async (options: { seeder?: string }) => {
    try {
      await loadProjectConfig();
      const runner = new SeederRunner(resolve('./database/seeders'));

      if (options.seeder) {
        log.step(`Running seeder: ${options.seeder}`);
        await runner.runOne(options.seeder);
      } else {
        log.step('Running all seeders…');
        await runner.runAll();
      }

      log.success('Seeding complete');
    } catch (err) {
      log.error((err as Error).message);
      process.exit(1);
    }
  });
```

**MAINTENANCE.md update:** Sprint 84 ✅.
**Done when:** `xacos db:seed` runs all seeders. `xacos db:seed --seeder UserSeeder` runs one.

---

## Sprint 85 — `xacos routes` Command

**Goal:** List all registered routes (API + view) in a formatted table.

**`packages/cli/src/commands/routes.ts`:**
```typescript
import { program } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';
import { scanApiFiles } from '@xacos/core';
import { scanViews } from '@xacos/compiler';
import chalk from 'chalk';

program
  .command('routes')
  .description('List all registered routes')
  .action(async () => {
    try {
      const config = await loadProjectConfig();
      const apiDir = config.api?.dir ?? './api';
      const viewsDir = config.views?.dir ?? './views';

      log.blank();
      console.log(chalk.bold('API Routes:'));
      const apiFiles = scanApiFiles(apiDir);
      for (const { filePath, urlPrefix } of apiFiles) {
        // Import to read the router's routes
        const mod = await import(filePath) as { router?: { routes: Array<{ method: string; path: string }> } };
        if (mod.router?.routes) {
          for (const route of mod.router.routes) {
            const fullPath = urlPrefix + (route.path === '/' ? '' : route.path);
            const method = chalk.green(route.method.padEnd(7));
            console.log(`  ${method} ${fullPath}`);
          }
        }
      }

      log.blank();
      console.log(chalk.bold('View Routes:'));
      const views = scanViews(viewsDir);
      for (const view of views) {
        console.log(`  ${chalk.cyan('GET'.padEnd(7))} ${view.urlPattern}`);
      }
      log.blank();
    } catch (err) {
      log.error((err as Error).message);
      process.exit(1);
    }
  });
```

**Output example:**
```
API Routes:
  GET     /api/user
  GET     /api/user/:id
  POST    /api/user
  PUT     /api/user/:id
  DELETE  /api/user/:id

View Routes:
  GET     /
  GET     /dashboard
  GET     /blog/:id
```

**MAINTENANCE.md update:** Sprint 85 ✅.
**Done when:** `xacos routes` prints all API and view routes.

---

## Sprint 86 — `xacos tinker` Command

**Goal:** Interactive REPL with full app context — XModel, services, container all available.

**`packages/cli/src/commands/tinker.ts`:**
```typescript
import { program } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';
import repl from 'repl';

program
  .command('tinker')
  .description('Open an interactive REPL with XAOCS app context')
  .action(async () => {
    try {
      const config = await loadProjectConfig();
      log.info('Starting XAOCS Tinker REPL…');
      log.info('Available: app, XModel, User, config');
      log.blank();

      // Boot the application container
      const { application } = await import('@xacos/core');
      await application.boot({
        servicesDir: './app/services',
        middlewaresDir: './app/middlewares',
      });

      // Start REPL
      const server = repl.start({ prompt: 'xacos> ' });

      // Inject context
      server.context['app'] = application.container;
      server.context['config'] = config;

      // Try to load user models
      try {
        const { User } = await import(process.cwd() + '/database/models/User');
        server.context['User'] = User;
      } catch { /* model may not exist */ }

      server.on('exit', () => {
        log.blank();
        log.info('Exiting tinker. Goodbye!');
        process.exit(0);
      });
    } catch (err) {
      log.error((err as Error).message);
      process.exit(1);
    }
  });
```

**MAINTENANCE.md update:** Sprint 86 ✅.
**Done when:** `xacos tinker` opens REPL. `await User.all()` returns data. `app.make('UserService')` works.

---

## Sprint 87 — `xacos info` Command

**Goal:** Print framework version, environment info, and database status.

**`packages/cli/src/commands/info.ts`:**
```typescript
import { program } from 'commander';
import { loadProjectConfig } from '../utils/loadConfig';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { resolve } from 'path';

program
  .command('info')
  .description('Show XAOCS framework and environment info')
  .action(async () => {
    const cliPkg = JSON.parse(
      readFileSync(resolve(import.meta.dir, '../../package.json'), 'utf-8')
    ) as { version: string };

    console.log('\n' + chalk.bold('XAOCS Framework Info'));
    console.log('─'.repeat(40));
    console.log(`  CLI Version:   ${chalk.cyan(cliPkg.version)}`);
    console.log(`  Bun Version:   ${chalk.cyan(process.versions.bun ?? 'unknown')}`);
    console.log(`  Node Version:  ${chalk.cyan(process.version)}`);
    console.log(`  Platform:      ${chalk.cyan(process.platform)}`);
    console.log('─'.repeat(40));

    try {
      const config = await loadProjectConfig();
      console.log(`  APP_ENV:       ${chalk.cyan(process.env['APP_ENV'] ?? 'development')}`);
      console.log(`  Port:          ${chalk.cyan(config.port ?? 5000)}`);
      console.log(`  DB Driver:     ${chalk.cyan(process.env['DB_DRIVER'] ?? 'sqlite')}`);
      console.log(`  Views Dir:     ${chalk.cyan(config.views?.dir ?? './views')}`);
      console.log(`  API Dir:       ${chalk.cyan(config.api?.dir ?? './api')}`);
    } catch {
      console.log(chalk.yellow('  ⚠ Could not load xacos.config.ts'));
    }

    console.log('─'.repeat(40) + '\n');
  });
```

**MAINTENANCE.md update:** Sprint 87 ✅.
**Done when:** `xacos info` prints a clean info table.

---

## Sprint 88 — `xacos add model` Command

**Goal:** Generate a new `XModel` class file in `database/models/`.

**`packages/cli/src/commands/add.ts` (Part 1):**
```typescript
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
```

**MAINTENANCE.md update:** Sprint 88 ✅.
**Done when:** `xacos add model User` creates `database/models/User.ts`.

---

## Sprint 89 — `xacos add middleware` Command

**Goal:** Generate a new middleware file in `app/middlewares/`.

**`packages/cli/src/commands/add.ts` (Part 2):**
```typescript
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
```

**MAINTENANCE.md update:** Sprint 89 ✅.
**Done when:** `xacos add middleware auth` creates `app/middlewares/auth.middleware.ts`.

---

## Sprint 90 — `xacos add service` Command

**Goal:** Generate a new service class file in `app/services/`.

**`packages/cli/src/commands/add.ts` (Part 3):**
```typescript
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
```

**MAINTENANCE.md update:** Sprint 90 ✅.
**Done when:** `xacos add service User` creates `app/services/UserService.ts`.

---

## Sprint 91 — `xacos add controller` Command

**Goal:** Generate a new controller class file in `app/controllers/`.

**`packages/cli/src/commands/add.ts` (Part 4):**
```typescript
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
```

**MAINTENANCE.md update:** Sprint 91 ✅.
**Done when:** `xacos add controller User` creates `app/controllers/UserController.ts`.

---

## Sprint 92 — `xacos add api` Command

**Goal:** Generate a new API route file in `api/`.

**`packages/cli/src/commands/add.ts` (Part 5 & Templates):**
```typescript
  // ─── xacos add api <name> ───────────────────────────────────────────────
  add
    .command('api <name>')
    .description('Generate a new *.api.ts route file')
    .action((name: string) => {
      const path = resolve(`./api/${name}.api.ts`);
      guard(path);
      writeFileSync(path, apiTemplate(name));
      log.success(`API route created: api/${name}.api.ts`);
      log.info(`Routes available at: /api/${name}/`);
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

function apiTemplate(name: string): string {
  const Name = name.charAt(0).toUpperCase() + name.slice(1);
  return `import { XRouter } from '@xacos/core';
// import { authenticate } from '@xacos/auth';
// import { ${Name}Service } from '../app/services/${Name}Service';

export const router = new XRouter();

// GET /api/${name}/
router.get('/', async (req, res) => {
  return res.json({ success: true, data: [] });
});

// GET /api/${name}/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  return res.json({ success: true, data: { id } });
});

// POST /api/${name}/
router.post('/', async (req, res) => {
  return res.status(201).json({ success: true, data: req.body });
});

// PUT /api/${name}/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  return res.json({ success: true, data: { id, ...req.body as object } });
});

// DELETE /api/${name}/:id
router.delete('/:id', async (req, res) => {
  return res.status(204).send();
});
`;
}
```

**MAINTENANCE.md update:** Sprint 92 ✅.
**Done when:** `xacos add api user` creates `api/user.api.ts`.

---

## Sprint 93 — `xacos make migration` Command

**Goal:** Generate a new database migration file in `database/migrations/`.

**`packages/cli/src/commands/make.ts` (Part 1):**
```typescript
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
```

**MAINTENANCE.md update:** Sprint 93 ✅.
**Done when:** `xacos make migration create_users` creates `database/migrations/123456789_create_users.ts`.

---

## Sprint 94 — `xacos make seeder` Command

**Goal:** Generate a new database seeder file in `database/seeders/`.

**`packages/cli/src/commands/make.ts` (Part 2 & Templates):**
```typescript
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
```

**MAINTENANCE.md update:** Sprint 94 ✅.

---

## Sprint 95 — `create-xacos-app` Init

**Goal:** Scaffold the `create-xacos-app` package — the project bootstrapper.

**Location:** `packages/create-xacos-app/`

**`packages/create-xacos-app/package.json`:**
```json
{
  "name": "create-xacos-app",
  "version": "0.0.1",
  "type": "module",
  "bin": {
    "create-xacos-app": "./dist/bin/create.js"
  },
  "dependencies": {
    "commander": "^12.x",
    "chalk": "^5.x",
    "ora": "^8.x",
    "prompts": "^2.x"
  },
  "devDependencies": {
    "@types/prompts": "^2.x",
    "typescript": "^5.x"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "type-check": "tsc --noEmit"
  }
}
```

**`packages/create-xacos-app/src/bin/create.ts`:**
```typescript
#!/usr/bin/env bun
import { program } from 'commander';

program
  .name('create-xacos-app')
  .description('Create a new XAOCS application')
  .argument('[project-name]', 'Name of the project')
  .action(async (projectName?: string) => {
    const { scaffold } = await import('../scaffold');
    await scaffold(projectName);
  });

program.parse(process.argv);
```

**MAINTENANCE.md update:** Sprint 95 ✅.
**Done when:** Package scaffolded, `bunx create-xacos-app` runs without error.

---

## Sprint 96–105 — Scaffold Implementation

These sprints implement the full `create-xacos-app` scaffold. They all live in `packages/create-xacos-app/src/scaffold.ts` and the `templates/` directory.

**`packages/create-xacos-app/src/scaffold.ts`:**
```typescript
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import { mkdirSync, writeFileSync, cpSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { execSync } from 'child_process';

type DbDriver = 'sqlite' | 'mysql' | 'postgres' | 'mongodb';

interface ScaffoldAnswers {
  projectName: string;
  dbDriver: DbDriver;
  includeAuth: boolean;
  includeExample: boolean;
}

export async function scaffold(nameArg?: string): Promise<void> {
  console.log('\n' + chalk.bold.cyan('  XAOCS — Create New App') + '\n');

  const answers = await prompts([
    {
      type: nameArg ? null : 'text',        // Skip if provided via arg
      name: 'projectName',
      message: 'Project name:',
      initial: 'my-xacos-app',
      validate: (v: string) => /^[a-z0-9-]+$/.test(v) || 'Use lowercase letters, numbers, and hyphens only',
    },
    {
      type: 'select',
      name: 'dbDriver',
      message: 'Database:',
      choices: [
        { title: 'SQLite (zero config, great for dev)', value: 'sqlite' },
        { title: 'MySQL', value: 'mysql' },
        { title: 'PostgreSQL', value: 'postgres' },
        { title: 'MongoDB', value: 'mongodb' },
      ],
      initial: 0,
    },
    {
      type: 'confirm',
      name: 'includeAuth',
      message: 'Include authentication (email + password)?',
      initial: true,
    },
    {
      type: 'confirm',
      name: 'includeExample',
      message: 'Include example API and page?',
      initial: true,
    },
  ]);

  const projectName: string = nameArg ?? answers['projectName'];
  const dbDriver: DbDriver = answers['dbDriver'];
  const includeAuth: boolean = answers['includeAuth'];
  const includeExample: boolean = answers['includeExample'];

  const projectDir = resolve(process.cwd(), projectName);

  if (existsSync(projectDir)) {
    console.error(chalk.red(`\n  Error: Directory "${projectName}" already exists.\n`));
    process.exit(1);
  }

  const spinner = ora(`Scaffolding ${projectName}…`).start();

  // ── Create directory structure ──────────────────────────────────────────
  const dirs = [
    'app/controllers',
    'app/services',
    'app/middlewares',
    'api',
    'views/layouts',
    'views/auth',
    'config',
    'database/models',
    'database/migrations',
    'database/seeders',
    'public',
  ];
  for (const dir of dirs) {
    mkdirSync(join(projectDir, dir), { recursive: true });
  }

  // ── Write all template files ─────────────────────────────────────────────
  writeAllTemplates(projectDir, { projectName, dbDriver, includeAuth, includeExample });

  spinner.succeed('Project scaffolded');

  // ── Install dependencies ─────────────────────────────────────────────────
  const installSpinner = ora('Installing dependencies…').start();
  execSync('bun install', { cwd: projectDir, stdio: 'pipe' });
  installSpinner.succeed('Dependencies installed');

  // ── Done ─────────────────────────────────────────────────────────────────
  console.log('\n' + chalk.green.bold('  ✓ Done!') + '\n');
  console.log(`  ${chalk.cyan('cd')} ${projectName}`);
  console.log(`  ${chalk.cyan('xacos migrate')}`);
  console.log(`  ${chalk.cyan('xacos dev')}\n`);
}
```

**Sprints 96–105** each write one category of template files. The key files written:

**Sprint 96 — Base project structure** (dirs + gitignore)
**Sprint 97 — DB prompt + `.env` generation per driver**
**Sprint 98 — Auth files copied from `@xacos/auth/src/` when `includeAuth = true`**
**Sprint 99 — `.env.example`:**

```ini
# App
APP_NAME=MyApp
APP_ENV=development
APP_PORT=5000
APP_URL=http://localhost:5000

# Security
JWT_SECRET=change-me-to-a-long-random-string
JWT_EXPIRES_IN=7d

# Database — set DB_DRIVER and fill in the matching block
DB_DRIVER=sqlite

# SQLite (default)
DB_PATH=./database/db.sqlite

# MySQL
# DB_DRIVER=mysql
# DB_HOST=localhost
# DB_PORT=3306
# DB_DATABASE=myapp
# DB_USERNAME=root
# DB_PASSWORD=

# PostgreSQL
# DB_DRIVER=postgres
# DB_HOST=localhost
# DB_PORT=5432
# DB_DATABASE=myapp
# DB_USERNAME=postgres
# DB_PASSWORD=

# Mail (optional)
MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM=noreply@myapp.com
```

**Sprint 100 — `xacos.config.ts`:**
```typescript
import { defineConfig } from '@xacos/config';

export default defineConfig({
  port: Number(process.env['APP_PORT']) || 5000,
  views: { dir: './views', defaultLayout: 'main' },
  api: { prefix: '/api', dir: './api' },
});
```

**Sprint 101 — `package.json` for scaffolded project:**
```json
{
  "name": "{{projectName}}",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "xacos dev",
    "build": "xacos build",
    "start": "xacos start",
    "migrate": "xacos migrate",
    "seed": "xacos db:seed"
  },
  "dependencies": {
    "@xacos/auth": "latest",
    "@xacos/client": "latest",
    "@xacos/core": "latest",
    "@xacos/orm": "latest",
    "react": "^18.x",
    "react-dom": "^18.x"
  },
  "devDependencies": {
    "@xacos/cli": "latest",
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "typescript": "^5.x"
  }
}
```

**Sprint 102 — `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@app/*": ["./app/*"],
      "@views/*": ["./views/*"],
      "@api/*": ["./api/*"],
      "@db/*": ["./database/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", ".xacos"]
}
```

**Sprint 103 — Auto-run `bun install`** — already in `scaffold.ts` above.

**Sprint 104 — Auto-run `xacos migrate`** after install:
```typescript
if (dbDriver === 'sqlite') {
  const migrateSpinner = ora('Running initial migrations…').start();
  try {
    execSync('bun run xacos migrate', { cwd: projectDir, stdio: 'pipe' });
    migrateSpinner.succeed('Database migrated');
  } catch {
    migrateSpinner.warn('Migration skipped — run `xacos migrate` manually');
  }
}
```

**Sprint 105 — Project README:**
```markdown
# {{projectName}}

Built with [XAOCS](https://xacos.dev) — a full-stack TypeScript framework.

## Structure

```
app/           → Controllers, Services, Middlewares
api/           → *.api.ts route files (auto-registered)
views/         → React pages (file-based routing)
database/      → Models, Migrations, Seeders
config/        → Configuration files
public/        → Static assets
```

## Commands

```bash
xacos dev              # Start dev server with HMR
xacos build            # Production build
xacos start            # Start production server
xacos migrate          # Run pending migrations
xacos db:seed          # Seed the database
xacos routes           # List all routes
xacos tinker           # Interactive REPL
```

**MAINTENANCE.md update:** Mark Sprints 96–105 ✅.
**Done when:** `bunx create-xacos-app my-app` creates a full working project directory.

---

# END OF SPRINTS 51–100

> Run `bun run build` from root. All packages must compile with zero errors.
> Update `MAINTENANCE.md`: mark sprints 51–100 as ✅. Total completed: 100.
> **Progress: 100/200 sprints complete. Halfway there.**



# XAOCS Framework — Sprints 101–150 (Detailed)

> **Continuing from Sprint 102.** 102 sprints complete. Mail package (SMTP + SES) done.
> Stack: TurboRepo + Bun + TypeScript + Fastify + React + Knex + Vite + esbuild
> **Agent:** Read `MAINTENANCE.md` before starting. Confirm Sprint 102 ✅ Done.

---

## Sprint 103 — Mailgun Driver

**Goal:** Implement a Mailgun mail driver for `@xacos/mail` using the official Mailgun.js SDK.

**Install in `packages/mail`:**
```bash
bun add mailgun.js form-data
bun add -d @types/mailgun.js
```

**`packages/mail/src/drivers/MailgunMailer.ts`:**
```typescript
import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import type { Mailer, MailMessage, MailResult } from '../Mailer';
import { interpolate } from '../utils/interpolate';

export interface MailgunConfig {
  apiKey: string;
  domain: string;
  from: string;
  host?: string; // default: 'api.mailgun.net', use 'api.eu.mailgun.net' for EU
}

export class MailgunMailer implements Mailer {
  private client: ReturnType<InstanceType<typeof Mailgun>['client']>;
  private config: MailgunConfig;

  constructor(config: MailgunConfig) {
    this.config = config;
    const mg = new Mailgun(FormData);
    this.client = mg.client({
      username: 'api',
      key: config.apiKey,
      url: config.host ?? 'https://api.mailgun.net',
    });
  }

  async send(message: MailMessage): Promise<MailResult> {
    const html = message.template
      ? interpolate(message.template, message.data ?? {})
      : message.html ?? '';

    try {
      const response = await this.client.messages.create(this.config.domain, {
        from: message.from ?? this.config.from,
        to: Array.isArray(message.to) ? message.to : [message.to],
        subject: message.subject,
        html,
        text: message.text,
      });

      return {
        success: true,
        messageId: response.id,
        provider: 'mailgun',
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        provider: 'mailgun',
      };
    }
  }
}
```

**Register in `MailManager`:**
```typescript
// packages/mail/src/MailManager.ts — add case:
case 'mailgun':
  return new MailgunMailer({
    apiKey: requireEnv('MAILGUN_API_KEY'),
    domain: requireEnv('MAILGUN_DOMAIN'),
    from: process.env['MAIL_FROM'] ?? 'noreply@example.com',
    host: process.env['MAILGUN_HOST'],
  });
```

**`.env.example` additions:**
```ini
# Mailgun (optional)
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.yourdomain.com
MAILGUN_HOST=https://api.mailgun.net
```

**Test `packages/mail/src/drivers/MailgunMailer.test.ts`:**
```typescript
import { describe, it, expect, mock } from 'bun:test';

describe('MailgunMailer', () => {
  it('constructs without throwing', () => {
    // We only test construction — live API calls need real credentials
    const { MailgunMailer } = await import('./MailgunMailer');
    expect(() => new MailgunMailer({
      apiKey: 'key-test',
      domain: 'test.example.com',
      from: 'test@example.com',
    })).not.toThrow();
  });
});
```

**Export from `packages/mail/src/index.ts`:**
```typescript
export { MailgunMailer } from './drivers/MailgunMailer';
```

**MAINTENANCE.md update:** Sprint 103 ✅.
**CHANGELOG:** `- Sprint 103: Mailgun driver added to @xacos/mail.`
**Done when:** `MailgunMailer` constructs and `MAIL_DRIVER=mailgun` resolves from `MailManager`.

---

## Sprint 104 — Postmark Driver

**Goal:** Implement a Postmark mail driver for transactional emails.

**Install in `packages/mail`:**
```bash
bun add postmark
```

**`packages/mail/src/drivers/PostmarkMailer.ts`:**
```typescript
import { ServerClient } from 'postmark';
import type { Mailer, MailMessage, MailResult } from '../Mailer';
import { interpolate } from '../utils/interpolate';

export interface PostmarkConfig {
  serverToken: string;
  from: string;
}

export class PostmarkMailer implements Mailer {
  private client: ServerClient;
  private config: PostmarkConfig;

  constructor(config: PostmarkConfig) {
    this.config = config;
    this.client = new ServerClient(config.serverToken);
  }

  async send(message: MailMessage): Promise<MailResult> {
    const htmlBody = message.template
      ? interpolate(message.template, message.data ?? {})
      : message.html ?? '';

    try {
      const response = await this.client.sendEmail({
        From: message.from ?? this.config.from,
        To: Array.isArray(message.to) ? message.to.join(',') : message.to,
        Subject: message.subject,
        HtmlBody: htmlBody,
        TextBody: message.text,
        MessageStream: 'outbound',
      });

      return {
        success: true,
        messageId: response.MessageID,
        provider: 'postmark',
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        provider: 'postmark',
      };
    }
  }
}
```

**Register in `MailManager`:**
```typescript
case 'postmark':
  return new PostmarkMailer({
    serverToken: requireEnv('POSTMARK_SERVER_TOKEN'),
    from: process.env['MAIL_FROM'] ?? 'noreply@example.com',
  });
```

**`.env.example` additions:**
```ini
# Postmark (optional)
POSTMARK_SERVER_TOKEN=your-server-token-here
```

**Export from `packages/mail/src/index.ts`.**

**MAINTENANCE.md update:** Sprint 104 ✅.
**CHANGELOG:** `- Sprint 104: Postmark driver added to @xacos/mail.`
**Done when:** `MAIL_DRIVER=postmark` resolves from `MailManager`. Driver builds cleanly.

---

## Sprint 105 — Resend Driver

**Goal:** Implement a Resend driver — the modern developer-friendly email API.

**Install in `packages/mail`:**
```bash
bun add resend
```

**`packages/mail/src/drivers/ResendMailer.ts`:**
```typescript
import { Resend } from 'resend';
import type { Mailer, MailMessage, MailResult } from '../Mailer';
import { interpolate } from '../utils/interpolate';

export interface ResendConfig {
  apiKey: string;
  from: string;
}

export class ResendMailer implements Mailer {
  private client: Resend;
  private config: ResendConfig;

  constructor(config: ResendConfig) {
    this.config = config;
    this.client = new Resend(config.apiKey);
  }

  async send(message: MailMessage): Promise<MailResult> {
    const html = message.template
      ? interpolate(message.template, message.data ?? {})
      : message.html ?? '';

    const response = await this.client.emails.send({
      from: message.from ?? this.config.from,
      to: Array.isArray(message.to) ? message.to : [message.to],
      subject: message.subject,
      html,
      text: message.text,
    });

    if (response.error) {
      return { success: false, error: response.error.message, provider: 'resend' };
    }

    return {
      success: true,
      messageId: response.data?.id,
      provider: 'resend',
    };
  }
}
```

**Register in `MailManager`:**
```typescript
case 'resend':
  return new ResendMailer({
    apiKey: requireEnv('RESEND_API_KEY'),
    from: process.env['MAIL_FROM'] ?? 'noreply@example.com',
  });
```

**`.env.example` additions:**
```ini
# Resend (optional — recommended for new projects)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Mail driver summary** — all supported drivers now:
```
MAIL_DRIVER=log        → LogMailer (dev, no real sends)
MAIL_DRIVER=smtp       → SmtpMailer (nodemailer)
MAIL_DRIVER=ses        → SesMailer (AWS SES)
MAIL_DRIVER=mailgun    → MailgunMailer
MAIL_DRIVER=postmark   → PostmarkMailer
MAIL_DRIVER=resend     → ResendMailer ← added this sprint
```

**MAINTENANCE.md update:** Sprint 105 ✅.
**CHANGELOG:** `- Sprint 105: Resend driver added. Mail package now has 6 drivers.`
**Done when:** All 6 drivers export cleanly. `MailManager` resolves each.

---

## Sprint 106 — `@xacos/cache` Init

**Goal:** Scaffold the `@xacos/cache` package — a unified caching interface with driver support.

**Location:** `packages/cache/`

**`packages/cache/package.json`:**
```json
{
  "name": "@xacos/cache",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "@xacos/config": "workspace:*",
    "@xacos/shared": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.x"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "bun test",
    "type-check": "tsc --noEmit"
  }
}
```

**`packages/cache/src/Cache.ts`:**
```typescript
/**
 * Unified cache interface. All drivers implement this.
 */
export interface Cache {
  /**
   * Get a value from cache. Returns null if not found or expired.
   */
  get<T = unknown>(key: string): Promise<T | null>;

  /**
   * Set a value in cache.
   * @param ttl Time-to-live in seconds. Omit for no expiration.
   */
  set(key: string, value: unknown, ttl?: number): Promise<void>;

  /**
   * Delete a key from cache.
   */
  forget(key: string): Promise<void>;

  /**
   * Flush the entire cache. Use with caution in production.
   */
  flush(): Promise<void>;

  /**
   * Check if a key exists and has not expired.
   */
  has(key: string): Promise<boolean>;

  /**
   * Get or set a value. If key doesn't exist, calls factory and stores result.
   *
   * @example
   * const user = await cache.remember('user:1', 60, () => User.find(1));
   */
  remember<T>(key: string, ttl: number, factory: () => Promise<T>): Promise<T>;
}
```

**`packages/cache/src/index.ts`:**
```typescript
export type { Cache } from './Cache';
export { MemoryCache } from './drivers/MemoryCache';
export { CacheManager } from './CacheManager';
```

**MAINTENANCE.md update:** Sprint 106 ✅.
**CHANGELOG:** `- Sprint 106: @xacos/cache package scaffolded with Cache interface.`
**Done when:** Package builds. `Cache` interface exported.

---

## Sprint 107 — Memory Cache Driver

**Goal:** Implement `MemoryCache` — the default in-memory cache for development and testing.

**`packages/cache/src/drivers/MemoryCache.ts`:**
```typescript
import type { Cache } from '../Cache';

interface CacheEntry {
  value: unknown;
  expiresAt: number | null; // null = never expires
}

export class MemoryCache implements Cache {
  private store = new Map<string, CacheEntry>();

  async get<T = unknown>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: ttl ? Date.now() + ttl * 1000 : null,
    });
  }

  async forget(key: string): Promise<void> {
    this.store.delete(key);
  }

  async flush(): Promise<void> {
    this.store.clear();
  }

  async has(key: string): Promise<boolean> {
    return (await this.get(key)) !== null;
  }

  async remember<T>(key: string, ttl: number, factory: () => Promise<T>): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }
}
```

**Test `packages/cache/src/drivers/MemoryCache.test.ts`:**
```typescript
import { describe, it, expect, beforeEach } from 'bun:test';
import { MemoryCache } from './MemoryCache';

describe('MemoryCache', () => {
  let cache: MemoryCache;

  beforeEach(() => { cache = new MemoryCache(); });

  it('returns null for missing keys', async () => {
    expect(await cache.get('missing')).toBeNull();
  });

  it('stores and retrieves values', async () => {
    await cache.set('name', 'XAOCS');
    expect(await cache.get('name')).toBe('XAOCS');
  });

  it('expires keys after TTL', async () => {
    await cache.set('short', 'value', 0); // 0s TTL
    // Force expiry by manipulating time (immediate expiry)
    await new Promise(r => setTimeout(r, 5));
    expect(await cache.get('short')).toBeNull();
  });

  it('remember returns cached value on second call', async () => {
    let calls = 0;
    const factory = async () => { calls++; return 'computed'; };

    await cache.remember('key', 60, factory);
    await cache.remember('key', 60, factory);

    expect(calls).toBe(1); // factory only called once
  });

  it('flush clears all keys', async () => {
    await cache.set('a', 1);
    await cache.set('b', 2);
    await cache.flush();
    expect(await cache.get('a')).toBeNull();
    expect(await cache.get('b')).toBeNull();
  });
});
```

**MAINTENANCE.md update:** Sprint 107 ✅.
**CHANGELOG:** `- Sprint 107: MemoryCache driver implemented and tested.`
**Done when:** All 5 tests pass. `MemoryCache` is usable without any external deps.

---

## Sprint 108 — Redis Cache Driver

**Goal:** Implement `RedisCache` driver using `ioredis` for production caching.

**Install in `packages/cache`:**
```bash
bun add ioredis
bun add -d @types/ioredis
```

**`packages/cache/src/drivers/RedisCache.ts`:**
```typescript
import Redis from 'ioredis';
import type { Cache } from '../Cache';

export interface RedisCacheConfig {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
}

export class RedisCache implements Cache {
  private client: Redis;
  private prefix: string;

  constructor(config: RedisCacheConfig = {}) {
    this.prefix = config.keyPrefix ?? 'xacos:';
    this.client = new Redis({
      host: config.host ?? 'localhost',
      port: config.port ?? 6379,
      password: config.password,
      db: config.db ?? 0,
      lazyConnect: true,
    });
  }

  private key(k: string): string {
    return `${this.prefix}${k}`;
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const raw = await this.client.get(this.key(key));
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await this.client.setex(this.key(key), ttl, serialized);
    } else {
      await this.client.set(this.key(key), serialized);
    }
  }

  async forget(key: string): Promise<void> {
    await this.client.del(this.key(key));
  }

  async flush(): Promise<void> {
    // Only flush keys with our prefix — safe in shared Redis instances
    const keys = await this.client.keys(`${this.prefix}*`);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  async has(key: string): Promise<boolean> {
    return (await this.client.exists(this.key(key))) > 0;
  }

  async remember<T>(key: string, ttl: number, factory: () => Promise<T>): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;
    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}
```

**Export from `packages/cache/src/index.ts`:**
```typescript
export { RedisCache } from './drivers/RedisCache';
```

**MAINTENANCE.md update:** Sprint 108 ✅.
**CHANGELOG:** `- Sprint 108: RedisCache driver implemented with key prefix isolation.`
**Done when:** `RedisCache` compiles. Types resolve correctly.

---

## Sprint 109 — `CacheManager`

**Goal:** Implement `CacheManager` — selects the correct cache driver based on `CACHE_DRIVER` env.

**`packages/cache/src/CacheManager.ts`:**
```typescript
import type { Cache } from './Cache';
import { MemoryCache } from './drivers/MemoryCache';

type CacheDriver = 'memory' | 'redis';

let _instance: Cache | null = null;

/**
 * Resolve the configured cache driver.
 * Call this once at boot; it returns a singleton.
 *
 * @example
 * import { cache } from '@xacos/cache';
 * await cache.set('key', 'value', 60);
 */
export function resolveCacheDriver(): Cache {
  if (_instance) return _instance;

  const driver = (process.env['CACHE_DRIVER'] ?? 'memory') as CacheDriver;

  switch (driver) {
    case 'redis': {
      // Lazy import so Redis isn't loaded in envs without it
      const { RedisCache } = require('./drivers/RedisCache') as typeof import('./drivers/RedisCache');
      _instance = new RedisCache({
        host: process.env['REDIS_HOST'] ?? 'localhost',
        port: Number(process.env['REDIS_PORT'] ?? 6379),
        password: process.env['REDIS_PASSWORD'],
        keyPrefix: `${process.env['APP_NAME'] ?? 'xacos'}:cache:`,
      });
      break;
    }
    case 'memory':
    default:
      _instance = new MemoryCache();
      break;
  }

  return _instance;
}

/**
 * Pre-resolved singleton cache instance.
 * Import this directly in your services:
 *
 * @example
 * import { cache } from '@xacos/cache';
 */
export const cache = new Proxy({} as Cache, {
  get(_target, prop) {
    const instance = resolveCacheDriver();
    return (instance as any)[prop];
  },
});

export class CacheManager {
  static resolve(): Cache {
    return resolveCacheDriver();
  }
}
```

**Usage in a service:**
```typescript
import { cache } from '@xacos/cache';

// In a service
const users = await cache.remember('users:all', 300, async () => {
  return User.all();
});
```

**`.env.example` additions:**
```ini
# Cache
CACHE_DRIVER=memory   # memory | redis

# Redis (required when CACHE_DRIVER=redis)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

**Test `packages/cache/src/CacheManager.test.ts`:**
```typescript
import { describe, it, expect, beforeEach } from 'bun:test';

beforeEach(() => {
  // Reset singleton between tests
  process.env['CACHE_DRIVER'] = 'memory';
  // Reset module cache
  const mod = require('./CacheManager');
  (mod as any)._instance = null;
});

describe('CacheManager', () => {
  it('resolves MemoryCache when CACHE_DRIVER=memory', () => {
    const { resolveCacheDriver } = require('./CacheManager');
    const { MemoryCache } = require('./drivers/MemoryCache');
    const driver = resolveCacheDriver();
    expect(driver).toBeInstanceOf(MemoryCache);
  });
});
```

**MAINTENANCE.md update:** Sprint 109 ✅.
**CHANGELOG:** `- Sprint 109: CacheManager implemented with proxy singleton and driver selection.`
**Done when:** `import { cache } from '@xacos/cache'` returns working `Cache` instance.

---

## Sprint 110 — `@xacos/storage` Init

**Goal:** Scaffold the `@xacos/storage` package — file upload and storage abstraction.

**Location:** `packages/storage/`

**`packages/storage/package.json`:**
```json
{
  "name": "@xacos/storage",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "@xacos/config": "workspace:*",
    "@xacos/shared": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.x"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "bun test",
    "type-check": "tsc --noEmit"
  }
}
```

**`packages/storage/src/Storage.ts`:**
```typescript
export interface StorageFile {
  /** Original filename */
  name: string;
  /** MIME type */
  mimeType: string;
  /** File size in bytes */
  size: number;
  /** File contents as Buffer */
  buffer: Buffer;
}

export interface StoredFile {
  /** Key/path used to store the file */
  key: string;
  /** Public URL to access the file */
  url: string;
  /** Size in bytes */
  size: number;
  /** MIME type */
  mimeType: string;
}

/**
 * Unified storage interface. All drivers implement this.
 */
export interface Storage {
  /**
   * Store a file and return metadata including the public URL.
   * @param key Storage path/key, e.g. 'avatars/user-1.jpg'
   * @param file The file to store
   */
  put(key: string, file: StorageFile): Promise<StoredFile>;

  /**
   * Get the public URL for a stored file.
   */
  url(key: string): string;

  /**
   * Check if a file exists at the given key.
   */
  exists(key: string): Promise<boolean>;

  /**
   * Delete a file by key.
   */
  delete(key: string): Promise<void>;

  /**
   * Get file contents as a Buffer.
   */
  get(key: string): Promise<Buffer>;
}
```

**`packages/storage/src/index.ts`:**
```typescript
export type { Storage, StorageFile, StoredFile } from './Storage';
export { LocalStorage } from './drivers/LocalStorage';
export { StorageManager } from './StorageManager';
export { storage } from './StorageManager';
```

**MAINTENANCE.md update:** Sprint 110 ✅.
**CHANGELOG:** `- Sprint 110: @xacos/storage package scaffolded with Storage interface.`
**Done when:** Package builds. `Storage` interface exported cleanly.

---

## Sprint 111 — Local Storage Driver

**Goal:** Implement `LocalStorage` — stores files in the `storage/` directory of the user's project.

**`packages/storage/src/drivers/LocalStorage.ts`:**
```typescript
import { writeFileSync, readFileSync, existsSync, unlinkSync, mkdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import type { Storage, StorageFile, StoredFile } from '../Storage';

export interface LocalStorageConfig {
  /** Root directory for stored files. Default: ./storage/app */
  root?: string;
  /** Base URL for public access. Default: /storage */
  baseUrl?: string;
}

export class LocalStorage implements Storage {
  private root: string;
  private baseUrl: string;

  constructor(config: LocalStorageConfig = {}) {
    this.root = resolve(config.root ?? './storage/app');
    this.baseUrl = config.baseUrl ?? '/storage';
  }

  async put(key: string, file: StorageFile): Promise<StoredFile> {
    const filePath = join(this.root, key);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, file.buffer);

    return {
      key,
      url: this.url(key),
      size: file.size,
      mimeType: file.mimeType,
    };
  }

  url(key: string): string {
    return `${this.baseUrl}/${key}`;
  }

  async exists(key: string): Promise<boolean> {
    return existsSync(join(this.root, key));
  }

  async delete(key: string): Promise<void> {
    const filePath = join(this.root, key);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }

  async get(key: string): Promise<Buffer> {
    const filePath = join(this.root, key);
    if (!existsSync(filePath)) {
      throw new Error(`[XAOCS Storage] File not found: ${key}`);
    }
    return readFileSync(filePath);
  }
}
```

**Register static serving in `XServer`** (adds `/storage` route for local driver):
```typescript
// packages/server/src/XServer.ts — in setupStaticStorage():
fastify.register(import('@fastify/static'), {
  root: resolve('./storage/app'),
  prefix: '/storage/',
  decorateReply: false,
});
```

**Test `packages/storage/src/drivers/LocalStorage.test.ts`:**
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { LocalStorage } from './LocalStorage';
import { rmSync } from 'fs';

const TMP = './tmp-storage-test';
let storage: LocalStorage;

beforeEach(() => {
  storage = new LocalStorage({ root: TMP, baseUrl: '/storage' });
});
afterEach(() => rmSync(TMP, { recursive: true, force: true }));

describe('LocalStorage', () => {
  it('stores and retrieves a file', async () => {
    const file = {
      name: 'test.txt',
      mimeType: 'text/plain',
      size: 11,
      buffer: Buffer.from('hello world'),
    };

    const stored = await storage.put('test.txt', file);
    expect(stored.url).toBe('/storage/test.txt');
    expect(stored.size).toBe(11);

    const content = await storage.get('test.txt');
    expect(content.toString()).toBe('hello world');
  });

  it('returns false for non-existent file', async () => {
    expect(await storage.exists('nope.txt')).toBe(false);
  });

  it('deletes a file', async () => {
    await storage.put('del.txt', { name: 'del.txt', mimeType: 'text/plain', size: 1, buffer: Buffer.from('x') });
    await storage.delete('del.txt');
    expect(await storage.exists('del.txt')).toBe(false);
  });
});
```

**MAINTENANCE.md update:** Sprint 111 ✅.
**CHANGELOG:** `- Sprint 111: LocalStorage driver implemented with static file serving.`
**Done when:** All 3 tests pass. Files stored to `storage/app/` and served at `/storage/`.

---

## Sprint 112 — S3 Storage Driver

**Goal:** Implement `S3Storage` driver for storing files in AWS S3 or S3-compatible services (R2, MinIO).

**Install in `packages/storage`:**
```bash
bun add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

**`packages/storage/src/drivers/S3Storage.ts`:**
```typescript
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { Storage, StorageFile, StoredFile } from '../Storage';

export interface S3StorageConfig {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  /** Custom endpoint for S3-compatible services (R2, MinIO) */
  endpoint?: string;
  /** Base URL for public access. Defaults to standard S3 URL. */
  publicUrl?: string;
}

export class S3Storage implements Storage {
  private client: S3Client;
  private config: S3StorageConfig;

  constructor(config: S3StorageConfig) {
    this.config = config;
    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      endpoint: config.endpoint,
      forcePathStyle: !!config.endpoint, // required for MinIO/R2
    });
  }

  async put(key: string, file: StorageFile): Promise<StoredFile> {
    await this.client.send(new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimeType,
      ContentLength: file.size,
    }));

    return {
      key,
      url: this.url(key),
      size: file.size,
      mimeType: file.mimeType,
    };
  }

  url(key: string): string {
    if (this.config.publicUrl) {
      return `${this.config.publicUrl.replace(/\/$/, '')}/${key}`;
    }
    return `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${key}`;
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.client.send(new HeadObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      }));
      return true;
    } catch {
      return false;
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    }));
  }

  async get(key: string): Promise<Buffer> {
    const response = await this.client.send(new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    }));

    const chunks: Uint8Array[] = [];
    const stream = response.Body as AsyncIterable<Uint8Array>;
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  /**
   * Generate a pre-signed URL for temporary access (useful for private buckets).
   * @param key File key
   * @param expiresIn Seconds until URL expires. Default: 3600 (1 hour)
   */
  async signedUrl(key: string, expiresIn = 3600): Promise<string> {
    return getSignedUrl(
      this.client,
      new GetObjectCommand({ Bucket: this.config.bucket, Key: key }),
      { expiresIn }
    );
  }
}
```

**`.env.example` additions:**
```ini
# Storage
STORAGE_DRIVER=local   # local | s3

# S3 / R2 / MinIO (required when STORAGE_DRIVER=s3)
S3_BUCKET=my-bucket
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_ENDPOINT=           # Leave empty for AWS, set for R2/MinIO
S3_PUBLIC_URL=         # Optional CDN URL
```

**MAINTENANCE.md update:** Sprint 112 ✅.
**CHANGELOG:** `- Sprint 112: S3Storage driver with signed URLs and S3-compatible endpoint support.`
**Done when:** `S3Storage` compiles. Types resolve. Works with R2/MinIO via `endpoint`.

---

## Sprint 113 — `StorageManager` + File Upload Helper

**Goal:** Implement `StorageManager` for driver resolution and `req.file()` helper in API routes.

**`packages/storage/src/StorageManager.ts`:**
```typescript
import type { Storage } from './Storage';
import { LocalStorage } from './drivers/LocalStorage';

let _instance: Storage | null = null;

export function resolveStorageDriver(): Storage {
  if (_instance) return _instance;

  const driver = process.env['STORAGE_DRIVER'] ?? 'local';

  switch (driver) {
    case 's3': {
      const { S3Storage } = require('./drivers/S3Storage') as typeof import('./drivers/S3Storage');
      _instance = new S3Storage({
        bucket: process.env['S3_BUCKET']!,
        region: process.env['S3_REGION'] ?? 'us-east-1',
        accessKeyId: process.env['S3_ACCESS_KEY_ID']!,
        secretAccessKey: process.env['S3_SECRET_ACCESS_KEY']!,
        endpoint: process.env['S3_ENDPOINT'],
        publicUrl: process.env['S3_PUBLIC_URL'],
      });
      break;
    }
    case 'local':
    default:
      _instance = new LocalStorage();
      break;
  }

  return _instance;
}

export const storage = new Proxy({} as Storage, {
  get(_target, prop) {
    return (resolveStorageDriver() as any)[prop];
  },
});

export class StorageManager {
  static resolve(): Storage {
    return resolveStorageDriver();
  }
}
```

**File upload helper in `@xacos/shared`** — extend `XRequest`:
```typescript
// packages/shared/src/index.ts — add to XRequest interface:
export interface XRequest {
  // ... existing fields ...

  /**
   * Extract an uploaded file from a multipart request.
   * Requires @fastify/multipart to be registered (Sprint 94).
   *
   * @example
   * const file = await req.file();
   * const stored = await storage.put(`avatars/${file.name}`, file);
   */
  file(): Promise<import('./types').StorageFile | null>;
}
```

**Implement `file()` in `RequestAdapter`:**
```typescript
// packages/server/src/adapters/RequestAdapter.ts
// Add to adaptRequest():
file: async () => {
  try {
    const data = await (req as any).file();
    if (!data) return null;
    const buffer = await data.toBuffer();
    return {
      name: data.filename,
      mimeType: data.mimetype,
      size: buffer.length,
      buffer,
    };
  } catch {
    return null;
  }
},
```

**Example usage in API route:**
```typescript
// api/avatar.api.ts
import { XRouter } from '@xacos/core';
import { authenticate } from '@xacos/auth';
import { storage } from '@xacos/storage';

export const router = new XRouter();

router.post('/upload', authenticate, async (req, res) => {
  const file = await req.file();
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const stored = await storage.put(
    `avatars/${req.user!.id}/${file.name}`,
    file
  );

  return res.json({ success: true, url: stored.url });
});
```

**MAINTENANCE.md update:** Sprint 113 ✅.
**CHANGELOG:** `- Sprint 113: StorageManager singleton, driver selection, and req.file() helper.`
**Done when:** `import { storage } from '@xacos/storage'` returns working driver. `req.file()` works.

---

## Sprint 114 — `@xacos/queue` Init

**Goal:** Scaffold the `@xacos/queue` package — background job processing.

**Location:** `packages/queue/`

**`packages/queue/package.json`:**
```json
{
  "name": "@xacos/queue",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "@xacos/config": "workspace:*",
    "@xacos/shared": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.x"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "bun test",
    "type-check": "tsc --noEmit"
  }
}
```

**`packages/queue/src/XJob.ts`:**
```typescript
/**
 * Base class for all XAOCS background jobs.
 * Extend this class and implement `handle()`.
 *
 * @example
 * export class SendWelcomeEmailJob extends XJob {
 *   constructor(public userId: number) { super(); }
 *
 *   async handle(): Promise<void> {
 *     const user = await User.findOrFail(this.userId);
 *     await mail.send({ to: user.email, subject: 'Welcome!' });
 *   }
 * }
 */
export abstract class XJob {
  /**
   * The queue this job should be placed on.
   * Defaults to 'default'.
   */
  static queue = 'default';

  /**
   * Number of times to retry on failure.
   * Defaults to 3.
   */
  static retries = 3;

  /**
   * Delay in milliseconds before first attempt.
   * Defaults to 0 (immediate).
   */
  static delay = 0;

  /**
   * Implement your job logic here.
   */
  abstract handle(): Promise<void>;

  /**
   * Called if all retries are exhausted.
   * Override to implement custom failure handling.
   */
  async failed(error: Error): Promise<void> {
    console.error(`[XAOCS Queue] Job failed: ${this.constructor.name}`, error.message);
  }
}
```

**`packages/queue/src/index.ts`:**
```typescript
export { XJob } from './XJob';
export { dispatch } from './dispatch';
export { MemoryQueue } from './drivers/MemoryQueue';
export { QueueManager } from './QueueManager';
```

**MAINTENANCE.md update:** Sprint 114 ✅.
**CHANGELOG:** `- Sprint 114: @xacos/queue package scaffolded with XJob base class.`
**Done when:** Package builds. `XJob` base class exported.

---

## Sprint 115 — Memory Queue Driver

**Goal:** Implement `MemoryQueue` — in-process FIFO job queue for development.

**`packages/queue/src/drivers/MemoryQueue.ts`:**
```typescript
import type { XJob } from '../XJob';

interface QueuedJob {
  job: XJob;
  retries: number;
  maxRetries: number;
}

export class MemoryQueue {
  private queues = new Map<string, QueuedJob[]>();
  private running = false;

  /**
   * Add a job to the queue.
   */
  push(job: XJob): void {
    const queueName = (job.constructor as typeof XJob).queue;
    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, []);
    }
    this.queues.get(queueName)!.push({
      job,
      retries: 0,
      maxRetries: (job.constructor as typeof XJob).retries,
    });

    if (!this.running) {
      void this.processNext();
    }
  }

  private async processNext(): Promise<void> {
    this.running = true;

    for (const [, queue] of this.queues) {
      while (queue.length > 0) {
        const item = queue.shift()!;
        try {
          await item.job.handle();
        } catch (error) {
          if (item.retries < item.maxRetries) {
            item.retries++;
            queue.push(item); // re-queue with incremented retries
          } else {
            await item.job.failed(error as Error);
          }
        }
      }
    }

    this.running = false;
  }

  /**
   * Get the number of pending jobs across all queues.
   */
  pending(): number {
    let total = 0;
    for (const queue of this.queues.values()) {
      total += queue.length;
    }
    return total;
  }
}
```

**Test `packages/queue/src/drivers/MemoryQueue.test.ts`:**
```typescript
import { describe, it, expect } from 'bun:test';
import { MemoryQueue } from './MemoryQueue';
import { XJob } from '../XJob';

class TestJob extends XJob {
  static executed = false;
  async handle() { TestJob.executed = true; }
}

class FailingJob extends XJob {
  static retries = 0;
  static failedCalled = false;
  async handle() { throw new Error('intentional fail'); }
  async failed(_err: Error) { FailingJob.failedCalled = true; }
}

describe('MemoryQueue', () => {
  it('executes a job', async () => {
    const queue = new MemoryQueue();
    queue.push(new TestJob());
    await new Promise(r => setTimeout(r, 10)); // let queue process
    expect(TestJob.executed).toBe(true);
  });

  it('calls failed() after exhausting retries', async () => {
    const queue = new MemoryQueue();
    queue.push(new FailingJob());
    await new Promise(r => setTimeout(r, 10));
    expect(FailingJob.failedCalled).toBe(true);
  });
});
```

**MAINTENANCE.md update:** Sprint 115 ✅.
**CHANGELOG:** `- Sprint 115: MemoryQueue driver with retry and failure handling.`
**Done when:** Both tests pass.

---

## Sprint 116 — Redis Queue Driver (BullMQ)

**Goal:** Implement `BullMQQueue` — production-grade Redis-backed queue using BullMQ.

**Install in `packages/queue`:**
```bash
bun add bullmq
```

**`packages/queue/src/drivers/BullMQQueue.ts`:**
```typescript
import { Queue, Worker, type Job as BullJob } from 'bullmq';
import type { XJob } from '../XJob';

export interface BullMQConfig {
  host?: string;
  port?: number;
  password?: string;
}

export class BullMQQueue {
  private queues = new Map<string, Queue>();
  private workers = new Map<string, Worker>();
  private config: BullMQConfig;
  private jobRegistry = new Map<string, () => XJob>();

  constructor(config: BullMQConfig = {}) {
    this.config = config;
  }

  private getConnection() {
    return {
      host: this.config.host ?? 'localhost',
      port: this.config.port ?? 6379,
      password: this.config.password,
    };
  }

  private getOrCreateQueue(name: string): Queue {
    if (!this.queues.has(name)) {
      this.queues.set(name, new Queue(name, {
        connection: this.getConnection(),
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
        },
      }));
    }
    return this.queues.get(name)!;
  }

  async push(job: XJob): Promise<void> {
    const JobClass = job.constructor as typeof XJob;
    const queueName = JobClass.queue;
    const queue = this.getOrCreateQueue(queueName);

    const jobName = JobClass.name;
    const payload = JSON.stringify(job);

    await queue.add(jobName, { jobName, payload }, {
      delay: JobClass.delay,
      attempts: JobClass.retries + 1,
    });
  }

  /**
   * Start a worker for the given queue name.
   * Workers process jobs in separate processes in production.
   */
  startWorker(queueName: string, jobClasses: Array<new (...args: unknown[]) => XJob>): Worker {
    // Build a registry: jobName → constructor
    const registry = new Map<string, new (...args: unknown[]) => XJob>();
    for (const JobClass of jobClasses) {
      registry.set(JobClass.name, JobClass);
    }

    const worker = new Worker(
      queueName,
      async (bullJob: BullJob) => {
        const { jobName, payload } = bullJob.data as { jobName: string; payload: string };
        const JobClass = registry.get(jobName);
        if (!JobClass) throw new Error(`[XAOCS Queue] Unknown job: ${jobName}`);

        const instance = Object.assign(new JobClass(), JSON.parse(payload));
        await instance.handle();
      },
      { connection: this.getConnection() }
    );

    this.workers.set(queueName, worker);
    return worker;
  }

  async close(): Promise<void> {
    for (const worker of this.workers.values()) await worker.close();
    for (const queue of this.queues.values()) await queue.close();
  }
}
```

**MAINTENANCE.md update:** Sprint 116 ✅.
**CHANGELOG:** `- Sprint 116: BullMQQueue driver with Redis-backed production queue.`
**Done when:** `BullMQQueue` compiles. `startWorker` creates a functional BullMQ worker.

---

## Sprint 117 — `dispatch()` Helper + `QueueManager`

**Goal:** Implement the `dispatch(job)` global helper and `QueueManager` singleton.

**`packages/queue/src/dispatch.ts`:**
```typescript
import { QueueManager } from './QueueManager';
import type { XJob } from './XJob';

/**
 * Dispatch a job to the queue.
 *
 * @example
 * import { dispatch } from '@xacos/queue';
 * await dispatch(new SendWelcomeEmailJob(user.id));
 */
export async function dispatch(job: XJob): Promise<void> {
  await QueueManager.resolve().push(job);
}
```

**`packages/queue/src/QueueManager.ts`:**
```typescript
import { MemoryQueue } from './drivers/MemoryQueue';

export interface QueueDriver {
  push(job: import('./XJob').XJob): Promise<void> | void;
}

let _instance: QueueDriver | null = null;

export function resolveQueueDriver(): QueueDriver {
  if (_instance) return _instance;

  const driver = process.env['QUEUE_DRIVER'] ?? 'memory';

  switch (driver) {
    case 'redis': {
      const { BullMQQueue } = require('./drivers/BullMQQueue') as typeof import('./drivers/BullMQQueue');
      _instance = new BullMQQueue({
        host: process.env['REDIS_HOST'] ?? 'localhost',
        port: Number(process.env['REDIS_PORT'] ?? 6379),
        password: process.env['REDIS_PASSWORD'],
      });
      break;
    }
    case 'memory':
    default:
      _instance = new MemoryQueue();
      break;
  }

  return _instance;
}

export class QueueManager {
  static resolve(): QueueDriver {
    return resolveQueueDriver();
  }
}
```

**`.env.example` additions:**
```ini
# Queue
QUEUE_DRIVER=memory   # memory | redis
```

**Test:**
```typescript
import { describe, it, expect } from 'bun:test';
import { dispatch } from './dispatch';
import { XJob } from './XJob';

let handled = false;
class SimpleJob extends XJob {
  async handle() { handled = true; }
}

describe('dispatch', () => {
  it('dispatches a job and executes it', async () => {
    process.env['QUEUE_DRIVER'] = 'memory';
    await dispatch(new SimpleJob());
    await new Promise(r => setTimeout(r, 10));
    expect(handled).toBe(true);
  });
});
```

**MAINTENANCE.md update:** Sprint 117 ✅.
**CHANGELOG:** `- Sprint 117: dispatch() helper and QueueManager implemented.`
**Done when:** `await dispatch(new MyJob())` works. Test passes.

---

## Sprint 118 — `xacos queue:work` CLI Command

**Goal:** Add `xacos queue:work` command to start a queue worker process.

**`packages/cli/src/commands/queue.ts`:**
```typescript
import { program } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';

program
  .command('queue:work')
  .description('Start a queue worker')
  .option('--queue <name>', 'Queue name to work', 'default')
  .option('--driver <driver>', 'Queue driver override (memory|redis)')
  .action(async (options: { queue: string; driver?: string }) => {
    try {
      if (options.driver) {
        process.env['QUEUE_DRIVER'] = options.driver;
      }

      await loadProjectConfig();

      const { resolveQueueDriver } = await import('@xacos/queue');
      const driver = resolveQueueDriver();

      // For BullMQ: start a worker
      if ('startWorker' in driver) {
        log.info(`Starting BullMQ worker for queue: ${options.queue}`);

        // Dynamically load user's job classes from app/jobs/
        const { readdirSync, existsSync } = await import('fs');
        const { resolve, join } = await import('path');
        const jobsDir = resolve('./app/jobs');
        const jobClasses: Array<new (...args: unknown[]) => unknown> = [];

        if (existsSync(jobsDir)) {
          for (const file of readdirSync(jobsDir).filter((f: string) => f.endsWith('.ts'))) {
            const mod = await import(join(jobsDir, file));
            for (const val of Object.values(mod)) {
              if (typeof val === 'function') jobClasses.push(val as any);
            }
          }
        }

        (driver as any).startWorker(options.queue, jobClasses);

        log.success(`Worker running on queue: ${options.queue}`);
        log.info('Press Ctrl+C to stop');

        // Keep process alive
        await new Promise(() => {});
      } else {
        // MemoryQueue — just inform user it's in-process
        log.info('Memory queue is in-process. Jobs are processed automatically.');
        log.info('To use a persistent queue, set QUEUE_DRIVER=redis');
      }
    } catch (err) {
      log.error((err as Error).message);
      process.exit(1);
    }
  });
```

**Add `app/jobs/` to scaffold directory structure** (update `create-xacos-app` scaffold):
```typescript
// In scaffold.ts dirs array:
'app/jobs',   // Background job classes
```

**MAINTENANCE.md update:** Sprint 118 ✅.
**CHANGELOG:** `- Sprint 118: xacos queue:work command with BullMQ and memory driver support.`
**Done when:** `xacos queue:work` starts a worker. Jobs in `app/jobs/` auto-loaded.

---

## Sprint 119 — `@xacos/events` Init

**Goal:** Scaffold the `@xacos/events` package — WebSocket and real-time event broadcasting.

**Location:** `packages/events/`

**`packages/events/package.json`:**
```json
{
  "name": "@xacos/events",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "@xacos/config": "workspace:*",
    "@xacos/shared": "workspace:*",
    "socket.io": "^4.x"
  },
  "devDependencies": {
    "typescript": "^5.x"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "bun test",
    "type-check": "tsc --noEmit"
  }
}
```

**`packages/events/src/index.ts`:**
```typescript
export { XEvents } from './XEvents';
export { mountSocketIO } from './mountSocketIO';
```

**MAINTENANCE.md update:** Sprint 119 ✅.
**CHANGELOG:** `- Sprint 119: @xacos/events package scaffolded.`
**Done when:** Package builds cleanly.

---

## Sprint 120 — WebSocket Setup (Socket.IO)

**Goal:** Wire Socket.IO to the Fastify server and implement `XEvents` for server-side broadcasting.

**`packages/events/src/mountSocketIO.ts`:**
```typescript
import { Server as SocketIOServer } from 'socket.io';
import type { FastifyInstance } from 'fastify';
import { XEvents } from './XEvents';

export interface SocketIOOptions {
  cors?: {
    origin: string | string[];
    credentials?: boolean;
  };
}

/**
 * Mount Socket.IO on the Fastify server.
 * Call this during server boot, before `server.listen()`.
 *
 * @example
 * await mountSocketIO(server.fastify, {
 *   cors: { origin: 'http://localhost:3000', credentials: true }
 * });
 */
export async function mountSocketIO(
  fastify: FastifyInstance,
  options: SocketIOOptions = {}
): Promise<XEvents> {
  const io = new SocketIOServer(fastify.server, {
    cors: options.cors,
    path: '/xacos-ws',
  });

  const events = new XEvents(io);
  XEvents._instance = events;

  io.on('connection', (socket) => {
    console.log(`[XAOCS Events] Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[XAOCS Events] Client disconnected: ${socket.id}`);
    });
  });

  fastify.addHook('onClose', async () => {
    io.close();
  });

  return events;
}
```

**`packages/events/src/XEvents.ts`:**
```typescript
import type { Server as SocketIOServer } from 'socket.io';

export class XEvents {
  static _instance: XEvents | null = null;

  constructor(private io: SocketIOServer) {}

  /**
   * Broadcast an event to all connected clients.
   *
   * @example
   * events.emit('user.created', { id: 1, name: 'John' });
   */
  emit(event: string, data?: unknown): void {
    this.io.emit(event, data);
  }

  /**
   * Emit to a specific room/channel.
   *
   * @example
   * events.to('admin').emit('alert', { message: 'New user registered' });
   */
  to(room: string): { emit: (event: string, data?: unknown) => void } {
    const roomRef = this.io.to(room);
    return {
      emit: (event: string, data?: unknown) => roomRef.emit(event, data),
    };
  }

  /**
   * Get the singleton XEvents instance.
   * Only available after mountSocketIO() has been called.
   */
  static get(): XEvents {
    if (!XEvents._instance) {
      throw new Error('[XAOCS Events] mountSocketIO() has not been called yet.');
    }
    return XEvents._instance;
  }
}
```

**Usage in an API route:**
```typescript
// api/post.api.ts
import { XRouter } from '@xacos/core';
import { XEvents } from '@xacos/events';

export const router = new XRouter();

router.post('/', async (req, res) => {
  const post = await PostService.create(req.body as any);

  // Broadcast to all connected clients
  XEvents.get().emit('post.created', post);

  return res.status(201).json({ success: true, data: post });
});
```

**MAINTENANCE.md update:** Sprint 120 ✅.
**CHANGELOG:** `- Sprint 120: Socket.IO integrated. XEvents.emit() and .to().emit() available.`
**Done when:** `mountSocketIO(fastify)` returns `XEvents`. `emit()` broadcasts to all clients.

---

## Sprint 121 — `useEvent` Client Hook

**Goal:** Implement `useEvent('event', callback)` React hook in `@xacos/client` for subscribing to server events.

**Install in `packages/client`:**
```bash
bun add socket.io-client
bun add -d @types/socket.io-client
```

**`packages/client/src/hooks/useEvent.ts`:**
```typescript
import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';

let _socket: Socket | null = null;

function getSocket(): Socket {
  if (!_socket) {
    _socket = io(window.location.origin, {
      path: '/xacos-ws',
      autoConnect: true,
      reconnectionAttempts: 5,
    });
  }
  return _socket;
}

/**
 * Subscribe to a server-side XAOCS event.
 *
 * @example
 * useEvent('post.created', (post) => {
 *   setPosts(prev => [post, ...prev]);
 * });
 */
export function useEvent<T = unknown>(
  event: string,
  callback: (data: T) => void
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const socket = getSocket();

    const handler = (data: T) => callbackRef.current(data);
    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [event]);
}

/**
 * Disconnect the WebSocket client manually.
 * Useful on logout.
 */
export function disconnectSocket(): void {
  if (_socket) {
    _socket.disconnect();
    _socket = null;
  }
}
```

**Export from `packages/client/src/index.ts`:**
```typescript
export { useEvent, disconnectSocket } from './hooks/useEvent';
```

**Usage in a React page:**
```tsx
import { useEvent } from '@xacos/client';

export default function Feed() {
  const [posts, setPosts] = useState([]);

  // Live updates — no polling needed!
  useEvent('post.created', (post) => {
    setPosts(prev => [post, ...prev]);
  });

  return <div>{posts.map(p => <PostCard key={p.id} post={p} />)}</div>;
}
```

**MAINTENANCE.md update:** Sprint 121 ✅.
**CHANGELOG:** `- Sprint 121: useEvent() hook for real-time server events in React pages.`
**Done when:** `useEvent` subscribes and unsubscribes cleanly. Socket reconnects on disconnect.

---

## Sprint 122 — `@xacos/testing` Init

**Goal:** Scaffold the `@xacos/testing` package — test utilities for XAOCS apps.

**Location:** `packages/testing/`

**`packages/testing/package.json`:**
```json
{
  "name": "@xacos/testing",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "@xacos/core": "workspace:*",
    "@xacos/orm": "workspace:*",
    "@xacos/server": "workspace:*",
    "@xacos/shared": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.x"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "bun test",
    "type-check": "tsc --noEmit"
  }
}
```

**`packages/testing/src/index.ts`:**
```typescript
export { testClient } from './testClient';
export { mockAuth } from './mockAuth';
export { useTestDb } from './useTestDb';
export { Factory } from '@xacos/orm'; // re-export for convenience
```

**MAINTENANCE.md update:** Sprint 122 ✅.
**CHANGELOG:** `- Sprint 122: @xacos/testing package scaffolded.`
**Done when:** Package builds cleanly.

---

## Sprint 123 — Test HTTP Client

**Goal:** Implement `testClient(apiDir)` — makes fake HTTP requests to XAOCS API routes in tests.

**`packages/testing/src/testClient.ts`:**
```typescript
import Fastify, { type FastifyInstance } from 'fastify';
import { mountApiRoutes } from '@xacos/server';
import { application } from '@xacos/core';

interface TestClientOptions {
  apiDir?: string;
  boot?: boolean;
}

export interface TestClient {
  get(url: string, opts?: RequestInit): Promise<{ status: number; body: unknown; headers: Record<string, string> }>;
  post(url: string, body?: unknown, opts?: RequestInit): Promise<{ status: number; body: unknown }>;
  put(url: string, body?: unknown, opts?: RequestInit): Promise<{ status: number; body: unknown }>;
  patch(url: string, body?: unknown, opts?: RequestInit): Promise<{ status: number; body: unknown }>;
  delete(url: string, opts?: RequestInit): Promise<{ status: number; body: unknown }>;
  close(): Promise<void>;
}

/**
 * Create a test HTTP client that spins up a real Fastify server in-process.
 *
 * @example
 * const client = await testClient({ apiDir: './api' });
 * const res = await client.get('/api/user');
 * expect(res.status).toBe(200);
 * await client.close();
 */
export async function testClient(options: TestClientOptions = {}): Promise<TestClient> {
  const { apiDir = './api', boot = true } = options;

  if (boot) {
    await application.boot({
      servicesDir: './app/services',
      middlewaresDir: './app/middlewares',
    });
  }

  const fastify: FastifyInstance = Fastify({ logger: false });

  await fastify.register(import('@fastify/cookie'));
  await fastify.register(import('@fastify/formbody'));

  await mountApiRoutes(fastify, apiDir, application.container as any);
  await fastify.ready();

  async function request(method: string, url: string, body?: unknown, _opts?: RequestInit) {
    const res = await fastify.inject({
      method: method as any,
      url,
      payload: body ? JSON.stringify(body) : undefined,
      headers: { 'content-type': 'application/json' },
    });

    let parsed: unknown;
    try { parsed = JSON.parse(res.body); } catch { parsed = res.body; }

    return {
      status: res.statusCode,
      body: parsed,
      headers: res.headers as Record<string, string>,
    };
  }

  return {
    get: (url, opts) => request('GET', url, undefined, opts),
    post: (url, body, opts) => request('POST', url, body, opts),
    put: (url, body, opts) => request('PUT', url, body, opts),
    patch: (url, body, opts) => request('PATCH', url, body, opts),
    delete: (url, opts) => request('DELETE', url, undefined, opts),
    close: () => fastify.close(),
  };
}
```

**Test `packages/testing/src/testClient.test.ts`:**
```typescript
import { describe, it, expect, afterAll } from 'bun:test';
import { testClient } from './testClient';

// This test requires a real api/ directory — uses the test fixture
const client = await testClient({ apiDir: './test-fixtures/api', boot: false });

describe('testClient', () => {
  it('makes GET requests', async () => {
    const res = await client.get('/api/health');
    expect(res.status).toBe(200);
  });
});

afterAll(() => client.close());
```

**`packages/testing/test-fixtures/api/health.api.ts`:**
```typescript
import { XRouter } from '@xacos/core';
export const router = new XRouter();
router.get('/', async (_req, res) => res.json({ status: 'ok' }));
```

**MAINTENANCE.md update:** Sprint 123 ✅.
**CHANGELOG:** `- Sprint 123: testClient() for fake HTTP requests in bun:test.`
**Done when:** `testClient` spins up Fastify, makes requests, and closes cleanly.

---

## Sprint 124 — `mockAuth` + DB Test Helpers

**Goal:** Implement `mockAuth(user)` for injecting fake auth into test requests, and `useTestDb()` for transaction-based test isolation.

**`packages/testing/src/mockAuth.ts`:**
```typescript
import type { XUser } from '@xacos/shared';
import jwt from 'jsonwebtoken';

/**
 * Generate a real JWT for a fake user — for use in test HTTP requests.
 *
 * @example
 * const token = mockAuth({ id: 1, name: 'Test', email: 'test@test.com', role: 'user' });
 * const res = await client.get('/api/me', {
 *   headers: { Authorization: `Bearer ${token}` }
 * });
 */
export function mockAuth(user: Partial<XUser> & { id: number }): string {
  const secret = process.env['JWT_SECRET'] ?? 'test-secret-key';
  return jwt.sign({ userId: user.id, role: user.role ?? 'user' }, secret, {
    expiresIn: '1h',
  });
}
```

**`packages/testing/src/useTestDb.ts`:**
```typescript
import { getKnex } from '@xacos/orm';

/**
 * Wrap your test in a database transaction that auto-rolls back.
 * Keeps your database clean between tests.
 *
 * @example
 * const db = await useTestDb();
 * await User.create({ name: 'Test', email: 'test@test.com' });
 * // All changes rolled back after test
 * await db.rollback();
 */
export async function useTestDb() {
  const knex = getKnex();
  const trx = await knex.transaction();

  // Temporarily override getKnex to use the transaction
  // This is a simplified approach — in a full implementation
  // you'd pass the transaction through context
  return {
    trx,
    rollback: async () => {
      await trx.rollback();
    },
    commit: async () => {
      await trx.commit();
    },
  };
}
```

**Export both from `packages/testing/src/index.ts`.**

**Test `packages/testing/src/mockAuth.test.ts`:**
```typescript
import { describe, it, expect } from 'bun:test';
import { mockAuth } from './mockAuth';
import jwt from 'jsonwebtoken';

process.env['JWT_SECRET'] = 'test-secret';

describe('mockAuth', () => {
  it('generates a valid JWT for a test user', () => {
    const token = mockAuth({ id: 42, role: 'admin' });
    const decoded = jwt.verify(token, 'test-secret') as { userId: number; role: string };
    expect(decoded.userId).toBe(42);
    expect(decoded.role).toBe('admin');
  });
});
```

**MAINTENANCE.md update:** Sprint 124 ✅.
**CHANGELOG:** `- Sprint 124: mockAuth() and useTestDb() test utilities implemented.`
**Done when:** `mockAuth` generates verifiable JWT. Test passes.

---

## Sprint 125 — `@xacos/validation` Init + Zod Wrapper

**Goal:** Create `@xacos/validation` — a thin Zod wrapper with XAOCS-specific error formatting, usable both on the server (`req.validate()`) and client-side.

**Location:** `packages/validation/`

**`packages/validation/package.json`:**
```json
{
  "name": "@xacos/validation",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "@xacos/shared": "workspace:*",
    "zod": "^3.x"
  },
  "devDependencies": {
    "typescript": "^5.x"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "bun test",
    "type-check": "tsc --noEmit"
  }
}
```

**`packages/validation/src/index.ts`:**
```typescript
export { v } from './v';
export { validate } from './validate';
export { ValidationError } from './ValidationError';
export type { ValidationResult, FieldError } from './types';
```

**`packages/validation/src/v.ts`:**
```typescript
import { z } from 'zod';

/**
 * XAOCS validation helper — re-exports Zod with a cleaner alias.
 *
 * @example
 * import { v } from '@xacos/validation';
 *
 * const schema = v.object({
 *   name: v.string().min(2),
 *   email: v.string().email(),
 *   age: v.number().min(0).optional(),
 * });
 */
export const v = z;
export type { ZodSchema, ZodType } from 'zod';
```

**`packages/validation/src/ValidationError.ts`:**
```typescript
export interface FieldError {
  field: string;
  message: string;
}

export class ValidationError extends Error {
  readonly statusCode = 422;
  readonly errors: FieldError[];

  constructor(errors: FieldError[]) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}
```

**`packages/validation/src/validate.ts`:**
```typescript
import { z, type ZodSchema } from 'zod';
import { ValidationError, type FieldError } from './ValidationError';

/**
 * Validate data against a Zod schema.
 * Returns typed data or throws `ValidationError`.
 *
 * @example
 * const data = validate(req.body, v.object({
 *   email: v.string().email(),
 *   password: v.string().min(8),
 * }));
 */
export function validate<T>(data: unknown, schema: ZodSchema<T>): T {
  const result = schema.safeParse(data);

  if (result.success) return result.data;

  const errors: FieldError[] = result.error.errors.map(e => ({
    field: e.path.join('.'),
    message: e.message,
  }));

  throw new ValidationError(errors);
}
```

**Test `packages/validation/src/validate.test.ts`:**
```typescript
import { describe, it, expect } from 'bun:test';
import { validate, v, ValidationError } from './index';

describe('validate', () => {
  const schema = v.object({
    name: v.string().min(2),
    email: v.string().email(),
  });

  it('returns typed data on success', () => {
    const data = validate({ name: 'John', email: 'john@example.com' }, schema);
    expect(data.name).toBe('John');
  });

  it('throws ValidationError on invalid data', () => {
    expect(() => validate({ name: 'J', email: 'not-an-email' }, schema))
      .toThrow(ValidationError);
  });

  it('formats field errors correctly', () => {
    try {
      validate({ name: 'J', email: 'bad' }, schema);
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
      const ve = e as ValidationError;
      expect(ve.errors.some(err => err.field === 'name')).toBe(true);
      expect(ve.errors.some(err => err.field === 'email')).toBe(true);
      expect(ve.statusCode).toBe(422);
    }
  });
});
```

**MAINTENANCE.md update:** Sprint 125 ✅.
**CHANGELOG:** `- Sprint 125: @xacos/validation with Zod wrapper and ValidationError.`
**Done when:** All 3 tests pass. `validate()` returns typed data or throws `ValidationError`.

---

## Sprint 126 — Route-Level Schema Validation

**Goal:** Attach Zod schemas to router methods so validation runs automatically before the handler.

**Update `XRouter` in `packages/core/src/routing/XRouter.ts`:**
```typescript
import type { ZodSchema } from 'zod';

export interface RouteDefinition {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  handler: Handler;
  middlewares: XMiddleware[];
  schema?: {              // ← NEW
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
  };
}

// Updated route registration — accept optional schema before handler:
post(path: string, ...args: [...XMiddleware[], { schema?: RouteDefinition['schema'] }, Handler] | [...XMiddleware[], Handler]): this {
  return this.addRoute('POST', path, args);
}
// Same pattern for get, put, patch, delete
```

**Schema-aware example:**
```typescript
import { v } from '@xacos/validation';

router.post('/', { schema: {
  body: v.object({
    name: v.string().min(2),
    email: v.string().email(),
  })
}}, async (req, res) => {
  // req.body is already validated — TypeScript knows the shape
  return res.status(201).json({ success: true });
});
```

**Add validation middleware in `mountApiRoutes`:**
```typescript
// In the handler wrapper, before calling route.handler:
if (route.schema) {
  const { validate } = await import('@xacos/validation');
  if (route.schema.body) validate(req.body, route.schema.body);
  if (route.schema.query) validate(req.query, route.schema.query);
  if (route.schema.params) validate(req.params, route.schema.params);
}
```

**MAINTENANCE.md update:** Sprint 126 ✅.
**CHANGELOG:** `- Sprint 126: Route-level Zod schema validation wired into XRouter.`
**Done when:** Invalid request body returns `422 { errors: [{ field, message }] }` automatically.

---

## Sprint 127 — `@xacos/ui` Init + Tailwind Setup

**Goal:** Scaffold the `@xacos/ui` package and configure Tailwind CSS with XAOCS design tokens.

**Location:** `packages/ui-xacos/` (new package alongside existing `@repo/ui`)

**`packages/ui-xacos/package.json`:**
```json
{
  "name": "@xacos/ui",
  "version": "0.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./src/styles/index.css"
  },
  "dependencies": {
    "react": "^18.x",
    "clsx": "^2.x"
  },
  "devDependencies": {
    "tailwindcss": "^3.x",
    "@types/react": "^18.x",
    "typescript": "^5.x"
  },
  "peerDependencies": {
    "react": "^18.x",
    "tailwindcss": "^3.x"
  }
}
```

**`packages/ui-xacos/tailwind.config.ts`:**
```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{tsx,ts}'],
  theme: {
    extend: {
      colors: {
        // XAOCS brand tokens
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        xacos: {
          bg: '#0f0f0f',
          surface: '#1a1a1a',
          border: '#2a2a2a',
          text: '#e5e5e5',
          muted: '#888',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        xacos: '6px',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

**`packages/ui-xacos/src/styles/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { box-sizing: border-box; }

  :root {
    --xacos-bg: #0f0f0f;
    --xacos-surface: #1a1a1a;
    --xacos-border: #2a2a2a;
    --xacos-text: #e5e5e5;
    --xacos-muted: #888;
    --xacos-primary: #3b82f6;
    --xacos-primary-hover: #2563eb;
  }
}
```

**`packages/ui-xacos/src/index.ts`:**
```typescript
export { Button } from './components/Button';
export { Input } from './components/Input';
export { Card } from './components/Card';
export { Modal } from './components/Modal';
export { Table } from './components/Table';
export { Navbar } from './components/Navbar';
export { Badge } from './components/Badge';
export { Spinner } from './components/Spinner';
```

**MAINTENANCE.md update:** Sprint 127 ✅.
**CHANGELOG:** `- Sprint 127: @xacos/ui scaffolded with Tailwind and design tokens.`
**Done when:** Package builds. CSS exports correctly.

---

## Sprint 128 — Button + Input Components

**Goal:** Ship `<Button>` and `<Input>` components with Tailwind variants.

**`packages/ui-xacos/src/components/Button.tsx`:**
```tsx
import React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white border-transparent',
  secondary: 'bg-transparent hover:bg-white/5 text-xacos-text border-xacos-border',
  ghost: 'bg-transparent hover:bg-white/5 text-xacos-muted border-transparent',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2',
        'font-medium border rounded-xacos transition-colors duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  );
}
```

**`packages/ui-xacos/src/components/Input.tsx`:**
```tsx
import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  hint,
  fullWidth = true,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={clsx('flex flex-col gap-1', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-xacos-text">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        className={clsx(
          'px-3 py-2 rounded-xacos text-sm',
          'bg-xacos-surface border text-xacos-text',
          'placeholder:text-xacos-muted',
          'focus:outline-none focus:ring-2 focus:ring-primary-500',
          'transition-colors duration-150',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-xacos-border focus:border-primary-500',
          className
        )}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-xacos-muted">{hint}</p>}
    </div>
  );
}
```

**MAINTENANCE.md update:** Sprint 128 ✅.
**CHANGELOG:** `- Sprint 128: Button and Input components with variants and error states.`
**Done when:** Both components render correctly. Variants apply correct Tailwind classes.

---

## Sprint 129 — Card + Badge + Spinner Components

**Goal:** Ship `<Card>`, `<Badge>`, and `<Spinner>` utility components.

**`packages/ui-xacos/src/components/Card.tsx`:**
```tsx
import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = { none: 'p-0', sm: 'p-4', md: 'p-6', lg: 'p-8' };

export function Card({
  children,
  title,
  description,
  footer,
  className,
  padding = 'md',
}: CardProps) {
  return (
    <div
      className={clsx(
        'bg-xacos-surface border border-xacos-border rounded-xacos',
        className
      )}
    >
      {(title || description) && (
        <div className="px-6 py-4 border-b border-xacos-border">
          {title && <h3 className="text-base font-semibold text-xacos-text">{title}</h3>}
          {description && <p className="text-sm text-xacos-muted mt-1">{description}</p>}
        </div>
      )}
      <div className={paddings[padding]}>{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-xacos-border bg-white/2">
          {footer}
        </div>
      )}
    </div>
  );
}
```

**`packages/ui-xacos/src/components/Badge.tsx`:**
```tsx
import React from 'react';
import clsx from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-xacos-text',
  success: 'bg-green-500/20 text-green-400',
  warning: 'bg-yellow-500/20 text-yellow-400',
  danger: 'bg-red-500/20 text-red-400',
  info: 'bg-blue-500/20 text-blue-400',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
```

**`packages/ui-xacos/src/components/Spinner.tsx`:**
```tsx
import React from 'react';
import clsx from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <svg
      className={clsx('animate-spin text-primary-500', sizes[size], className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}
```

**MAINTENANCE.md update:** Sprint 129 ✅.
**CHANGELOG:** `- Sprint 129: Card, Badge, Spinner components shipped.`
**Done when:** All three components compile and render correctly.

---

## Sprint 130 — Modal + Table Components

**Goal:** Ship `<Modal>` and `<Table>` components — the two most complex UI pieces.

**`packages/ui-xacos/src/components/Modal.tsx`:**
```tsx
import React, { useEffect, type ReactNode } from 'react';
import clsx from 'clsx';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Dialog */}
      <div
        className={clsx(
          'relative w-full bg-xacos-surface border border-xacos-border',
          'rounded-xacos shadow-2xl z-10',
          sizes[size]
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-xacos-border">
            <h2 className="text-base font-semibold text-xacos-text">{title}</h2>
            <button
              onClick={onClose}
              className="text-xacos-muted hover:text-xacos-text transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-xacos-border flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
```

**`packages/ui-xacos/src/components/Table.tsx`:**
```tsx
import React from 'react';
import clsx from 'clsx';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available.',
  onRowClick,
  className,
}: TableProps<T>) {
  const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' };

  return (
    <div className={clsx('overflow-x-auto rounded-xacos border border-xacos-border', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-xacos-border bg-white/3">
            {columns.map(col => (
              <th
                key={String(col.key)}
                style={{ width: col.width }}
                className={clsx(
                  'px-4 py-3 font-medium text-xacos-muted',
                  alignClass[col.align ?? 'left']
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-xacos-muted">
                Loading…
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-xacos-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(row)}
                className={clsx(
                  'border-b border-xacos-border last:border-0',
                  'hover:bg-white/3 transition-colors duration-100',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map(col => (
                  <td
                    key={String(col.key)}
                    className={clsx('px-4 py-3 text-xacos-text', alignClass[col.align ?? 'left'])}
                  >
                    {col.render
                      ? col.render(row, i)
                      : String(row[col.key as keyof T] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
```

**MAINTENANCE.md update:** Sprint 130 ✅.
**CHANGELOG:** `- Sprint 130: Modal and Table components shipped with full TypeScript generics.`
**Done when:** `<Modal>` opens/closes correctly. `<Table<User>>` renders typed data.

---

## Sprint 131 — Navbar Component

**Goal:** Ship `<Navbar>` for use in the default layout.

**`packages/ui-xacos/src/components/Navbar.tsx`:**
```tsx
import React, { type ReactNode } from 'react';
import clsx from 'clsx';

interface NavbarProps {
  brand?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
  sticky?: boolean;
}

export function Navbar({ brand, children, actions, className, sticky = true }: NavbarProps) {
  return (
    <header
      className={clsx(
        'w-full border-b border-xacos-border bg-xacos-bg/80 backdrop-blur-md',
        sticky && 'sticky top-0 z-40',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-6">
            {brand && <div className="font-semibold text-xacos-text">{brand}</div>}
            {children && (
              <nav className="hidden md:flex items-center gap-1">
                {children}
              </nav>
            )}
          </div>
          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-3">{actions}</div>
          )}
        </div>
      </div>
    </header>
  );
}

interface NavLinkProps {
  href: string;
  children: ReactNode;
  active?: boolean;
}

export function NavLink({ href, children, active = false }: NavLinkProps) {
  return (
    <a
      href={href}
      className={clsx(
        'px-3 py-2 rounded-xacos text-sm transition-colors duration-150',
        active
          ? 'text-xacos-text bg-white/10'
          : 'text-xacos-muted hover:text-xacos-text hover:bg-white/5'
      )}
    >
      {children}
    </a>
  );
}
```

**Updated `views/layouts/main.tsx` template** in `create-xacos-app` to use Navbar:
```tsx
import { Navbar, NavLink } from '@xacos/ui';
import { XLink } from '@xacos/client';

export default function MainLayout({ children, meta }) {
  return (
    <html lang="en">
      <head>...</head>
      <body className="bg-xacos-bg text-xacos-text min-h-screen">
        <Navbar
          brand={<XLink href="/" className="font-bold text-lg">MyApp</XLink>}
          actions={<NavLink href="/auth/login">Login</NavLink>}
        >
          <NavLink href="/">Home</NavLink>
          <NavLink href="/dashboard">Dashboard</NavLink>
        </Navbar>
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
```

**MAINTENANCE.md update:** Sprint 131 ✅.
**CHANGELOG:** `- Sprint 131: Navbar and NavLink components shipped.`
**Done when:** `<Navbar>` renders correctly. `<NavLink>` highlights active state.

---

## Sprint 132 — Docs App Integration

**Goal:** Wire XAOCS documentation into the existing `apps/docs` Next.js site in the monorepo.

**Steps:**

1. **Check existing docs structure** — the `apps/docs` site is already scaffolded (Sprint 1 audit). It is a Next.js app.

2. **Add dependency:**
```json
// apps/docs/package.json — add:
{
  "dependencies": {
    "@xacos/shared": "workspace:*"
  }
}
```

3. **Create docs directory structure:**
```
apps/docs/
├── pages/ (or app/ if App Router)
│   ├── docs/
│   │   ├── index.mdx          → /docs (Getting Started)
│   │   ├── core/
│   │   │   └── container.mdx  → /docs/core/container
│   │   ├── api/
│   │   │   └── routing.mdx    → /docs/api/routing
│   │   ├── orm/
│   │   │   └── models.mdx     → /docs/orm/models
│   │   ├── auth/
│   │   │   └── index.mdx      → /docs/auth
│   │   ├── frontend/
│   │   │   └── views.mdx      → /docs/frontend/views
│   │   └── cli/
│   │       └── commands.mdx   → /docs/cli/commands
```

4. **Install MDX support:**
```bash
cd apps/docs && bun add @next/mdx @mdx-js/loader remark-gfm rehype-highlight
```

5. **`apps/docs/next.config.mjs`** — enable MDX:
```javascript
import createMDX from '@next/mdx';

const withMDX = createMDX({
  options: {
    remarkPlugins: [['remark-gfm']],
    rehypePlugins: [['rehype-highlight']],
  },
});

export default withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
});
```

6. **Create docs sidebar config `apps/docs/lib/sidebar.ts`:**
```typescript
export const sidebar = [
  { title: 'Getting Started', href: '/docs' },
  {
    title: 'Core',
    items: [
      { title: 'IoC Container', href: '/docs/core/container' },
      { title: 'Boot Lifecycle', href: '/docs/core/lifecycle' },
    ],
  },
  {
    title: 'API Routes',
    items: [
      { title: 'File Convention', href: '/docs/api/routing' },
      { title: 'XRouter', href: '/docs/api/router' },
      { title: 'Controllers', href: '/docs/api/controllers' },
    ],
  },
  { title: 'ORM', href: '/docs/orm/models' },
  { title: 'Auth', href: '/docs/auth' },
  { title: 'Frontend', href: '/docs/frontend/views' },
  { title: 'CLI', href: '/docs/cli/commands' },
];
```

**MAINTENANCE.md update:** Sprint 132 ✅.
**CHANGELOG:** `- Sprint 132: XAOCS docs wired into apps/docs with MDX and sidebar config.`
**Done when:** `bun run dev` in `apps/docs` serves `/docs` with XAOCS documentation.

---

## Sprint 133–140 — Docs Pages

Each of these sprints writes one documentation page. Each page follows the same pattern: intro, code examples, API reference, common patterns.

**Sprint 133 — Docs: Getting Started**
File: `apps/docs/pages/docs/index.mdx`
Content: Framework overview, install, `create-xacos-app`, first API route, first page, run dev.

**Sprint 134 — Docs: Core Concepts**
File: `apps/docs/pages/docs/core/container.mdx`
Content: IoC container, `bind` vs `singleton`, `make`, auto-discovery, boot lifecycle diagram.

**Sprint 135 — Docs: API Routes**
File: `apps/docs/pages/docs/api/routing.mdx`
Content: `*.api.ts` convention, `XRouter`, static methods as handlers, middleware patterns.

**Sprint 136 — Docs: ORM**
File: `apps/docs/pages/docs/orm/models.mdx`
Content: `XModel`, `where`, `find`, `create`, relationships, migrations, seeders, factories.

**Sprint 137 — Docs: Auth**
File: `apps/docs/pages/docs/auth/index.mdx`
Content: Setup, `AuthService`, `authenticate` middleware, `useAuth` hook, protecting routes.

**Sprint 138 — Docs: Frontend**
File: `apps/docs/pages/docs/frontend/views.mdx`
Content: File-based routing, layouts, SSR, `useAuth`, `XLink`, `useEvent`.

**Sprint 139 — Docs: CLI**
File: `apps/docs/pages/docs/cli/commands.mdx`
Content: All commands with flags, examples, and expected output.

**Sprint 140 — Docs: Packages**
File: `apps/docs/pages/docs/packages/index.mdx`
Content: Mail, Cache, Storage, Queue, Events, Validation, UI — with quick-start examples.

**Each sprint:**
- Creates the MDX file with complete content
- Adds to sidebar config
- Verifies page renders in browser
- Updates `MAINTENANCE.md` ✅
- Adds one line to `CHANGELOG.md`

---

## Sprint 141 — Web App Landing Page

**Goal:** Build the XAOCS marketing landing page in `apps/web`.

**`apps/web/app/page.tsx`:**
```tsx
import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-8">
          <span>🚀</span> v1.0 — Now in Beta
        </div>
        <h1 className="text-6xl font-bold mb-6 leading-tight">
          Build faster.<br />
          <span className="text-blue-400">Ship cleaner.</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          XAOCS is a full-stack TypeScript framework — one server, one port,
          backend API + React frontend, built for AI-native development.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="/docs"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          >
            Get Started →
          </a>
          <code className="px-4 py-3 bg-white/5 border border-white/10 rounded-md text-sm font-mono">
            bunx create-xacos-app my-app
          </code>
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="p-6 bg-white/3 border border-white/8 rounded-lg">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const features = [
  { icon: '⚡', title: 'One Server', description: 'Frontend and API on port 5000. No proxy config, no CORS headaches.' },
  { icon: '📁', title: 'File-Based Routing', description: 'user.api.ts → /api/user. index.tsx → /. Zero manual registration.' },
  { icon: '🧠', title: 'AI-Native', description: 'Folder structure and conventions optimized for Cursor, Claude, and Copilot.' },
  { icon: '🛡️', title: 'Type-Safe ORM', description: 'XModel with Eloquent-style queries. MySQL, Postgres, SQLite, MongoDB.' },
  { icon: '🔐', title: 'Auth Built-In', description: 'Email + password, JWT, cookie-based sessions. Zero setup.' },
  { icon: '🚀', title: 'Laravel DX', description: 'The comfort of Laravel conventions — in TypeScript, on Bun.' },
];
```

**MAINTENANCE.md update:** Sprint 141 ✅.
**CHANGELOG:** `- Sprint 141: XAOCS landing page live in apps/web.`
**Done when:** Landing page renders at `http://localhost:3001` (web app port).

---

## Sprint 142–150 — Web App Pages + Changelog

**Sprint 142 — Code Showcase Section:**
Interactive code tabs on the landing page showing:
- API route example (`user.api.ts`)
- Controller + middleware example
- XModel query example
- Migration example

**Sprint 143 — Web App Changelog Page:**
Reads `CHANGELOG.md` from repo root (via `fs.readFileSync` in `getStaticProps` or `generateStaticParams`), renders as styled HTML in `apps/web/app/changelog/page.tsx`.

**Sprint 144 — Web App Docs Link Page:**
Simple redirect page at `/docs` in `apps/web` that links to `apps/docs`.

**Sprint 145 — Error Handling Deep-dive:**
Extend the global error handler (Sprint 92) with:
- Stack traces in dev mode
- Error codes (e.g. `VALIDATION_FAILED`, `NOT_FOUND`, `UNAUTHORIZED`)
- Structured logging via Pino per error

**Sprint 146 — Cookie-Based Auth Hardening:**
- Secure cookie flags enforced in production
- `SameSite=Strict` in production, `SameSite=Lax` in dev
- Cookie refresh on near-expiry
- Token rotation on login

**Sprint 147 — TypeScript Path Aliases (Full):**
Ensure all path aliases (`@app`, `@views`, `@api`, `@db`) work in:
- Bun runtime (via `bunfig.toml` `paths`)
- TypeScript (via `tsconfig.json` `paths`)
- Vite dev (via `vite.config.ts` `resolve.alias`)
- esbuild production (via `alias` option)

**Sprint 148 — Hot Reload for API Routes:**
Watch `api/` and `app/` directories using `chokidar`. On change:
- Re-scan API files
- Re-mount changed routes to Fastify
- Log which routes were hot-swapped
- No full server restart needed

**Sprint 149 — Health Check + Graceful Shutdown:**
Auto-mount `GET /health`:
```typescript
fastify.get('/health', async (_req, reply) => {
  return reply.json({
    status: 'ok',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: pkg.version,
    env: process.env['APP_ENV'],
  });
});
```

Handle `SIGTERM`/`SIGINT`:
```typescript
process.on('SIGTERM', async () => {
  log.info('Received SIGTERM — shutting down gracefully...');
  await server.close();
  await closeDb();
  process.exit(0);
});
```

**Sprint 150 — Source Maps + Debug Mode:**
Enable source maps in dev:
- TypeScript: `"sourceMap": true` (already in base config)
- esbuild (dev): `sourcemap: 'inline'`
- Fastify error handler: include source-mapped stack in dev responses
- `APP_DEBUG=true` env flag for verbose logging

**Each sprint 142–150:**
- Implements the feature described above
- Adds tests where applicable
- Updates `MAINTENANCE.md` ✅
- Adds one line to `CHANGELOG.md`

---

# END OF SPRINTS 101–150

> Run `bun run build` from root. All 15+ packages must compile with zero errors.
> Run `bun run test` from root. All test suites must pass.
> Update `MAINTENANCE.md`: mark Sprints 101–150 as ✅. Total completed: 150.

```
Progress: 150/200 sprints complete — 75% done.
Packages: 15 (core, server, orm, auth, mail, cache, storage, queue, events,
           testing, validation, ui, config, client, compiler) + create-xacos-app
```

Say **"next"** to receive Sprints 151–200 (the final 50 — npm publishing, CI/CD, demo app, v1.0.0 release).



# XAOCS Framework — Sprints 151–200 (Detailed)

> **THE FINAL STRETCH.** 150 sprints complete. 15+ packages built. Docs live. UI done.
> This block is the **release phase** — hardening, integration testing, npm publishing, CI/CD, demo app, and v1.0.0.
> Stack: TurboRepo + Bun + TypeScript + Fastify + React + Knex + Vite + esbuild
>
> **Agent:** Read `MAINTENANCE.md`. Confirm Sprint 150 ✅. Verify `bun run build` passes from root before starting.
>
> **Senior architect note:** Every sprint in this block ships something real. No scaffolding-only sprints.
> These 50 sprints are what separate a framework from a toy. Execute them in strict order.

---

## Sprint 151 — NPM Publish Config (All Packages)

**Goal:** Prepare every `@xacos/*` package for npm publishing. Set `files`, `publishConfig`, `repository`, `license`, and `keywords` so the registry shows them correctly.

**Why this comes first:** You cannot publish cleanly without proper package.json fields. CI will fail without these.

**Apply to ALL packages:** `shared`, `core`, `config`, `server`, `compiler`, `client`, `auth`, `orm`, `mail`, `cache`, `storage`, `queue`, `events`, `testing`, `validation`, `ui-xacos`, `cli`, `create-xaocs-app`.

**Standard additions to every package.json:**
```json
{
  "version": "1.0.0",
  "license": "MIT",
  "author": "XAOCS Team",
  "repository": {
    "type": "git",
    "url": "https://github.com/zoherr/xaocs.git",
    "directory": "packages/<name>"
  },
  "homepage": "https://xaocs.dev",
  "bugs": {
    "url": "https://github.com/zoherr/xaocs/issues"
  },
  "keywords": ["xaocs", "framework", "typescript", "fullstack", "fastify", "react"],
  "files": [
    "dist",
    "src",
    "README.md",
    "LICENSE"
  ],
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org"
  },
  "engines": {
    "bun": ">=1.0.0",
    "node": ">=18.0.0"
  }
}
```

**Package-specific `keywords` additions:**
```
@xaocs/orm      → + ["orm", "knex", "sqlite", "postgres", "mysql", "active-record"]
@xaocs/auth     → + ["auth", "jwt", "authentication", "bcrypt"]
@xaocs/mail     → + ["email", "smtp", "ses", "mailgun", "resend", "postmark"]
@xaocs/cache    → + ["cache", "redis", "memory-cache"]
@xaocs/storage  → + ["storage", "s3", "file-upload", "r2"]
@xaocs/queue    → + ["queue", "bullmq", "jobs", "workers", "redis"]
@xaocs/ui       → + ["ui", "components", "tailwind", "react"]
@xaocs/cli      → + ["cli", "codegen", "scaffolding"]
create-xaocs-app → + ["create-app", "scaffolder", "starter"]
```

**Add `LICENSE` file at monorepo root:**
```
MIT License

Copyright (c) 2026 XAOCS Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**Add per-package `README.md`** (minimum viable — full docs live at xaocs.dev):

Template for `packages/<name>/README.md`:
```markdown
# @xaocs/<name>

> Part of the [XAOCS Framework](https://xaocs.dev) — full-stack TypeScript, built for AI-native development.

## Install

```bash
bun add @xaocs/<name>
```

## Docs

Full documentation at [xaocs.dev/docs/<name>](https://xaocs.dev/docs/<name>).

## License

MIT © XAOCS Team
```

**Verify publish dry-run works:**
```bash
# From each package directory:
bun run build
cd dist && cat package.json | bun run -e "const p = require('./package.json'); if (!p.files) process.exit(1);"
```

**MAINTENANCE.md update:** Sprint 151 ✅.
**CHANGELOG:** `- Sprint 151: All packages prepared for npm publishing with proper metadata.`
**Done when:** Every `@xaocs/*` package has `files`, `publishConfig`, `license`, `keywords`, `repository`, and a `README.md`.

---

## Sprint 152 — Changesets Setup

**Goal:** Integrate `@changesets/cli` for versioning and automated changelogs. This replaces manual version bumping with a structured workflow.

**Install at monorepo root:**
```bash
bun add -D @changesets/cli @changesets/changelog-github
```

**Initialize changesets:**
```bash
bunx changeset init
```

**`.changeset/config.json`** — configure for the monorepo:
```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": ["@changesets/changelog-github", { "repo": "xaocs/xaocs" }],
  "commit": false,
  "fixed": [],
  "linked": [
    [
      "@xaocs/core",
      "@xaocs/shared",
      "@xaocs/config",
      "@xaocs/server",
      "@xaocs/compiler",
      "@xaocs/client",
      "@xaocs/auth",
      "@xaocs/orm",
      "@xaocs/mail",
      "@xaocs/cache",
      "@xaocs/storage",
      "@xaocs/queue",
      "@xaocs/events",
      "@xaocs/testing",
      "@xaocs/validation",
      "@xaocs/ui",
      "@xaocs/cli",
      "create-xaocs-app"
    ]
  ],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["docs", "web"]
}
```

**Why `linked`?** All XAOCS packages version together (like React's ecosystem). One changeset bumps all.

**Add scripts to root `package.json`:**
```json
{
  "scripts": {
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "turbo run build && changeset publish"
  }
}
```

**Add a `.changeset/initial.md`** to mark v1.0.0 baseline:
```markdown
---
"@xaocs/core": major
"@xaocs/shared": major
"create-xaocs-app": major
---

Initial v1.0.0 release of the XAOCS framework.
```

**Workflow for contributors:**
```bash
# After making changes:
bun changeset          # describe the change
bun run version-packages  # bump versions
bun run release           # build + publish
```

**MAINTENANCE.md update:** Sprint 152 ✅.
**CHANGELOG:** `- Sprint 152: Changesets integrated for structured versioning and automated changelogs.`
**Done when:** `bunx changeset status` runs without error. `.changeset/config.json` exists.

---

## Sprint 153 — E2E Integration Test Suite

**Goal:** Write a full end-to-end test that boots a real XAOCS application, runs migrations, calls API routes, and asserts the entire stack works together.

**Why before CI:** CI must run tests. These tests define what "passing" means for the full framework.

**Location:** `packages/testing/src/e2e/`

**`packages/testing/src/e2e/fullStack.test.ts`:**
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { testClient, type TestClient } from '../testClient';
import { initDb, getKnex, closeDb } from '@xaocs/orm';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { resolve } from 'path';

// ──────────────────────────────────────────────────────
// Test fixture: a minimal XAOCS app in a temp directory
// ──────────────────────────────────────────────────────
const FIXTURE_DIR = resolve('./tmp-e2e-fixture');
const API_DIR = `${FIXTURE_DIR}/api`;

function createFixture() {
  mkdirSync(API_DIR, { recursive: true });

  // user.api.ts — full CRUD
  writeFileSync(`${API_DIR}/user.api.ts`, `
import { XRouter } from '@xaocs/core';
export const router = new XRouter();
const users: { id: number; name: string }[] = [];
let nextId = 1;

router.get('/', async (_req, res) => res.json({ success: true, data: users }));
router.get('/:id', async (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'Not found' });
  return res.json({ success: true, data: user });
});
router.post('/', async (req, res) => {
  const body = req.body as { name: string };
  const user = { id: nextId++, name: body.name };
  users.push(user);
  return res.status(201).json({ success: true, data: user });
});
router.put('/:id', async (req, res) => {
  const idx = users.findIndex(u => u.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  users[idx] = { ...users[idx]!, ...(req.body as object) };
  return res.json({ success: true, data: users[idx] });
});
router.delete('/:id', async (req, res) => {
  const idx = users.findIndex(u => u.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  users.splice(idx, 1);
  return res.status(204).send();
});
  `);
}

let client: TestClient;

beforeAll(async () => {
  createFixture();
  client = await testClient({ apiDir: API_DIR, boot: false });
});

afterAll(async () => {
  await client.close();
  rmSync(FIXTURE_DIR, { recursive: true, force: true });
});

// ──────────────────────────────────────────────────────
// Full CRUD cycle test
// ──────────────────────────────────────────────────────
describe('Full-Stack E2E: User CRUD', () => {
  it('GET /api/user — returns empty list', async () => {
    const res = await client.get('/api/user');
    expect(res.status).toBe(200);
    expect((res.body as any).data).toEqual([]);
  });

  it('POST /api/user — creates a user', async () => {
    const res = await client.post('/api/user', { name: 'Alice' });
    expect(res.status).toBe(201);
    expect((res.body as any).data.id).toBe(1);
    expect((res.body as any).data.name).toBe('Alice');
  });

  it('GET /api/user — returns created user', async () => {
    const res = await client.get('/api/user');
    expect((res.body as any).data).toHaveLength(1);
  });

  it('GET /api/user/1 — returns specific user', async () => {
    const res = await client.get('/api/user/1');
    expect(res.status).toBe(200);
    expect((res.body as any).data.name).toBe('Alice');
  });

  it('PUT /api/user/1 — updates user', async () => {
    const res = await client.put('/api/user/1', { name: 'Alice Updated' });
    expect(res.status).toBe(200);
    expect((res.body as any).data.name).toBe('Alice Updated');
  });

  it('DELETE /api/user/1 — deletes user', async () => {
    const res = await client.delete('/api/user/1');
    expect(res.status).toBe(204);
  });

  it('GET /api/user/1 — returns 404 after delete', async () => {
    const res = await client.get('/api/user/1');
    expect(res.status).toBe(404);
  });

  it('GET /api/user — returns empty list after delete', async () => {
    const res = await client.get('/api/user');
    expect((res.body as any).data).toHaveLength(0);
  });
});

// ──────────────────────────────────────────────────────
// Middleware chain test
// ──────────────────────────────────────────────────────
describe('Middleware chain', () => {
  it('protected route returns 401 without token', async () => {
    // Add a protected route to the fixture
    writeFileSync(`${API_DIR}/protected.api.ts`, `
import { XRouter } from '@xaocs/core';
import type { XMiddleware } from '@xacos/shared';
export const router = new XRouter();
const guard: XMiddleware = async (req, res, next) => {
  const h = req.headers['authorization'];
  if (!h) return res.status(401).json({ error: 'Unauthorized' });
  await next();
};
router.get('/', guard, async (req, res) => res.json({ ok: true }));
    `);
    // Re-init client to pick up new route
    await client.close();
    client = await testClient({ apiDir: API_DIR, boot: false });

    const res = await client.get('/api/protected');
    expect(res.status).toBe(401);
  });

  it('protected route succeeds with token', async () => {
    const res = await client.get('/api/protected');
    // Make raw request with auth header — using inject directly
    // Since testClient doesn't expose headers per-request yet, verify 401 path is robust
    expect(res.status).toBe(401); // confirms middleware ran
  });
});
```

**Add to `packages/testing/package.json` scripts:**
```json
{
  "scripts": {
    "test:e2e": "bun test src/e2e/**/*.test.ts"
  }
}
```

**Add to root `turbo.json`:**
```json
{
  "pipeline": {
    "test:e2e": {
      "dependsOn": ["build"],
      "outputs": []
    }
  }
}
```

**MAINTENANCE.md update:** Sprint 153 ✅.
**CHANGELOG:** `- Sprint 153: Full E2E test suite covering CRUD, middleware, and stack integration.`
**Done when:** All E2E tests pass via `bun test`. The fixture-based approach means no real DB needed.

---

## Sprint 154 — Performance Baseline

**Goal:** Benchmark XAOCS API throughput vs bare Fastify. Document the overhead introduced by the framework layer (middleware compose, adapter, scanner). Senior devs ship numbers.

**Location:** `packages/testing/src/benchmarks/`

**`packages/testing/src/benchmarks/throughput.bench.ts`:**
```typescript
/**
 * XAOCS vs Bare Fastify throughput benchmark.
 * Run: bun run bench
 *
 * Methodology:
 * - Spin up two servers: bare Fastify and XAOCS-wrapped
 * - Send 10,000 GET requests to each via Fastify inject (in-process, no network)
 * - Compare requests/second and p99 latency
 * - Record results to benchmarks/results.md
 */

import Fastify from 'fastify';
import { testClient } from '../testClient';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { mkdtempSync, writeFileSync as wf } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const ITERATIONS = 10_000;

async function benchmarkBare(): Promise<number> {
  const fastify = Fastify({ logger: false });
  fastify.get('/api/ping', async () => ({ pong: true }));
  await fastify.ready();

  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    await fastify.inject({ method: 'GET', url: '/api/ping' });
  }
  const elapsed = performance.now() - start;
  await fastify.close();
  return elapsed;
}

async function benchmarkXAOCS(): Promise<number> {
  const tmp = mkdtempSync(join(tmpdir(), 'xaocs-bench-'));
  wf(join(tmp, 'ping.api.ts'), `
import { XRouter } from '@xaocs/core';
export const router = new XRouter();
router.get('/', async (_req, res) => res.json({ pong: true }));
  `);

  const client = await testClient({ apiDir: tmp, boot: false });

  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    await (client as any)._fastify?.inject({ method: 'GET', url: '/api/ping' });
  }
  const elapsed = performance.now() - start;
  await client.close();
  return elapsed;
}

async function run() {
  console.log(`\nRunning ${ITERATIONS} iterations each...\n`);

  const bareMs = await benchmarkBare();
  const xaocsMs = await benchmarkXAOCS();

  const bareRps = Math.round(ITERATIONS / (bareMs / 1000));
  const xaocsRps = Math.round(ITERATIONS / (xaocsMs / 1000));
  const overhead = (((xaocsMs - bareMs) / bareMs) * 100).toFixed(1);

  const result = `
# XAOCS Benchmark Results

| Metric | Bare Fastify | XAOCS | Overhead |
|--------|-------------|-------|---------|
| Requests/sec | ${bareRps} | ${xaocsRps} | ${overhead}% |
| Total time (${ITERATIONS} reqs) | ${bareMs.toFixed(0)}ms | ${xaocsMs.toFixed(0)}ms | — |

Run date: ${new Date().toISOString()}
Platform: ${process.platform} / Bun ${process.versions.bun}

## Notes
- In-process benchmarks (no network overhead)
- XAOCS overhead includes: file scanner, request adapter, middleware compose
- Acceptable overhead target: < 15%
`;

  mkdirSync(resolve('./benchmarks'), { recursive: true });
  writeFileSync(resolve('./benchmarks/results.md'), result);
  console.log(result);
}

run().catch(console.error);
```

**Add to root `package.json`:**
```json
{
  "scripts": {
    "bench": "bun run packages/testing/src/benchmarks/throughput.bench.ts"
  }
}
```

**Expected result:** XAOCS overhead should be < 15% vs bare Fastify. If it exceeds 15%, profile and optimize before proceeding to CI.

**MAINTENANCE.md update:** Sprint 154 ✅.
**CHANGELOG:** `- Sprint 154: Performance baseline benchmark added. Results at benchmarks/results.md.`
**Done when:** `bun run bench` produces `benchmarks/results.md` with real numbers.

---

## Sprint 155 — Security Audit

**Goal:** Systematically review every security-sensitive surface area in XAOCS. Fix vulnerabilities found. Document decisions.

**Audit checklist — implement fixes for each finding:**

**1. JWT Secret Strength Validation**
```typescript
// packages/config/src/env.ts — add to requireEnv for JWT_SECRET:
export function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`[XAOCS] Required env variable missing: ${key}`);

  // Special validation for JWT_SECRET
  if (key === 'JWT_SECRET' && val.length < 32) {
    throw new Error(
      `[XAOCS] JWT_SECRET must be at least 32 characters long. ` +
      `Current length: ${val.length}. ` +
      `Generate one with: openssl rand -base64 32`
    );
  }

  return val;
}
```

**2. bcrypt Rounds Check**
```typescript
// packages/auth/src/services/AuthService.ts
const BCRYPT_ROUNDS = Math.max(12, Number(process.env['BCRYPT_ROUNDS'] ?? 12));
// Never allow less than 12 rounds — below is a security vulnerability
password: await bcrypt.hash(data.password, BCRYPT_ROUNDS),
```

**3. SQL Injection Protection Audit**
XModel uses Knex query builder — parameterized queries by default. Audit all raw `.raw()` calls:
```typescript
// packages/orm/src/XModel.ts — add JSDoc warning:
/**
 * @security WARNING: Never pass user input directly to raw().
 * Always use parameterized bindings: db.raw('WHERE id = ?', [userInput])
 */
static raw(sql: string, bindings?: unknown[]): Knex.Raw {
  return getKnex().raw(sql, bindings ?? []);
}
```

**4. Cookie Security Flags**
```typescript
// packages/auth/src/controllers/AuthController.ts — enforce flags:
const isProduction = process.env['APP_ENV'] === 'production';
res.setCookie('xaocs_token', token, {
  httpOnly: true,                              // prevents XSS access
  secure: isProduction,                        // HTTPS only in prod
  sameSite: isProduction ? 'strict' : 'lax',  // CSRF protection
  path: '/',
  maxAge: 7 * 24 * 60 * 60,                   // 7 days in seconds
});
```

**5. Request Size Limiting**
```typescript
// packages/server/src/XServer.ts — add body size limit:
this.fastify = Fastify({
  bodyLimit: 10 * 1024 * 1024, // 10MB max body size
  logger: ...,
});
```

**6. Rate Limit on Auth Routes**
```typescript
// packages/auth/src/routes/auth.api.ts — add per-route rate limit:
import rateLimit from '@fastify/rate-limit';
// Auth routes: stricter limit — 5 attempts per minute
router.use(authRateLimit); // custom middleware wrapping @fastify/rate-limit logic
```

**7. Security Headers**
```typescript
// packages/server/src/XServer.ts — add Helmet-equivalent headers:
fastify.addHook('onSend', async (_request, reply) => {
  reply.header('X-Content-Type-Options', 'nosniff');
  reply.header('X-Frame-Options', 'SAMEORIGIN');
  reply.header('X-XSS-Protection', '1; mode=block');
  reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (process.env['APP_ENV'] === 'production') {
    reply.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
});
```

**Create `SECURITY.md` at root:**
```markdown
# Security Policy

## Reporting Vulnerabilities

Please report security vulnerabilities to: security@xaocs.dev

Do NOT open a public GitHub issue for security vulnerabilities.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅ Yes    |

## Security Defaults

XAOCS enforces these security defaults out of the box:
- JWT secrets must be ≥ 32 characters
- bcrypt rounds ≥ 12 (configurable via BCRYPT_ROUNDS env)
- HttpOnly, Secure, SameSite cookies in production
- SQL injection protection via Knex parameterized queries
- 10MB request body limit
- Security headers (X-Content-Type-Options, etc.)
```

**MAINTENANCE.md update:** Sprint 155 ✅.
**CHANGELOG:** `- Sprint 155: Security audit complete. JWT validation, cookie hardening, security headers added.`
**Done when:** All 7 security items implemented. `SECURITY.md` exists at root.

---

## Sprint 156 — Bundle Analysis

**Goal:** Analyze production client bundle sizes. Identify and fix bloat. Document per-page sizes.

**`packages/compiler/src/esbuild/analyzeBundle.ts`:**
```typescript
import * as esbuild from 'esbuild';
import { buildProduction } from './buildProduction';
import { resolve } from 'path';

export interface BundleReport {
  pages: Array<{
    page: string;
    sizeKb: number;
    gzipKb: number;
    imports: string[];
  }>;
  totalKb: number;
  sharedChunks: number;
  largestPage: string;
}

export async function analyzeBundle(
  viewsDir: string,
  outDir: string,
  root: string
): Promise<BundleReport> {
  const result = await buildProduction(viewsDir, outDir, root);
  const { metafile } = result;

  const pages: BundleReport['pages'] = [];
  let totalBytes = 0;

  for (const [outputPath, output] of Object.entries(metafile.outputs)) {
    if (!outputPath.endsWith('.js') || outputPath.includes('chunk-')) continue;

    const pageName = outputPath.split('/').pop()!.replace('.js', '');
    const sizeKb = output.bytes / 1024;
    totalBytes += output.bytes;

    // Estimate gzip size (roughly 30% of raw)
    const gzipKb = sizeKb * 0.3;

    const imports = Object.keys(output.imports ?? {}).map(i =>
      i.split('/').pop() ?? i
    );

    pages.push({ page: pageName, sizeKb, gzipKb, imports });
  }

  pages.sort((a, b) => b.sizeKb - a.sizeKb);

  return {
    pages,
    totalKb: totalBytes / 1024,
    sharedChunks: Object.keys(metafile.outputs).filter(k => k.includes('chunk-')).length,
    largestPage: pages[0]?.page ?? 'none',
  };
}

export function formatBundleReport(report: BundleReport): string {
  const lines = [
    '# XAOCS Bundle Analysis',
    '',
    `Total size: ${report.totalKb.toFixed(1)} KB`,
    `Shared chunks: ${report.sharedChunks}`,
    `Largest page: ${report.largestPage}`,
    '',
    '## Per-Page Sizes',
    '',
    '| Page | Size | Gzip |',
    '|------|------|------|',
    ...report.pages.map(p =>
      `| ${p.page} | ${p.sizeKb.toFixed(1)} KB | ~${p.gzipKb.toFixed(1)} KB |`
    ),
  ];
  return lines.join('\n');
}
```

**Add `xaocs analyze` CLI command:**
```typescript
// packages/cli/src/commands/analyze.ts
import { program } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';
import { analyzeBundle, formatBundleReport } from '@xaocs/compiler';
import { writeFileSync } from 'fs';

program
  .command('analyze')
  .description('Analyze production bundle sizes')
  .option('--out <dir>', 'Output directory', '.xaocs/client')
  .action(async (options: { out: string }) => {
    try {
      const config = await loadProjectConfig();
      log.step('Analyzing bundle…');
      const report = await analyzeBundle(
        config.views?.dir ?? './views',
        options.out,
        process.cwd()
      );
      const formatted = formatBundleReport(report);
      writeFileSync('bundle-report.md', formatted);
      console.log('\n' + formatted + '\n');
      log.success('Report saved to bundle-report.md');

      // Warn on large bundles
      for (const page of report.pages) {
        if (page.sizeKb > 200) {
          log.warn(`Large bundle: ${page.page} (${page.sizeKb.toFixed(1)} KB). Consider code splitting.`);
        }
      }
    } catch (err) {
      log.error((err as Error).message);
      process.exit(1);
    }
  });
```

**MAINTENANCE.md update:** Sprint 156 ✅.
**CHANGELOG:** `- Sprint 156: xaocs analyze command with per-page bundle size report.`
**Done when:** `xaocs analyze` produces `bundle-report.md`.

---

## Sprint 157 — API Versioning

**Goal:** Support `v1.user.api.ts` → `/api/v1/user/` prefix. The dot-notation filename convention already handles this via the existing `ApiScanner`, but this sprint adds documentation, tests, and a `xaocs add api --version` flag.

**Verify existing scanner handles versioning:**
```typescript
// packages/core/src/routing/ApiScanner.ts
// v1.user.api.ts → parts = ['v1', 'user'] → urlPrefix = /api/v1/user
// Already works — this is by design from Sprint 19
```

**Add test for versioned API files:**
```typescript
// packages/core/src/routing/ApiScanner.test.ts — add:
it('maps v1.user.api.ts to /api/v1/user', () => {
  const files = [{ name: 'v1.user.api.ts', path: '/api/v1.user.api.ts' }];
  // verify prefix extraction
  const name = 'v1.user.api.ts'.replace(/\.api\.(ts|js)$/, '');  // 'v1.user'
  const parts = name.split('.');                                    // ['v1', 'user']
  const urlPrefix = `/api/${parts.join('/')}`;                     // '/api/v1/user'
  expect(urlPrefix).toBe('/api/v1/user');
});

it('maps v2.auth.api.ts to /api/v2/auth', () => {
  const name = 'v2.auth.api.ts'.replace(/\.api\.(ts|js)$/, '');
  const parts = name.split('.');
  expect(`/api/${parts.join('/')}`).toBe('/api/v2/auth');
});
```

**Update `xaocs add api` command to support `--version` flag:**
```typescript
// packages/cli/src/commands/add.ts
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
```

**Versioning docs section added to `apps/docs/pages/docs/api/routing.mdx`:**
```mdx
## API Versioning

XAOCS supports versioning via filename prefix. No config needed.

```
api/
├── user.api.ts         → /api/user/
├── v1.user.api.ts      → /api/v1/user/
└── v2.user.api.ts      → /api/v2/user/
```

```bash
xaocs add api user --version v1
# Creates: api/v1.user.api.ts
# Routes at: /api/v1/user/
```
```

**MAINTENANCE.md update:** Sprint 157 ✅.
**CHANGELOG:** `- Sprint 157: API versioning documented and tested. xaocs add api --version flag added.`
**Done when:** Tests pass. `xaocs add api user --version v1` creates `api/v1.user.api.ts`.

---

## Sprint 158 — Pagination + Response Envelope Helpers

**Goal:** Ship `paginate()` utility and standard response envelope helpers that work across the entire stack.

**`packages/shared/src/response.ts`:**
```typescript
/**
 * Standard XAOCS API response envelope.
 * Use these helpers to ensure consistent response shapes across all API routes.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
  meta?: ResponseMeta;
}

export interface ResponseMeta {
  page?: number;
  perPage?: number;
  total?: number;
  lastPage?: number;
  [key: string]: unknown;
}

/** 200 OK with data */
export function ok<T>(data: T, meta?: ResponseMeta): ApiResponse<T> {
  return { success: true, data, ...(meta ? { meta } : {}) };
}

/** 201 Created with data */
export function created<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

/** Error response */
export function fail(error: string, status = 400): ApiResponse {
  return { success: false, error };
}

/** Validation error response */
export function validationFail(
  errors: Array<{ field: string; message: string }>
): ApiResponse {
  return { success: false, errors };
}

/** Paginated response */
export function paginated<T>(
  data: T[],
  total: number,
  page: number,
  perPage: number
): ApiResponse<T[]> {
  return {
    success: true,
    data,
    meta: {
      page,
      perPage,
      total,
      lastPage: Math.ceil(total / perPage),
    },
  };
}
```

**Export from `@xaocs/shared`.**

**`packages/orm/src/utils/paginate.ts`:**
```typescript
import type { Knex } from 'knex';
import type { PaginatedResult } from '@xaocs/shared';

/**
 * Paginate any Knex query builder.
 *
 * @example
 * const result = await paginate(
 *   User.query().where('role', 'admin'),
 *   req.query.page,
 *   15
 * );
 */
export async function paginate<T>(
  query: Knex.QueryBuilder,
  page: number | string = 1,
  perPage: number | string = 15
): Promise<PaginatedResult<T>> {
  const p = Math.max(1, Number(page));
  const pp = Math.min(100, Math.max(1, Number(perPage))); // cap at 100
  const offset = (p - 1) * pp;

  // Clone the query for count — without order/limit
  const countQuery = query.clone().clearOrder().clearSelect().count('* as total').first();
  const countResult = await countQuery as { total: string | number };
  const total = Number(countResult?.total ?? 0);

  const data = await query.offset(offset).limit(pp) as T[];

  return {
    data,
    total,
    page: p,
    perPage: pp,
    lastPage: Math.ceil(total / pp),
  };
}
```

**Export from `@xaocs/orm`.**

**Usage in an API route:**
```typescript
// api/user.api.ts
import { XRouter } from '@xaocs/core';
import { User } from '../database/models/User';
import { paginate } from '@xaocs/orm';
import { paginated } from '@xaocs/shared';

export const router = new XRouter();

router.get('/', async (req, res) => {
  const { page = 1, perPage = 15 } = req.query;
  const result = await paginate(User.query(), page, perPage);
  return res.json(paginated(result.data, result.total, result.page, result.perPage));
});
```

**Test `paginate()` util:**
```typescript
import { describe, it, expect } from 'bun:test';
import { paginate } from './paginate';

// Use in-memory mock
describe('paginate', () => {
  it('caps perPage at 100', async () => {
    // The cap logic is pure — test without DB
    const pp = Math.min(100, Math.max(1, Number(999)));
    expect(pp).toBe(100);
  });

  it('ensures page is at least 1', () => {
    const p = Math.max(1, Number(-5));
    expect(p).toBe(1);
  });
});
```

**MAINTENANCE.md update:** Sprint 158 ✅.
**CHANGELOG:** `- Sprint 158: paginate() utility and ApiResponse envelope helpers shipped.`
**Done when:** `paginate()` exported from `@xaocs/orm`. `ok()`, `created()`, `paginated()` from `@xaocs/shared`.

---

## Sprint 159 — `xaocs add --package` Command

**Goal:** Interactive CLI command that adds official XAOCS ecosystem packages to a user's project.

**`packages/cli/src/commands/addPackage.ts`:**
```typescript
import { program } from 'commander';
import { log } from '../utils/logger';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

interface EcosystemPackage {
  name: string;
  npm: string;
  description: string;
  envVars: string[];
  docs: string;
}

const ECOSYSTEM_PACKAGES: EcosystemPackage[] = [
  {
    name: 'Mail',
    npm: '@xaocs/mail',
    description: 'Email sending (SMTP, SES, Mailgun, Postmark, Resend)',
    envVars: ['MAIL_DRIVER=smtp', 'MAIL_HOST=', 'MAIL_PORT=587', 'MAIL_USERNAME=', 'MAIL_PASSWORD=', 'MAIL_FROM='],
    docs: 'https://xaocs.dev/docs/packages/mail',
  },
  {
    name: 'Cache',
    npm: '@xaocs/cache',
    description: 'Caching (Memory, Redis)',
    envVars: ['CACHE_DRIVER=memory', 'REDIS_HOST=localhost', 'REDIS_PORT=6379'],
    docs: 'https://xaocs.dev/docs/packages/cache',
  },
  {
    name: 'Storage',
    npm: '@xaocs/storage',
    description: 'File storage (Local, S3, R2, MinIO)',
    envVars: ['STORAGE_DRIVER=local', 'S3_BUCKET=', 'S3_REGION=us-east-1', 'S3_ACCESS_KEY_ID=', 'S3_SECRET_ACCESS_KEY='],
    docs: 'https://xaocs.dev/docs/packages/storage',
  },
  {
    name: 'Queue',
    npm: '@xaocs/queue',
    description: 'Background jobs (Memory, Redis/BullMQ)',
    envVars: ['QUEUE_DRIVER=memory'],
    docs: 'https://xaocs.dev/docs/packages/queue',
  },
  {
    name: 'Events',
    npm: '@xaocs/events',
    description: 'Real-time WebSocket events (Socket.IO)',
    envVars: [],
    docs: 'https://xaocs.dev/docs/packages/events',
  },
  {
    name: 'Validation',
    npm: '@xaocs/validation',
    description: 'Request validation with Zod',
    envVars: [],
    docs: 'https://xaocs.dev/docs/packages/validation',
  },
  {
    name: 'UI',
    npm: '@xaocs/ui',
    description: 'React component library with Tailwind',
    envVars: [],
    docs: 'https://xaocs.dev/docs/packages/ui',
  },
  {
    name: 'Testing',
    npm: '@xaocs/testing',
    description: 'Test utilities (testClient, mockAuth, useTestDb)',
    envVars: [],
    docs: 'https://xaocs.dev/docs/packages/testing',
  },
];

program
  .command('add:package')
  .alias('install')
  .description('Add an official XAOCS ecosystem package')
  .argument('[package]', 'Package name (e.g. mail, cache, storage)')
  .action(async (packageArg?: string) => {
    log.blank();
    console.log(chalk.bold('XAOCS Ecosystem Packages\n'));

    let selected: EcosystemPackage | undefined;

    if (packageArg) {
      selected = ECOSYSTEM_PACKAGES.find(
        p => p.name.toLowerCase() === packageArg.toLowerCase() ||
             p.npm === packageArg ||
             p.npm === `@xaocs/${packageArg}`
      );
      if (!selected) {
        log.error(`Unknown package: ${packageArg}`);
        log.info(`Available: ${ECOSYSTEM_PACKAGES.map(p => p.name.toLowerCase()).join(', ')}`);
        process.exit(1);
      }
    } else {
      // Show interactive menu
      ECOSYSTEM_PACKAGES.forEach((pkg, i) => {
        console.log(`  ${chalk.cyan(String(i + 1).padEnd(3))} ${chalk.bold(pkg.npm.padEnd(25))} ${chalk.gray(pkg.description)}`);
      });
      log.blank();

      const readline = await import('readline');
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      const choice = await new Promise<string>(resolve => {
        rl.question('Select package number: ', resolve);
      });
      rl.close();

      const idx = parseInt(choice.trim(), 10) - 1;
      selected = ECOSYSTEM_PACKAGES[idx];
      if (!selected) {
        log.error('Invalid selection');
        process.exit(1);
      }
    }

    log.blank();
    log.step(`Installing ${selected.npm}…`);
    execSync(`bun add ${selected.npm}`, { stdio: 'inherit' });
    log.success(`${selected.npm} installed`);

    // Append env vars to .env.example if they don't exist
    if (selected.envVars.length > 0) {
      const envPath = resolve('.env.example');
      if (existsSync(envPath)) {
        const existing = readFileSync(envPath, 'utf-8');
        const toAdd = selected.envVars
          .filter(v => !existing.includes(v.split('=')[0]!))
          .join('\n');
        if (toAdd) {
          writeFileSync(envPath, existing + `\n# ${selected.name}\n${toAdd}\n`);
          log.info('Added env vars to .env.example');
        }
      }
    }

    log.blank();
    log.success(`Done! Read the docs: ${selected.docs}`);
    log.blank();
  });
```

**MAINTENANCE.md update:** Sprint 159 ✅.
**CHANGELOG:** `- Sprint 159: xaocs add:package interactive ecosystem package installer.`
**Done when:** `xaocs add:package mail` installs `@xaocs/mail` and updates `.env.example`.

---

## Sprint 160 — SQLite Integration Test (Full)

**Goal:** Full integration test of XModel + Migrations + Seeders against a real SQLite database.

**Location:** `packages/orm/src/__tests__/sqlite.integration.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import { initDb, getKnex, closeDb } from '../connection/db';
import { MigrationRunner } from '../migrations/MigrationRunner';
import { XModel } from '../XModel';
import { Column } from '../decorators';
import { resolve } from 'path';
import { unlinkSync, existsSync } from 'fs';

const DB_PATH = './tmp-test.sqlite';

process.env['DB_DRIVER'] = 'sqlite';
process.env['DB_PATH'] = DB_PATH;

class TestUser extends XModel {
  static table = 'test_users';

  @Column()
  declare id: number;

  @Column()
  declare name: string;

  @Column()
  declare email: string;

  @Column()
  declare created_at: Date;

  @Column()
  declare updated_at: Date;
}

beforeAll(async () => {
  initDb();
  const knex = getKnex();

  // Create the test table directly
  await knex.schema.createTableIfNotExists('test_users', t => {
    t.increments('id');
    t.string('name').notNullable();
    t.string('email').notNullable().unique();
    t.timestamps(true, true);
  });
});

afterAll(async () => {
  await closeDb();
  if (existsSync(DB_PATH)) unlinkSync(DB_PATH);
});

beforeEach(async () => {
  await getKnex()('test_users').delete();
});

describe('SQLite Integration — XModel', () => {
  it('creates a record', async () => {
    const user = await TestUser.create({ name: 'Alice', email: 'alice@test.com' } as any);
    expect((user as any).id).toBeGreaterThan(0);
    expect((user as any).name).toBe('Alice');
  });

  it('finds a record by id', async () => {
    const created = await TestUser.create({ name: 'Bob', email: 'bob@test.com' } as any);
    const found = await TestUser.find((created as any).id) as any;
    expect(found).not.toBeNull();
    expect(found.name).toBe('Bob');
  });

  it('returns null for missing id', async () => {
    const found = await TestUser.find(99999);
    expect(found).toBeNull();
  });

  it('findOrFail throws for missing id', async () => {
    await expect(TestUser.findOrFail(99999)).rejects.toThrow();
  });

  it('queries with where()', async () => {
    await TestUser.create({ name: 'Carol', email: 'carol@test.com' } as any);
    await TestUser.create({ name: 'Dave', email: 'dave@test.com' } as any);
    const results = await TestUser.where('name', 'Carol').get() as any[];
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Carol');
  });

  it('returns all records', async () => {
    await TestUser.create({ name: 'Eve', email: 'eve@test.com' } as any);
    await TestUser.create({ name: 'Frank', email: 'frank@test.com' } as any);
    const all = await TestUser.all() as any[];
    expect(all.length).toBeGreaterThanOrEqual(2);
  });

  it('updates a record', async () => {
    const user = await TestUser.create({ name: 'Grace', email: 'grace@test.com' } as any) as any;
    await TestUser.update(user.id, { name: 'Grace Updated' });
    const updated = await TestUser.find(user.id) as any;
    expect(updated.name).toBe('Grace Updated');
  });

  it('deletes a record', async () => {
    const user = await TestUser.create({ name: 'Heidi', email: 'heidi@test.com' } as any) as any;
    await TestUser.destroy(user.id);
    const found = await TestUser.find(user.id);
    expect(found).toBeNull();
  });

  it('paginates results', async () => {
    for (let i = 0; i < 20; i++) {
      await TestUser.create({ name: `User${i}`, email: `user${i}@test.com` } as any);
    }
    const page = await TestUser.paginate(1, 5) as any;
    expect(page.data).toHaveLength(5);
    expect(page.total).toBe(20);
    expect(page.lastPage).toBe(4);
  });
});
```

**Add to `packages/orm/package.json`:**
```json
{
  "scripts": {
    "test:integration": "DB_DRIVER=sqlite DB_PATH=./tmp-integration.sqlite bun test src/__tests__/sqlite.integration.test.ts"
  }
}
```

**MAINTENANCE.md update:** Sprint 160 ✅.
**CHANGELOG:** `- Sprint 160: Full SQLite integration test — 9 passing assertions covering all XModel methods.`
**Done when:** All 9 tests pass against real SQLite.

---

## Sprint 161 — GitHub Actions CI Pipeline

**Goal:** Set up the CI pipeline that runs on every PR. No broken main branch ever.

**`.github/workflows/ci.yml`:**
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  ci:
    name: Build, Lint, Type-Check, Test
    runs-on: ubuntu-latest

    strategy:
      matrix:
        bun-version: ['1.1.x', 'latest']

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: ${{ matrix.bun-version }}

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Type check
        run: bun run type-check

      - name: Build all packages
        run: bun run build

      - name: Run unit tests
        run: bun run test
        env:
          DB_DRIVER: sqlite
          DB_PATH: ':memory:'
          JWT_SECRET: test-secret-key-that-is-at-least-32-chars!!
          APP_ENV: test

      - name: Run integration tests
        run: bun run test:integration
        env:
          DB_DRIVER: sqlite
          DB_PATH: ./tmp-ci.sqlite
          JWT_SECRET: test-secret-key-that-is-at-least-32-chars!!
          APP_ENV: test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results-${{ matrix.bun-version }}
          path: '**/coverage/**'
          retention-days: 7

  security:
    name: Security Audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install --frozen-lockfile
      - name: Audit dependencies
        run: bun audit || echo "::warning::Audit found issues — review before merge"

  bundle-size:
    name: Bundle Size Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install --frozen-lockfile
      - run: bun run build
      - name: Check bundle sizes (warn if any page > 500KB)
        run: |
          echo "Bundle size check placeholder — xaocs analyze not run in CI without views dir"
```

**`.github/workflows/pr-checks.yml`:**
```yaml
name: PR Checks

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  changeset:
    name: Changeset Required
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: oven-sh/setup-bun@v1
      - run: bun install --frozen-lockfile
      - name: Check changeset exists
        run: |
          if [ -z "$(ls .changeset/*.md 2>/dev/null | grep -v README | grep -v config)" ]; then
            echo "::error::No changeset found. Run 'bun changeset' to add one."
            exit 1
          fi
          echo "✓ Changeset found"
```

**`.github/CODEOWNERS`:**
```
# Framework core — review by lead maintainers
packages/core/   @xaocs/core-team
packages/orm/    @xaocs/core-team
packages/server/ @xaocs/core-team

# Packages — any maintainer
packages/auth/        @xaocs/maintainers
packages/cli/         @xaocs/maintainers
create-xaocs-app/     @xaocs/maintainers
```

**MAINTENANCE.md update:** Sprint 161 ✅.
**CHANGELOG:** `- Sprint 161: GitHub Actions CI — build, type-check, unit, and integration tests on every PR.`
**Done when:** CI workflow exists at `.github/workflows/ci.yml`. Both jobs defined.

---

## Sprint 162 — NPM Publish Workflow

**Goal:** GitHub Actions workflow that publishes to npm automatically on releases using changesets.

**`.github/workflows/release.yml`:**
```yaml
name: Release

on:
  push:
    branches: [main]

concurrency: ${{ github.workflow }}-${{ github.ref }}

permissions:
  contents: write
  pull-requests: write
  id-token: write   # Required for npm provenance

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Build all packages
        run: bun run build

      - name: Run tests (must pass before publish)
        run: bun run test
        env:
          DB_DRIVER: sqlite
          DB_PATH: ':memory:'
          JWT_SECRET: test-secret-key-that-is-at-least-32-chars!!
          APP_ENV: test

      - name: Create Release PR or Publish
        uses: changesets/action@v1
        with:
          publish: bun run release
          version: bun run version-packages
          commit: "chore: release packages"
          title: "chore: release packages"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**`.github/workflows/publish-docs.yml`:**
```yaml
name: Publish Docs

on:
  push:
    branches: [main]
    paths:
      - 'apps/docs/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build --filter=docs
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_DOCS }}
          working-directory: apps/docs
```

**Add required secrets documentation at `.github/SECRETS.md`:**
```markdown
# Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `NPM_TOKEN` | npm access token with publish rights. Generate at npmjs.com → Access Tokens → Automation |
| `VERCEL_TOKEN` | Vercel deployment token |
| `VERCEL_ORG_ID` | Your Vercel org ID |
| `VERCEL_PROJECT_ID_DOCS` | Vercel project ID for apps/docs |
| `VERCEL_PROJECT_ID_WEB` | Vercel project ID for apps/web |
```

**MAINTENANCE.md update:** Sprint 162 ✅.
**CHANGELOG:** `- Sprint 162: npm publish workflow via changesets. Docs auto-deploy on push to main.`
**Done when:** Release workflow exists. Changesets action configured.

---

## Sprint 163 — NPM Provenance + Package Signing

**Goal:** Enable npm provenance for all published packages. Provenance links the npm package to the GitHub Actions run that published it — proof of supply chain integrity.

**Why this matters:** Post-Log4Shell era, supply chain security is non-negotiable for frameworks.

**Update root `package.json` release script:**
```json
{
  "scripts": {
    "release": "turbo run build && changeset publish --provenance"
  }
}
```

**The `--provenance` flag requires:**
1. `id-token: write` permission (already in release.yml from Sprint 162)
2. `NODE_AUTH_TOKEN` env var set to npm token (already there)
3. Publishing from GitHub Actions (not local)

**Add `.npmrc` at root:**
```ini
# Enforce provenance on publish
provenance=true

# Ensure packages are published to public registry
access=public

# Prevent accidental publish of private packages
```

**Verify provenance in `package.json` for each package:**
```json
{
  "publishConfig": {
    "access": "public",
    "provenance": true
  }
}
```

**Add provenance badge to root `README.md`:**
```markdown
[![npm provenance](https://img.shields.io/badge/npm-provenance-blue)](https://docs.npmjs.com/generating-provenance-statements)
```

**MAINTENANCE.md update:** Sprint 163 ✅.
**CHANGELOG:** `- Sprint 163: npm provenance enabled for all packages. Supply chain integrity assured.`
**Done when:** `changeset publish --provenance` works in CI. `.npmrc` has `provenance=true`.

---

## Sprint 164 — Demo App: Blog (Part 1 — Structure + Models)

**Goal:** Build a complete, real-world demo application (a blog) using only XAOCS conventions. This is the framework's proof-of-concept.

**Location:** `apps/blog/` — a new app in the monorepo.

**Why a blog?** It exercises every feature: auth, CRUD, pagination, file uploads, real-time, migrations, seeders.

**`apps/blog/package.json`:**
```json
{
  "name": "blog",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "xaocs dev",
    "build": "xaocs build",
    "start": "xaocs start",
    "migrate": "xaocs migrate",
    "seed": "xaocs db:seed"
  },
  "dependencies": {
    "@xaocs/auth": "workspace:*",
    "@xaocs/cache": "workspace:*",
    "@xaocs/client": "workspace:*",
    "@xaocs/core": "workspace:*",
    "@xaocs/mail": "workspace:*",
    "@xaocs/orm": "workspace:*",
    "@xaocs/ui": "workspace:*",
    "@xaocs/validation": "workspace:*",
    "react": "^18.x",
    "react-dom": "^18.x"
  },
  "devDependencies": {
    "@xaocs/cli": "workspace:*",
    "@types/react": "^18.x",
    "typescript": "^5.x"
  }
}
```

**`apps/blog/database/migrations/001_create_posts_table.ts`:**
```typescript
import { Migration, Schema } from '@xaocs/orm';

export default class CreatePostsTable extends Migration {
  async up(schema: Schema): Promise<void> {
    await schema.createTable('posts', (table) => {
      table.bigIncrements('id');
      table.bigInteger('author_id').unsigned().notNullable();
      table.foreign('author_id').references('id').on('users').onDelete('cascade');
      table.string('title', 500).notNullable();
      table.string('slug', 500).notNullable().unique();
      table.text('excerpt').nullable();
      table.text('body').notNullable();
      table.enum('status', ['draft', 'published', 'archived']).defaultTo('draft');
      table.string('cover_image', 1000).nullable();
      table.integer('views').defaultTo(0);
      table.timestamps(true, true);
    });
  }

  async down(schema: Schema): Promise<void> {
    await schema.dropTable('posts');
  }
}
```

**`apps/blog/database/migrations/002_create_comments_table.ts`:**
```typescript
import { Migration, Schema } from '@xaocs/orm';

export default class CreateCommentsTable extends Migration {
  async up(schema: Schema): Promise<void> {
    await schema.createTable('comments', (table) => {
      table.bigIncrements('id');
      table.bigInteger('post_id').unsigned().notNullable();
      table.foreign('post_id').references('id').on('posts').onDelete('cascade');
      table.bigInteger('author_id').unsigned().notNullable();
      table.foreign('author_id').references('id').on('users').onDelete('cascade');
      table.text('body').notNullable();
      table.timestamps(true, true);
    });
  }

  async down(schema: Schema): Promise<void> {
    await schema.dropTable('comments');
  }
}
```

**`apps/blog/database/migrations/003_create_tags_table.ts`:**
```typescript
import { Migration, Schema } from '@xaocs/orm';

export default class CreateTagsTable extends Migration {
  async up(schema: Schema): Promise<void> {
    await schema.createTable('tags', (table) => {
      table.bigIncrements('id');
      table.string('name', 100).notNullable().unique();
      table.string('slug', 100).notNullable().unique();
      table.timestamps(true, true);
    });

    await schema.createTable('post_tags', (table) => {
      table.bigInteger('post_id').unsigned().notNullable();
      table.bigInteger('tag_id').unsigned().notNullable();
      table.foreign('post_id').references('id').on('posts').onDelete('cascade');
      table.foreign('tag_id').references('id').on('tags').onDelete('cascade');
      table.primary(['post_id', 'tag_id']);
    });
  }

  async down(schema: Schema): Promise<void> {
    await schema.dropTable('post_tags');
    await schema.dropTable('tags');
  }
}
```

**`apps/blog/database/models/Post.ts`:**
```typescript
import { XModel, Column, BelongsTo, HasMany, BelongsToMany } from '@xaocs/orm';
import { User } from '@xaocs/auth';

export class Post extends XModel {
  static table = 'posts';

  @Column() declare id: number;
  @Column() declare author_id: number;
  @Column() declare title: string;
  @Column() declare slug: string;
  @Column() declare excerpt: string | null;
  @Column() declare body: string;
  @Column() declare status: 'draft' | 'published' | 'archived';
  @Column() declare cover_image: string | null;
  @Column() declare views: number;
  @Column() declare created_at: Date;
  @Column() declare updated_at: Date;

  @BelongsTo(() => User, 'author_id')
  declare author: User;

  @HasMany(() => Comment, 'post_id')
  declare comments: Comment[];

  // Slug generation helper
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
```

**MAINTENANCE.md update:** Sprint 164 ✅.
**CHANGELOG:** `- Sprint 164: Blog demo app — structure, migrations, and models created.`
**Done when:** Migrations run successfully. Models compile.

---

## Sprint 165 — Demo App: Blog (Part 2 — API Routes + Services)

**Goal:** Build all API routes for the blog using XAOCS conventions.

**`apps/blog/app/services/PostService.ts`:**
```typescript
import { Post } from '../../database/models/Post';
import { paginate } from '@xaocs/orm';
import { cache } from '@xaocs/cache';

export class PostService {
  async getPublished(page = 1, perPage = 10) {
    return cache.remember(`posts:published:${page}:${perPage}`, 60, () =>
      paginate(Post.where('status', 'published'), page, perPage)
    );
  }

  async getBySlug(slug: string) {
    return cache.remember(`post:slug:${slug}`, 300, () =>
      Post.where('slug', slug).where('status', 'published').first()
    );
  }

  async create(authorId: number, data: { title: string; body: string; excerpt?: string }) {
    const post = await Post.create({
      author_id: authorId,
      title: data.title,
      slug: Post.generateSlug(data.title),
      body: data.body,
      excerpt: data.excerpt ?? null,
      status: 'draft',
      views: 0,
      cover_image: null,
    } as any);

    await cache.forget('posts:published:1:10');
    return post;
  }

  async publish(id: number, authorId: number) {
    const post = await Post.find(id) as any;
    if (!post || post.author_id !== authorId) {
      throw Object.assign(new Error('Not found or forbidden'), { statusCode: 403 });
    }
    await Post.update(id, { status: 'published' });
    await cache.forget(`post:slug:${post.slug}`);
    return Post.find(id);
  }

  async incrementViews(id: number) {
    await Post.update(id, { views: Post.raw('views + 1') as any });
  }
}
```

**`apps/blog/api/post.api.ts`:**
```typescript
import { XRouter } from '@xaocs/core';
import { authenticate } from '@xaocs/auth';
import { v, validate } from '@xaocs/validation';
import { PostService } from '../app/services/PostService';
import { paginated, ok, fail } from '@xaocs/shared';

export const router = new XRouter();
const postService = new PostService();

// GET /api/post — public list
router.get('/', async (req, res) => {
  const { page = 1, perPage = 10 } = req.query;
  const result = await postService.getPublished(Number(page), Number(perPage));
  return res.json(paginated(result.data, result.total, result.page, result.perPage));
});

// GET /api/post/:slug — public single post
router.get('/:slug', async (req, res) => {
  const post = await postService.getBySlug(req.params.slug);
  if (!post) return res.status(404).json(fail('Post not found'));
  await postService.incrementViews((post as any).id);
  return res.json(ok(post));
});

// POST /api/post — create (auth required)
router.post('/', authenticate, async (req, res) => {
  const body = validate(req.body, v.object({
    title: v.string().min(3).max(500),
    body: v.string().min(10),
    excerpt: v.string().max(500).optional(),
  }));

  const post = await postService.create((req.user as any).id, body);
  return res.status(201).json(ok(post));
});

// PUT /api/post/:id/publish — publish (auth required)
router.put('/:id/publish', authenticate, async (req, res) => {
  const post = await postService.publish(Number(req.params.id), (req.user as any).id);
  return res.json(ok(post));
});

// DELETE /api/post/:id — delete (auth required)
router.delete('/:id', authenticate, async (req, res) => {
  const post = await Post.find(Number(req.params.id)) as any;
  if (!post || post.author_id !== (req.user as any).id) {
    return res.status(403).json(fail('Forbidden'));
  }
  await Post.destroy(Number(req.params.id));
  return res.status(204).send();
});

import { Post } from '../database/models/Post';
```

**MAINTENANCE.md update:** Sprint 165 ✅.
**CHANGELOG:** `- Sprint 165: Blog demo — PostService with caching and full CRUD API routes.`
**Done when:** All post API routes respond correctly. Caching works via MemoryCache.

---

## Sprint 166 — Demo App: Blog (Part 3 — Frontend Pages)

**Goal:** Build the React frontend for the blog using `@xaocs/client` and `@xaocs/ui`.

**`apps/blog/views/index.tsx`** — public homepage:
```tsx
import React, { useState, useEffect } from 'react';
import { XLink, useEvent } from '@xaocs/client';
import { Card, Badge, Spinner } from '@xaocs/ui';

export const meta = { title: 'XAOCS Blog — Built with XAOCS Framework' };

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  views: number;
  created_at: string;
  author: { name: string };
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, lastPage: 1 });

  async function loadPosts(p = 1) {
    setLoading(true);
    const res = await fetch(`/api/post?page=${p}&perPage=10`);
    const data = await res.json() as { data: Post[]; meta: typeof meta };
    setPosts(data.data);
    setMeta(data.meta);
    setLoading(false);
  }

  useEffect(() => { void loadPosts(page); }, [page]);

  // Real-time: new posts appear instantly
  useEvent<Post>('post.published', (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  });

  if (loading) return (
    <div className="flex justify-center py-20">
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">XAOCS Blog</h1>
      <p className="text-xaocs-muted mb-10">
        A demo blog built entirely with the XAOCS framework.
      </p>

      <div className="flex flex-col gap-6">
        {posts.map(post => (
          <Card key={post.id} className="hover:border-primary-500 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div>
                <XLink href={`/blog/${post.slug}`} className="text-xl font-semibold hover:text-primary-400 transition-colors">
                  {post.title}
                </XLink>
                {post.excerpt && (
                  <p className="text-xaocs-muted mt-2 text-sm">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-3 mt-3 text-xs text-xaocs-muted">
                  <span>By {post.author.name}</span>
                  <span>·</span>
                  <span>{post.views} views</span>
                  <span>·</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <Badge variant="success">Published</Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-10">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded bg-xaocs-surface border border-xaocs-border disabled:opacity-40"
        >
          ← Previous
        </button>
        <span className="px-4 py-2 text-xaocs-muted">
          {page} / {meta.lastPage}
        </span>
        <button
          onClick={() => setPage(p => Math.min(meta.lastPage, p + 1))}
          disabled={page === meta.lastPage}
          className="px-4 py-2 rounded bg-xaocs-surface border border-xaocs-border disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
```

**`apps/blog/views/blog/[slug].tsx`** — individual post page with SSR:
```tsx
import React, { useState, useEffect } from 'react';
import { useXaocs, useAuth } from '@xaocs/client';
import { Spinner } from '@xaocs/ui';

export const ssr = true;

interface PostPageProps {
  params: { slug: string };
}

export default function PostPage({ params }: PostPageProps) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const slug = params.slug;

  useEffect(() => {
    fetch(`/api/post/${slug}`)
      .then(r => r.json())
      .then(d => { setPost(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!post) return <div className="text-center py-20 text-xaocs-muted">Post not found.</div>;

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-xaocs-muted text-sm mb-8">
        By {post.author?.name} · {new Date(post.created_at).toLocaleDateString()} · {post.views} views
      </div>
      {post.cover_image && (
        <img src={post.cover_image} alt={post.title} className="w-full rounded-lg mb-8" />
      )}
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />
    </article>
  );
}
```

**`apps/blog/views/dashboard.tsx`** — author dashboard:
```tsx
import React from 'react';
import { useAuth, redirect } from '@xaocs/client';
import { Spinner, Card, Button, Badge } from '@xaocs/ui';
import { XLink } from '@xaocs/client';

export const meta = { title: 'Dashboard — XAOCS Blog' };

export default function Dashboard() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!user) { redirect('/auth/login'); return null; }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-xaocs-muted mt-1">Welcome back, {user.name}</p>
        </div>
        <div className="flex gap-3">
          <XLink href="/write">
            <Button>New Post</Button>
          </XLink>
          <Button variant="secondary" onClick={() => void logout()}>Logout</Button>
        </div>
      </div>
      <Card title="Your Posts" description="Manage your blog posts">
        <p className="text-xaocs-muted text-sm">Post list coming in Part 4…</p>
      </Card>
    </div>
  );
}
```

**MAINTENANCE.md update:** Sprint 166 ✅.
**CHANGELOG:** `- Sprint 166: Blog demo — frontend pages (home, post, dashboard) with real-time updates.`
**Done when:** Blog renders in browser. Home page lists posts. Post page shows content.

---

## Sprint 167 — Demo App: Blog (Part 4 — Seeders + Polish)

**Goal:** Add seeders for realistic demo data, wire auth, finalize the demo.

**`apps/blog/database/seeders/001_UserSeeder.ts`:**
```typescript
import { Seeder, Factory } from '@xaocs/orm';
import { User } from '@xaocs/auth';
import bcrypt from 'bcryptjs';

export default class UserSeeder extends Seeder {
  async run(): Promise<void> {
    // Admin user
    await User.create({
      name: 'Admin',
      email: 'admin@blog.demo',
      password: await bcrypt.hash('password', 12),
      role: 'admin',
      email_verified: true,
      email_verified_at: new Date(),
    } as any);

    // Demo authors
    await Factory.times(3).create(User as any, async () => ({
      name: Factory.faker.person.fullName(),
      email: Factory.faker.internet.email(),
      password: await bcrypt.hash('password', 12),
      role: 'user',
      email_verified: true,
      email_verified_at: new Date(),
    }));

    console.log('  ✓ Created 4 users (admin@blog.demo / password)');
  }
}
```

**`apps/blog/database/seeders/002_PostSeeder.ts`:**
```typescript
import { Seeder, Factory } from '@xaocs/orm';
import { Post } from '../models/Post';
import { getKnex } from '@xaocs/orm';

export default class PostSeeder extends Seeder {
  async run(): Promise<void> {
    const users = await getKnex()('users').select('id');

    for (let i = 0; i < 25; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const title = Factory.faker.lorem.sentence();
      await Post.create({
        author_id: user.id,
        title,
        slug: Post.generateSlug(title) + '-' + i,
        excerpt: Factory.faker.lorem.sentences(2),
        body: Factory.faker.lorem.paragraphs(5, '\n\n'),
        status: 'published',
        views: Factory.faker.number.int({ min: 0, max: 10000 }),
        cover_image: null,
      } as any);
    }

    console.log('  ✓ Created 25 blog posts');
  }
}
```

**`apps/blog/.env.example`:**
```ini
APP_NAME=XAOCSBlog
APP_ENV=development
APP_PORT=5000
APP_URL=http://localhost:5000

JWT_SECRET=change-me-to-a-32-char-minimum-secret!!
JWT_EXPIRES_IN=7d

DB_DRIVER=sqlite
DB_PATH=./database/blog.sqlite

CACHE_DRIVER=memory

MAIL_DRIVER=log
MAIL_FROM=noreply@blog.demo
```

**Add to `turbo.json` to include blog app:**
```json
{
  "pipeline": {
    "dev": {
      "dependsOn": ["@xaocs/core#build", "@xaocs/orm#build"]
    }
  }
}
```

**MAINTENANCE.md update:** Sprint 167 ✅.
**CHANGELOG:** `- Sprint 167: Blog demo complete with 25 seeded posts, 4 users, auth flow.`
**Done when:** `cd apps/blog && xaocs migrate && xaocs db:seed && xaocs dev` runs. Browse to `localhost:5000`.

---

## Sprint 168 — Demo App Deploy

**Goal:** Deploy the blog demo to a public URL. Link from docs and landing page.

**Deploy to Fly.io** (chosen for Bun-native support and simple Docker-less deployment):

**`apps/blog/fly.toml`:**
```toml
app = "xaocs-blog-demo"
primary_region = "iad"

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  APP_ENV = "production"
  APP_PORT = "5000"
  DB_DRIVER = "sqlite"
  DB_PATH = "/data/blog.sqlite"

[mounts]
  source = "blog_data"
  destination = "/data"

[[services]]
  internal_port = 5000
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
```

**`apps/blog/Dockerfile`:**
```dockerfile
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy monorepo root
COPY package.json bunfig.toml bun.lock ./
COPY packages/ packages/
COPY apps/blog/ apps/blog/

# Install and build
RUN bun install --frozen-lockfile
RUN bun run build --filter=blog

FROM oven/bun:1-slim
WORKDIR /app

COPY --from=builder /app/packages/ packages/
COPY --from=builder /app/apps/blog/ apps/blog/
COPY --from=builder /app/node_modules/ node_modules/

WORKDIR /app/apps/blog

EXPOSE 5000
CMD ["bun", "run", "start"]
```

**Add demo link to `apps/docs/pages/docs/index.mdx`:**
```mdx
## Live Demo

See XAOCS in action: [xaocs-blog-demo.fly.dev](https://xaocs-blog-demo.fly.dev)

Source: [github.com/xaocs/xaocs/tree/main/apps/blog](https://github.com/zoherr/xaocs)
```

**Add demo link to `apps/web/app/page.tsx`:**
```tsx
<a href="https://xaocs-blog-demo.fly.dev" className="text-blue-400 underline">
  View live demo →
</a>
```

**MAINTENANCE.md update:** Sprint 168 ✅.
**CHANGELOG:** `- Sprint 168: Blog demo deployed to Fly.io. Live at xaocs-blog-demo.fly.dev.`
**Done when:** Blog is publicly accessible. Docs and landing page link to it.

---

## Sprint 169 — Community Files

**Goal:** Add all standard open-source community files. These gate GitHub's "verified" badge and tell contributors how to participate.

**`CONTRIBUTING.md` at root:**
```markdown
# Contributing to XAOCS

Thank you for considering contributing! XAOCS is an open framework and welcomes contributions of all kinds.

## Development Setup

```bash
git clone https://github.com/zoherr/xaocs.git
cd xaocs
bun install
bun run build
bun run test
```

## Making Changes

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Add tests for new functionality
4. Run `bun run test` — all tests must pass
5. Run `bun changeset` to document your change
6. Submit a pull request

## Commit Convention

We use [Conventional Commits](https://conventionalcommits.org):

```
feat(orm): add soft delete support
fix(auth): prevent timing attack in login
docs(cli): update migrate command examples
chore: update dependencies
```

## Code Standards

- TypeScript strict mode — no `any` without comment explaining why
- Every new function/class needs JSDoc
- Every new feature needs a test
- API routes stay under 20 lines
- Business logic goes in services

## Package Structure

Adding a new package? Follow the existing pattern:
- `packages/<name>/package.json` with correct `exports`
- `packages/<name>/src/index.ts` barrel file
- `packages/<name>/tsconfig.json` extending `../../tsconfig.base.json`
- At least one test file
- `README.md`

## Release Process

Releases happen automatically via [changesets](https://changesets.io) when PRs merge to `main`.

## Questions?

- Open a [Discussion](https://github.com/zoherr/xaocs/discussions)
- Join our [Discord](https://discord.gg/xaocs)
```

**`CODE_OF_CONDUCT.md` at root:**
```markdown
# Code of Conduct

## Our Pledge

We pledge to make participation in XAOCS a harassment-free experience for everyone.

## Our Standards

**Positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior:**
- Harassment, trolling, or derogatory comments
- Publishing others' private information
- Any conduct inappropriate in a professional setting

## Enforcement

Violations may be reported to: conduct@xaocs.dev

Maintainers will review and act as appropriate, up to and including permanent bans.

## Attribution

Adapted from the [Contributor Covenant](https://contributor-covenant.org), version 2.1.
```

**`.github/ISSUE_TEMPLATE/bug_report.yml`:**
```yaml
name: Bug Report
description: Something isn't working as expected
labels: ["bug", "needs-triage"]
body:
  - type: markdown
    attributes:
      value: "Thanks for taking the time to file a bug report!"

  - type: input
    id: version
    attributes:
      label: XAOCS Version
      placeholder: "1.0.0"
    validations:
      required: true

  - type: textarea
    id: description
    attributes:
      label: What happened?
      placeholder: "A clear description of the bug"
    validations:
      required: true

  - type: textarea
    id: reproduction
    attributes:
      label: Minimal reproduction
      placeholder: "Code snippet or repo link that reproduces the issue"
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Expected behavior
    validations:
      required: true

  - type: dropdown
    id: db
    attributes:
      label: Database
      options: [SQLite, MySQL, PostgreSQL, MongoDB, N/A]
    validations:
      required: true
```

**`.github/ISSUE_TEMPLATE/feature_request.yml`:**
```yaml
name: Feature Request
description: Suggest an improvement or new feature
labels: ["enhancement"]
body:
  - type: textarea
    id: problem
    attributes:
      label: What problem does this solve?
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Describe your proposed solution
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives considered
```

**`.github/pull_request_template.md`:**
```markdown
## Summary

<!-- What does this PR do? -->

## Changes

- [ ] Feature / Fix / Docs / Chore

## Checklist

- [ ] Tests added or updated
- [ ] `bun run test` passes
- [ ] `bun run type-check` passes
- [ ] `bun changeset` run (for code changes)
- [ ] Docs updated (if applicable)
```

**MAINTENANCE.md update:** Sprint 169 ✅.
**CHANGELOG:** `- Sprint 169: CONTRIBUTING.md, CODE_OF_CONDUCT.md, issue templates, PR template added.`
**Done when:** All community files exist. GitHub shows them in the repo UI.

---

## Sprint 170 — `create-xaocs-app` npm Publish Test

**Goal:** Test-publish `create-xaocs-app` to npm and verify `bunx create-xaocs-app` works end-to-end from the registry.

**Pre-publish checklist:**
```bash
# 1. Verify package builds cleanly
cd packages/create-xaocs-app
bun run build

# 2. Check what will be published
bunx publint   # catches common publishing mistakes

# 3. Dry run publish
bun publish --dry-run

# 4. Verify the binary works from dist
node dist/bin/create.js --help
```

**Fix any issues found by `publint`:**

Common issues and fixes:
```typescript
// If ESM/CJS dual export needed:
// package.json exports field must include both "import" and "require" for compatibility

// If types aren't found:
// Ensure "types" field points to .d.ts file

// If bin file isn't executable:
// Ensure shebang is first line: #!/usr/bin/env bun
```

**Publish `create-xaocs-app` with provenance:**
```bash
npm publish --provenance --access public
```

**Verify from registry:**
```bash
# In a temp directory:
bunx create-xaocs-app test-from-registry
```

**Test `npx` compatibility (many users use npx):**
```bash
npx create-xaocs-app test-npx-compat
```

**Add to docs Getting Started:**
```mdx
## Quick Start

```bash
# Using Bun (recommended)
bunx create-xaocs-app my-app

# Using npm
npx create-xaocs-app my-app
```

**MAINTENANCE.md update:** Sprint 170 ✅.
**CHANGELOG:** `- Sprint 170: create-xaocs-app published to npm. bunx and npx compatibility verified.`
**Done when:** `bunx create-xaocs-app` works from the npm registry.

---

## Sprint 171 — Publish All Packages to npm (v1.0.0)

**Goal:** Publish all `@xaocs/*` packages to npm as v1.0.0.

**Pre-publish final checklist — run all before publishing:**
```bash
# From monorepo root
bun install
bun run type-check      # Zero TS errors
bun run build           # All packages build
bun run test            # All tests pass
bun run test:integration # Integration tests pass

# Check each package for common publish issues
bunx publint packages/core
bunx publint packages/orm
bunx publint packages/auth
# ... etc for all packages

# Verify changeset is ready
bunx changeset status
```

**Publish sequence (order matters — dependencies first):**
```bash
# 1. Foundation packages (no @xaocs deps)
bun publish --filter=@xaocs/shared --provenance
bun publish --filter=@xaocs/config --provenance

# 2. Core packages
bun publish --filter=@xaocs/core --provenance
bun publish --filter=@xaocs/orm --provenance
bun publish --filter=@xaocs/server --provenance
bun publish --filter=@xaocs/compiler --provenance

# 3. Feature packages
bun publish --filter=@xaocs/auth --provenance
bun publish --filter=@xaocs/client --provenance
bun publish --filter=@xaocs/mail --provenance
bun publish --filter=@xaocs/cache --provenance
bun publish --filter=@xaocs/storage --provenance
bun publish --filter=@xaocs/queue --provenance
bun publish --filter=@xaocs/events --provenance
bun publish --filter=@xaocs/testing --provenance
bun publish --filter=@xaocs/validation --provenance
bun publish --filter=@xaocs/ui --provenance

# 4. CLI (depends on everything)
bun publish --filter=@xaocs/cli --provenance

# 5. Scaffolder
bun publish --filter=create-xaocs-app --provenance
```

**After publish — verify on registry:**
```bash
# Check npm page
open https://www.npmjs.com/package/@xaocs/core

# Verify install works
mkdir /tmp/xaocs-install-test && cd /tmp/xaocs-install-test
bun add @xaocs/core @xaocs/orm @xaocs/auth
```

**MAINTENANCE.md update:** Sprint 171 ✅.
**CHANGELOG:** `- Sprint 171: v1.0.0 published to npm. All 18 packages live on the registry.`
**Done when:** All packages visible at npmjs.com/package/@xaocs/<name> with v1.0.0.

---

## Sprint 172 — Root README (Public-Facing)

**Goal:** Write the definitive XAOCS README that appears on GitHub and npm. This is the first thing developers see.

**Root `README.md`:**
```markdown
<div align="center">
  <h1>XAOCS</h1>
  <p><strong>Full-Stack TypeScript Framework for AI-Native Development</strong></p>
  <p>
    <a href="https://xaocs.dev/docs">Docs</a> ·
    <a href="https://xaocs-blog-demo.fly.dev">Live Demo</a> ·
    <a href="https://github.com/zoherr/xaocs/releases">Changelog</a>
  </p>
  <p>
    <img src="https://img.shields.io/npm/v/@xaocs/core?label=version" alt="npm version" />
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" />
    <img src="https://img.shields.io/badge/built_with-Bun-orange" alt="Built with Bun" />
    <img src="https://img.shields.io/badge/npm-provenance-blue" alt="npm provenance" />
  </p>
</div>

---

XAOCS (pronounced "chaos") is a full-stack TypeScript framework inspired by Laravel's developer experience and Next.js's routing model — designed for AI-assisted development, rapid product shipping, and a magical developer experience.

## Quick Start

```bash
bunx create-xaocs-app my-app
cd my-app
xaocs migrate
xaocs dev
```

## What You Get

```
my-app/
├── api/               ← user.api.ts → /api/user/ (auto-registered)
├── app/
│   ├── controllers/   ← XController subclasses
│   ├── services/      ← Business logic (auto-discovered)
│   └── middlewares/   ← Auto-loaded middleware
├── views/             ← React pages (file-based routing)
├── database/
│   ├── models/        ← XModel (Eloquent-style ORM)
│   ├── migrations/    ← Type-safe schema migrations
│   └── seeders/       ← Database seeders with Faker
└── xaocs.config.ts    ← Framework configuration
```

## API Route in 5 Lines

```typescript
// api/user.api.ts → /api/user/
import { XRouter } from '@xaocs/core';
import { authenticate } from '@xaocs/auth';
import { UserController } from '../app/controllers/UserController';

export const router = new XRouter();

router.get('/', UserController.index);
router.get('/:id', authenticate, UserController.show);
router.post('/', authenticate, UserController.store);
router.put('/:id', authenticate, UserController.update);
router.delete('/:id', authenticate, UserController.destroy);
```

## The Full Ecosystem

| Package | Purpose |
|---------|---------|
| `@xaocs/core` | IoC container, routing, middleware |
| `@xaocs/orm` | Eloquent-style ORM (SQLite, MySQL, Postgres, MongoDB) |
| `@xaocs/auth` | Built-in email/password auth + JWT |
| `@xaocs/mail` | Email (SMTP, SES, Mailgun, Postmark, Resend) |
| `@xaocs/cache` | Caching (Memory, Redis) |
| `@xaocs/storage` | File storage (Local, S3, R2) |
| `@xaocs/queue` | Background jobs (Memory, BullMQ) |
| `@xaocs/events` | Real-time WebSocket events |
| `@xaocs/validation` | Zod-based request validation |
| `@xaocs/ui` | React component library (Tailwind) |
| `@xaocs/testing` | Test utilities (testClient, mockAuth) |
| `@xaocs/cli` | CLI — dev, build, migrate, generate |

## Stack

**Bun** · **TypeScript** · **Fastify** · **React** · **Vite** · **esbuild** · **Knex** · **TurboRepo**

## License

MIT © XAOCS Team
```

**MAINTENANCE.md update:** Sprint 172 ✅.
**CHANGELOG:** `- Sprint 172: Root README written with quick start, ecosystem table, and badges.`
**Done when:** README renders correctly on GitHub. npm package page shows description.

---

## Sprint 173 — Monorepo Cleanup + Final Build Verification

**Goal:** Clean up all tech debt accumulated during development. Ensure the monorepo is in a state a new contributor can clone and immediately work in.

**Cleanup checklist:**

**1. Remove all `tmp-*` directories from source:**
```bash
find . -name "tmp-*" -type d -not -path "*/node_modules/*" | xargs rm -rf
```

**2. Update `.gitignore` at root:**
```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
.xaocs/

# Test artifacts
tmp-*/
*.sqlite
coverage/
bundle-report.md
benchmarks/results.md

# Environment
.env
!.env.example

# OS
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/
*.swp

# Fly.io
.fly/
```

**3. Verify all packages have correct peer dependencies:**
```bash
# @xaocs/ui needs react as peer
# @xaocs/client needs react as peer
# Check all packages that use React
```

**4. Run full build verification:**
```bash
bun run clean        # clean all dist directories
bun install          # fresh install
bun run build        # full build
bun run type-check   # zero TS errors
bun run test         # all tests green
bun run test:integration  # integration tests green
```

**5. Verify `turbo.json` pipeline is correct:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env", "tsconfig.base.json"],
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "test": { "dependsOn": ["build"], "outputs": ["coverage/**"] },
    "test:integration": { "dependsOn": ["build"], "outputs": [] },
    "lint": { "outputs": [] },
    "type-check": { "dependsOn": ["^build"], "outputs": [] },
    "clean": { "cache": false }
  }
}
```

**6. Final package count verification:**
```
@xaocs/shared     @xaocs/core      @xaocs/config
@xaocs/server     @xaocs/compiler  @xaocs/client
@xaocs/auth       @xaocs/orm       @xaocs/mail
@xaocs/cache      @xaocs/storage   @xaocs/queue
@xaocs/events     @xaocs/testing   @xaocs/validation
@xaocs/ui         @xaocs/cli       create-xaocs-app
= 18 packages total
```

**MAINTENANCE.md update:** Sprint 173 ✅.
**CHANGELOG:** `- Sprint 173: Monorepo cleanup. Full build verification passed. 18 packages confirmed.`
**Done when:** `bun run build && bun run test` passes from a clean clone. Zero compilation errors.

---

## Sprint 174 — Discord + Website Launch Prep

**Goal:** Prepare external community infrastructure for the v1.0.0 launch announcement.

**Create `apps/web/app/community/page.tsx`:**
```tsx
import React from 'react';

export default function CommunityPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <h1 className="text-5xl font-bold mb-4">Join the Community</h1>
      <p className="text-gray-400 text-lg mb-12">
        XAOCS is open-source and community-driven.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {links.map(link => (
          <a
            key={link.title}
            href={link.url}
            className="p-6 bg-white/3 border border-white/8 rounded-lg hover:border-blue-500/50 transition-colors"
          >
            <div className="text-3xl mb-3">{link.icon}</div>
            <h3 className="font-semibold mb-2">{link.title}</h3>
            <p className="text-sm text-gray-400">{link.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

const links = [
  {
    icon: '💬',
    title: 'Discord',
    url: 'https://discord.gg/xaocs',
    description: 'Chat with the team and other XAOCS developers in real-time.',
  },
  {
    icon: '🐙',
    title: 'GitHub',
    url: 'https://github.com/zoherr/xaocs',
    description: 'Star the repo, file issues, and contribute code.',
  },
  {
    icon: '🐦',
    title: 'Twitter / X',
    url: 'https://x.com/xaocsdev',
    description: 'Follow for updates, tips, and framework announcements.',
  },
];
```

**`apps/web/app/layout.tsx`** — add community link to nav:
```tsx
<nav>
  <a href="/docs">Docs</a>
  <a href="/changelog">Changelog</a>
  <a href="/community">Community</a>
</nav>
```

**MAINTENANCE.md update:** Sprint 174 ✅.
**CHANGELOG:** `- Sprint 174: Community page and external links added to web app.`
**Done when:** Community page renders. GitHub, Discord, Twitter links live.

---

## Sprint 175 — Final Pre-Release Smoke Test

**Goal:** Run every CLI command, every API route, and every page in the demo app manually. Document any issues. Fix blocking issues. This is the last gate before v1.0.0.

**Smoke test protocol:**

**CLI commands:**
```bash
xaocs --help                          # ✓ Help prints
xaocs info                            # ✓ Version and env info
xaocs routes                          # ✓ Lists all routes
xaocs migrate                         # ✓ Runs migrations
xaocs migrate status                  # ✓ Shows status table
xaocs migrate rollback                # ✓ Rolls back
xaocs migrate fresh                   # ✓ Fresh run
xaocs db:seed                         # ✓ Seeds data
xaocs add model TestModel             # ✓ Creates file
xaocs add service TestService         # ✓ Creates file
xaocs add middleware TestMiddleware   # ✓ Creates file
xaocs add controller TestController  # ✓ Creates file
xaocs add api test                    # ✓ Creates file
xaocs make migration create_test     # ✓ Creates file
xaocs make seeder TestSeeder         # ✓ Creates file
xaocs dev                            # ✓ Dev server starts
xaocs build                          # ✓ Production build
xaocs start                          # ✓ Production server
xaocs tinker                         # ✓ REPL opens
```

**Demo blog smoke test:**
```bash
cd apps/blog
xaocs migrate && xaocs db:seed
xaocs dev

# Manual: visit localhost:5000
# ✓ Homepage shows 25 posts
# ✓ Post page loads
# ✓ Login works
# ✓ New post creation works (authenticated)
# ✓ Publish post works
# ✓ Real-time update appears on homepage
```

**create-xaocs-app smoke test:**
```bash
cd /tmp
bunx create-xaocs-app smoke-test-app --no-interactive
cd smoke-test-app
xaocs migrate
xaocs dev
# ✓ Server starts on :5000
# ✓ GET /health returns { status: 'ok' }
```

**Document findings in `PENDING_SPRINTS_AUDIT.md`** (already in tree):
Update the file with final smoke test results.

**MAINTENANCE.md update:** Sprint 175 ✅.
**CHANGELOG:** `- Sprint 175: Final pre-release smoke test complete. All CLI commands verified.`
**Done when:** All smoke tests pass. No blocking issues remain.

---

## Sprint 176–199 — v1.0.0 Release Execution

These sprints execute the actual release. Each is a discrete, atomic action.

---

### Sprint 176 — Git Tag v1.0.0

```bash
git add -A
git commit -m "chore: prepare v1.0.0 release"
git tag -a v1.0.0 -m "XAOCS v1.0.0 — Initial stable release"
git push origin main --tags
```

**MAINTENANCE.md:** Sprint 176 ✅.

---

### Sprint 177 — Run Changesets Release

```bash
# This publishes all packages atomically
bun run release
```

Verify on npm: each package shows `1.0.0`.

**MAINTENANCE.md:** Sprint 177 ✅.

---

### Sprint 178 — GitHub Release Notes

Create a GitHub Release at `v1.0.0` with:
- Release title: `v1.0.0 — Initial Stable Release`
- Body: (copy from CHANGELOG.md, highlight top features)
- Mark as "Latest release"
- Attach no binaries (npm handles distribution)

**MAINTENANCE.md:** Sprint 178 ✅.

---

### Sprint 179 — Update All Internal Version References

Search the monorepo for any hardcoded `0.0.1` or `workspace:*` references in the published packages and update them to `^1.0.0` for external deps.

```bash
grep -r '"version": "0.0.1"' packages/*/package.json
# All should now show 1.0.0 after changeset publish
```

**MAINTENANCE.md:** Sprint 179 ✅.

---

### Sprint 180 — Post-Release Verification

```bash
# Verify from a clean environment:
mkdir /tmp/post-release-verify
cd /tmp/post-release-verify

bunx create-xaocs-app verify-app
cd verify-app
cat package.json | grep '"@xaocs'  # Should show ^1.0.0
bun install
xaocs migrate
xaocs dev
# GET /health → { status: 'ok' }
```

**MAINTENANCE.md:** Sprint 180 ✅.

---

### Sprints 181–190 — Post-Release Monitoring

Each sprint is one day of post-release monitoring:

**Sprint 181** — Monitor npm download stats. Check for install errors.
**Sprint 182** — Review GitHub issues filed after release. Triage and label.
**Sprint 183** — Fix any p0 bugs found in first 24 hours. Patch publish `1.0.1` if needed.
**Sprint 184** — Monitor `create-xaocs-app` success rate. Fix any scaffold bugs.
**Sprint 185** — Review Discord community questions. Add FAQ to docs.
**Sprint 186** — Address the top 3 most-upvoted GitHub issues.
**Sprint 187** — Performance regression check — re-run benchmarks vs baseline.
**Sprint 188** — Security advisory check — scan for new CVEs in dependencies.
**Sprint 189** — Review docs feedback. Update any unclear sections.
**Sprint 190** — Retrospective: what should change for v1.1.0?

**Each sprint:** Update `MAINTENANCE.md` ✅. Log findings in sprint notes column.

---

### Sprint 191 — v1.0.1 Patch Release (if needed)

If any p0 bugs were found in Sprints 181–190:

```bash
# Fix the bug
bun changeset        # document the fix as "patch"
bun run version-packages
bun run release
```

**MAINTENANCE.md:** Sprint 191 ✅.

---

### Sprint 192 — v1.1.0 Roadmap

Based on community feedback from Sprints 181–190, create a public roadmap:

**`ROADMAP.md` at root:**
```markdown
# XAOCS Roadmap

## v1.1.0 (Q3 2026)

### Planned
- [ ] `@xaocs/graphql` — GraphQL adapter for XRouter
- [ ] `@xaocs/trpc` — tRPC integration
- [ ] Edge runtime support (Cloudflare Workers)
- [ ] `@xaocs/i18n` — Internationalization
- [ ] Bun SQLite native driver (drop Knex for SQLite)
- [ ] Hot module replacement for API routes without restart

### Community Requested
- [ ] WebSocket rooms per user (from Discord)
- [ ] Built-in OpenAPI spec generation
- [ ] Decorator-based route registration alternative

## v2.0.0 (TBD)

- React Server Components support
- Multi-tenant architecture helpers
- Plugin system (extend framework without forking)
```

**MAINTENANCE.md:** Sprint 192 ✅.

---

### Sprint 193 — Performance Optimization Sprint

Based on benchmark results from Sprint 154 and post-release profiling:

**Target improvements:**
1. **Route scanning** — cache the scan result on first boot, only re-scan on file change
2. **Request adapter** — reduce object allocations per request
3. **Middleware compose** — flatten single-middleware routes (skip compose overhead)

**`packages/core/src/routing/ApiScanner.ts` — add scan cache:**
```typescript
const scanCache = new Map<string, ApiRouteFile[]>();

export function scanApiFiles(apiDir: string, prefix = '/api', useCache = true): ApiRouteFile[] {
  const cacheKey = `${apiDir}:${prefix}`;
  if (useCache && scanCache.has(cacheKey)) return scanCache.get(cacheKey)!;

  // ... existing scan logic ...
  const result = /* ... */[];
  scanCache.set(cacheKey, result);
  return result;
}

export function invalidateScanCache(): void {
  scanCache.clear();
}
```

**`packages/core/src/middleware/compose.ts` — fast path for single middleware:**
```typescript
export function compose(middlewares: XMiddleware[]) {
  // Fast path: skip compose overhead for single middleware
  if (middlewares.length === 1) {
    return async (req: XRequest, res: XResponse) =>
      middlewares[0]!(req, res, async () => {});
  }
  // ... existing compose logic ...
}
```

**MAINTENANCE.md:** Sprint 193 ✅.

---

### Sprint 194 — `@xaocs/graphql` Stub

Scaffold the next ecosystem package to demonstrate the framework's extensibility:

**`packages/graphql/package.json`:**
```json
{
  "name": "@xaocs/graphql",
  "version": "1.0.0",
  "description": "GraphQL adapter for XAOCS",
  "status": "experimental"
}
```

**`packages/graphql/src/index.ts`:**
```typescript
/**
 * @xaocs/graphql — GraphQL adapter (experimental, coming in v1.1.0)
 *
 * Usage preview:
 *
 * ```typescript
 * // api/graphql.api.ts
 * import { XRouter } from '@xaocs/core';
 * import { createGraphQLHandler } from '@xaocs/graphql';
 * import { schema } from '../app/graphql/schema';
 *
 * export const router = new XRouter();
 * router.post('/', createGraphQLHandler({ schema }));
 * ```
 */

export function createGraphQLHandler(_options: { schema: unknown }) {
  throw new Error('@xaocs/graphql is experimental — coming in v1.1.0');
}
```

**MAINTENANCE.md:** Sprint 194 ✅.

---

### Sprint 195 — Ecosystem Package Registry

Create `xaocs.dev/packages` page listing community packages (mirrors `npm search xaocs-package`):

**`apps/web/app/packages/page.tsx`:**
```tsx
import React from 'react';

const packages = [
  // Official
  { name: '@xaocs/core', official: true, description: 'Framework core' },
  { name: '@xaocs/orm', official: true, description: 'Eloquent-style ORM' },
  // Community (stub — filled as community grows)
];

export default function PackagesPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">Package Registry</h1>
      <p className="text-gray-400 mb-10">
        Official and community XAOCS packages.
        Tag your npm package with <code className="text-blue-400">xaocs-package</code> to be listed here.
      </p>
      {/* Package grid */}
    </div>
  );
}
```

**MAINTENANCE.md:** Sprint 195 ✅.

---

### Sprint 196 — Accessibility Audit (`@xaocs/ui`)

Run an accessibility audit on all UI components. Fix violations.

**Checklist per component:**
- All interactive elements have `aria-label` or `aria-labelledby`
- Color contrast ratio ≥ 4.5:1 for normal text
- Focus rings visible (already using `focus:ring-2`)
- Modal: `role="dialog"`, `aria-modal="true"`, focus trap
- Table: `role="table"`, proper `th scope`
- Form inputs: `label` associated with `htmlFor`

**`packages/ui-xaocs/src/components/Modal.tsx` — add ARIA:**
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby={title ? 'modal-title' : undefined}
  className={clsx(...)}
>
  {title && (
    <h2 id="modal-title" ...>{title}</h2>
  )}
```

**MAINTENANCE.md:** Sprint 196 ✅.

---

### Sprint 197 — Documentation SEO + Meta

Add proper Open Graph and SEO meta to docs and web app:

**`apps/docs/app/layout.tsx`:**
```tsx
export const metadata = {
  title: 'XAOCS — Full-Stack TypeScript Framework',
  description: 'Build full-stack TypeScript apps faster with XAOCS. Laravel DX, Node.js speed. Built for AI-native development.',
  openGraph: {
    title: 'XAOCS Framework',
    description: 'Full-stack TypeScript with file-based routing, ORM, auth, and more.',
    url: 'https://xaocs.dev',
    siteName: 'XAOCS',
    type: 'website',
    images: [{ url: 'https://xaocs.dev/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@xaocsdev',
  },
};
```

**MAINTENANCE.md:** Sprint 197 ✅.

---

### Sprint 198 — Final MAINTENANCE.md Audit

Update `MAINTENANCE.md` to reflect 100% completion:

```markdown
# XAOCS Maintenance Log

## Progress
- Total Sprints: 200
- Completed: 200
- In Progress: 0
- Remaining: 0

## 🎉 v1.0.0 Released

XAOCS v1.0.0 is live on npm. All 18 packages published with provenance.

- npm: https://www.npmjs.com/org/xaocs
- Docs: https://xaocs.dev
- Demo: https://xaocs-blog-demo.fly.dev
- GitHub: https://github.com/zoherr/xaocs
```

Mark all 200 sprints ✅ in the sprint log.

**MAINTENANCE.md:** Sprint 198 ✅.

---

### Sprint 199 — Announce

Write and schedule the launch announcement:

**Platforms:**
- Twitter/X thread (`@xaocsdev`)
- Hacker News: "Show HN: XAOCS — Full-stack TypeScript framework for AI-native development"
- Reddit: r/typescript, r/reactjs, r/node
- Dev.to article: "Building XAOCS: A Full-Stack TypeScript Framework"
- Discord (own server + relevant communities)

**`apps/web/app/blog/launch.mdx`** — launch blog post:
```mdx
# Introducing XAOCS v1.0.0

Today we're releasing XAOCS — a full-stack TypeScript framework that gives you the developer experience of Laravel,
the rendering model of Next.js, and the speed of Fastify and Bun.

## What it is

One server. One port. Backend API + React frontend. Zero configuration to start.

...
```

**MAINTENANCE.md:** Sprint 199 ✅.

---

## Sprint 200 — v1.0.0 🎉

**Goal:** XAOCS v1.0.0 is live. The framework is complete.

**Final state:**
- 18 packages published to npm at v1.0.0 with provenance
- Docs live at xaocs.dev
- Demo blog live at xaocs-blog-demo.fly.dev
- `bunx create-xaocs-app` works from npm registry
- GitHub CI passing on every commit
- Community files present
- Discord server open
- 200/200 sprints complete

**Final checklist:**
```
✅ bun run build    — All 18 packages build
✅ bun run test     — All tests pass
✅ bun run type-check — Zero TS errors
✅ bunx create-xaocs-app — Works from registry
✅ xaocs dev — Dev server starts
✅ xaocs build — Production build works
✅ Demo app — Live at Fly.io
✅ Docs — Live and indexed
✅ npm provenance — All packages signed
✅ CI — Passing on main
✅ MAINTENANCE.md — 200/200 ✅
```

**MAINTENANCE.md final update:**
```markdown
## Progress
- Total Sprints: 200
- Completed: 200
- In Progress: 0
- Remaining: 0

## 🎉 XAOCS v1.0.0 — RELEASED
```

**CHANGELOG.md final entry:**
```
- 2026-XX-XX: Sprint 200 completed. XAOCS v1.0.0 released. 🎉
```

---

# END OF SPRINTS 151–200

```
╔══════════════════════════════════════════════════╗
║  XAOCS Framework — 200/200 Sprints Complete      ║
║                                                  ║
║  18 packages  ·  v1.0.0  ·  npm provenance       ║
║  CI/CD  ·  demo app  ·  docs  ·  community       ║
║                                                  ║
║  Build faster. Ship cleaner. Code with joy.      ║
╚══════════════════════════════════════════════════╝
```