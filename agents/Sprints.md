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
11. **Package naming:** `@xaocs/<name>` for internal packages, `create-xaocs-app` for scaffolder.
12. **Exports:** Every package must have explicit `exports` field in `package.json`.
13. **No circular deps.** `@xaocs/core` depends on nothing internal. Everything else may depend on core.
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

## 📋 ALL 200 SPRINTS — ONE-LINE OVERVIEW

| # | Title | What It Does |
|---|-------|-------------|
| 1 | Monorepo Audit | Audit existing TurboRepo, map all existing packages/apps, document structure |
| 2 | TurboRepo Config | Set up `turbo.json` pipelines for build/dev/test across all packages |
| 3 | Bun Workspace Setup | Configure `package.json` workspaces + `bunfig.toml` for the monorepo |
| 4 | Shared TS Config | Create root `tsconfig.base.json` extended by all packages |
| 5 | `@xaocs/shared` Init | Stub shared types package — `XRequest`, `XResponse`, `XNext`, `XMiddleware` |
| 6 | `@xaocs/core` Init | Bootstrap core package with `package.json`, `tsconfig`, empty exports |
| 7 | IoC Container | Implement `XContainer` with `bind`, `singleton`, `make` methods |
| 8 | Service Provider Base | Implement `ServiceProvider` abstract class with `register` and `boot` |
| 9 | Auto-Discovery | Replace manual providers with filesystem auto-discovery of services |
| 10 | Boot Lifecycle | Implement ordered boot sequence: env → container → providers → routes → server |
| 11 | `@xaocs/server` Init | Bootstrap Fastify wrapper package |
| 12 | Fastify Integration | Wire Fastify into `@xaocs/server` with typed request/response wrappers |
| 13 | XRequest / XResponse | Extend Fastify types into XAOCS `XRequest` / `XResponse` abstractions |
| 14 | Middleware Pipeline | Implement koa-compose style middleware pipeline in core |
| 15 | Global Middleware Reg | Allow global middleware registration via `xaocs.config.ts` |
| 16 | `@xaocs/config` Init | Config loader — reads `xaocs.config.ts` and `.env` |
| 17 | Env Loading | Load `.env` via bun native + validate required keys |
| 18 | `defineConfig` Helper | Export `defineConfig()` typed helper for `xaocs.config.ts` |
| 19 | New API File Convention | Implement `*.api.ts` file scanner — `user.api.ts` → `/api/user/` prefix |
| 20 | Router Class | Implement `XRouter` with `.get()`, `.post()`, `.put()`, `.patch()`, `.delete()` |
| 21 | API Route Scanner | Scan `api/` dir for `*.api.ts` files, extract router, mount to Fastify |
| 22 | Dynamic Route Segments | Support `[id]` segments in api file names → `:id` params |
| 23 | Route Middleware Attach | Support `router.use(middleware)` and per-method middleware in api files |
| 24 | `app/` Folder Convention | Establish `app/controllers`, `app/services`, `app/middlewares` structure |
| 25 | Controller Base | Implement `XController` base class with request helpers |
| 26 | Service Auto-Inject | Auto-discover and register services in `app/services/` without manual wiring |
| 27 | Middleware Auto-Load | Auto-load middlewares from `app/middlewares/` into registry |
| 28 | `@xaocs/orm` Init | Bootstrap ORM package with `package.json` and Knex dependency |
| 29 | DB Driver Config | Support `mysql`, `postgres`, `sqlite`, `mongodb` via `DB_DRIVER` env |
| 30 | Knex Connection | Wire Knex with driver adapter based on config |
| 31 | `XModel` Base Class | Implement base `XModel` with static `table` and query builder |
| 32 | `XModel.find()` | Implement `find(id)` and `findOrFail(id)` |
| 33 | `XModel.all()` | Implement `all()` returning all rows |
| 34 | `XModel.where()` | Implement chainable `where()` builder |
| 35 | `XModel.create()` | Implement `create(data)` with auto timestamps |
| 36 | `XModel.update()` | Implement `update(data)` on instance and static |
| 37 | `XModel.delete()` | Implement `delete()` and `destroy(id)` |
| 38 | `XModel.paginate()` | Implement `paginate(page, perPage)` returning paginated result |
| 39 | `XModel.with()` | Implement eager loading via `with('relation')` |
| 40 | Relationship Decorators | Implement `@HasMany`, `@BelongsTo`, `@HasOne`, `@BelongsToMany` |
| 41 | `@Column` Decorator | Implement `@Column({ hidden, default })` decorator |
| 42 | Hidden Fields | Strip `@Column({ hidden: true })` fields from JSON output |
| 43 | Soft Deletes | Add `softDeletes()` support via `deleted_at` |
| 44 | Migration System | Implement `Migration` base class and migration runner |
| 45 | Migration Scanner | Scan `database/migrations/` and run pending ones in order |
| 46 | Migration Tracking | Create `xaocs_migrations` table to track ran migrations |
| 47 | Migration Rollback | Implement `migrate:rollback` — reverse last batch |
| 48 | Migration Fresh | Implement `migrate:fresh` — drop all + re-run |
| 49 | Schema Builder | Implement `Schema` class wrapping Knex schema builder |
| 50 | Column Type Helpers | Add all column helpers: `id()`, `string()`, `text()`, `timestamps()`, etc. |
| 51 | Seeder System | Implement `Seeder` base class and seeder runner |
| 52 | Seeder Scanner | Scan `database/seeders/` and run them in order |
| 53 | Factory System | Implement `Factory.times(n).create()` with Faker integration |
| 54 | `@xaocs/compiler` Init | Bootstrap compiler package for JSX/page bundling |
| 55 | Vite Dev Integration | Mount Vite dev server as middleware for HMR in dev mode |
| 56 | View Scanner | Scan `views/` directory and map files to frontend routes |
| 57 | Dynamic View Routes | Handle `[id].tsx` → `/users/:id` in view routing |
| 58 | Layout System | Implement `views/layouts/main.tsx` auto-wrapping with opt-out |
| 59 | Page Meta Export | Support `export const meta = { title, description }` per page |
| 60 | SSR Opt-In | Support `export const ssr = true` for server-side rendering |
| 61 | esbuild Prod Build | Implement production build via esbuild — per-page chunks |
| 62 | HTML Shell | Serve HTML shell with hydration script per page route |
| 63 | `@xaocs/client` Init | Bootstrap client package — React hooks and components |
| 64 | `useAuth` Hook | Implement `useAuth()` — reads JWT, fetches `/api/auth/me` |
| 65 | `XLink` Component | Implement `<XLink>` for client-side navigation without reload |
| 66 | `redirect()` Helper | Implement `redirect('/path')` for client redirects |
| 67 | `useXaocs` Hook | Implement `useXaocs()` — exposes params, searchParams |
| 68 | `@xaocs/auth` Init | Bootstrap auth package |
| 69 | Auth User Model | Ship default `User` model with all auth fields |
| 70 | Auth Migrations | Ship `001_users.ts` and `002_sessions.ts` migrations |
| 71 | `AuthService` | Implement `register()`, `login()`, `generateToken()` |
| 72 | JWT Middleware | Implement `authenticate` middleware — verify JWT, attach `req.user` |
| 73 | Auth API Routes | Ship `login.api.ts`, `register.api.ts`, `logout.api.ts`, `me.api.ts` |
| 74 | Auth Frontend Pages | Ship `views/auth/login.tsx` and `views/auth/register.tsx` |
| 75 | `@xaocs/cli` Init | Bootstrap CLI package entry point |
| 76 | CLI Entry Setup | Wire CLI using `bun` as runtime, `commander` for arg parsing |
| 77 | `xaocs dev` Command | Start dev server + Vite HMR |
| 78 | `xaocs build` Command | Run esbuild production build |
| 79 | `xaocs start` Command | Start production server |
| 80 | `xaocs migrate` Command | Run pending migrations |
| 81 | `xaocs migrate:rollback` | Rollback last batch |
| 82 | `xaocs migrate:fresh` | Drop + re-migrate |
| 83 | `xaocs migrate:status` | Show migration status table |
| 84 | `xaocs db:seed` Command | Run all seeders or specific seeder |
| 85 | `xaocs routes` Command | List all registered routes (API + view) |
| 86 | `xaocs tinker` Command | REPL with full app context |
| 87 | `xaocs info` Command | Print framework + env info |
| 88 | `xaocs add --model` | Generate model file scaffold |
| 89 | `xaocs add --middleware` | Generate middleware file scaffold |
| 90 | `xaocs add --service` | Generate service file scaffold |
| 91 | `xaocs make:migration` | Generate timestamped migration file |
| 92 | `xaocs make:seeder` | Generate seeder file |
| 93 | `xaocs add --api` | Generate new `*.api.ts` file with router scaffold |
| 94 | `xaocs add --controller` | Generate controller in `app/controllers/` |
| 95 | `create-xaocs-app` Init | Bootstrap scaffolding CLI package |
| 96 | Scaffold Base Project | Copy template into new dir — `app/`, `views/`, `config/`, `database/`, `api/` |
| 97 | Scaffold DB Prompt | Interactive DB picker: mysql/postgres/sqlite/mongodb |
| 98 | Scaffold Auth Option | Optional auth files included if user selects yes |
| 99 | Scaffold `.env.example` | Ship `.env.example` with all keys and comments |
| 100 | Scaffold `xaocs.config.ts` | Ship typed config file with sensible defaults |
| 101 | Scaffold `package.json` | Ship `package.json` with correct deps and bun scripts |
| 102 | Scaffold `tsconfig.json` | Ship strict `tsconfig.json` extending base |
| 103 | Scaffold Deps Install | Auto-run `bun install` after scaffold |
| 104 | Scaffold Initial Migrate | Auto-run `xaocs migrate` after scaffold if db configured |
| 105 | Scaffold README | Ship project-level `README.md` explaining the structure |
| 106 | Error Handling Core | Implement global error handler — catches thrown errors, sends JSON |
| 107 | Validation Layer | Integrate Zod — `req.validate(schema)` in route handlers |
| 108 | Request Body Parsing | Wire Fastify body parser for JSON and multipart |
| 109 | CORS Middleware | Ship `app/middlewares/cors.middleware.ts` |
| 110 | Rate Limit Middleware | Ship `app/middlewares/ratelimit.middleware.ts` |
| 111 | Logger Integration | Wire Pino (Fastify's built-in) with XAOCS log levels |
| 112 | `@xaocs/mail` Init | Bootstrap mail package |
| 113 | SMTP Driver | Implement SMTP mail sending via nodemailer |
| 114 | Mail Templates | Support HTML template strings + data interpolation |
| 115 | Mail Service | Ship `MailService` with `send({ to, subject, template, data })` |
| 116 | `@xaocs/cache` Init | Bootstrap cache package |
| 117 | Redis Driver | Connect Redis via `ioredis` |
| 118 | Memory Driver | In-memory cache fallback for dev |
| 119 | Cache Service | Ship `CacheService.get()`, `.set()`, `.forget()`, `.remember()` |
| 120 | `@xaocs/storage` Init | Bootstrap storage package |
| 121 | Local Storage Driver | Save files to `storage/` directory locally |
| 122 | S3 Driver | Implement S3 upload/download via AWS SDK v3 |
| 123 | Storage Service | Ship `StorageService.put()`, `.get()`, `.delete()`, `.url()` |
| 124 | File Upload Route Helper | `req.file()` helper to extract multipart upload in API routes |
| 125 | `@xaocs/queue` Init | Bootstrap queue package |
| 126 | Job Base Class | Implement `XJob` base class with `handle()` method |
| 127 | Queue Driver (Memory) | In-memory queue for dev — FIFO job execution |
| 128 | Queue Driver (Redis) | Redis-backed queue via BullMQ |
| 129 | Job Dispatch | `dispatch(new MyJob(data))` syntax |
| 130 | Queue Worker | CLI `xaocs queue:work` boots worker process |
| 131 | `@xaocs/events` Init | Bootstrap events package |
| 132 | WebSocket Setup | Wire Socket.IO to Fastify server |
| 133 | Event Emitter | `emit('event', data)` from server side |
| 134 | Client Subscribe | `useEvent('event', cb)` React hook in `@xaocs/client` |
| 135 | `@xaocs/testing` Init | Bootstrap testing utilities package |
| 136 | Test HTTP Client | Ship `testClient(app)` — makes fake HTTP requests in tests |
| 137 | Model Factories in Tests | Expose `Factory` for test data creation |
| 138 | DB Test Helpers | Transactions that auto-rollback per test |
| 139 | Middleware Test Helpers | `mockAuth(user)` to inject fake user in test requests |
| 140 | `@xaocs/validation` Init | Wrap Zod — ship `v.string()`, `v.object()`, etc. with XAOCS types |
| 141 | Route Validation | Attach schema to router: `router.get('/', { schema }, handler)` |
| 142 | Validation Error Format | Auto-format Zod errors into `{ field, message }` JSON |
| 143 | `@xaocs/ui` Init | Bootstrap UI component library package |
| 144 | Tailwind Setup | Configure Tailwind in `@xaocs/ui` with design tokens |
| 145 | Button Component | Ship `<Button>` with variants |
| 146 | Input Component | Ship `<Input>` with label and error state |
| 147 | Card Component | Ship `<Card>` component |
| 148 | Modal Component | Ship `<Modal>` with open/close state |
| 149 | Table Component | Ship `<Table>` with typed columns |
| 150 | Navbar Component | Ship `<Navbar>` used in layouts |
| 151 | Docs App Integration | Wire XAOCS docs into existing docs app in monorepo |
| 152 | Docs — Core Concepts | Write docs pages for IoC container, boot lifecycle |
| 153 | Docs — API Routes | Write docs for `*.api.ts` convention and `XRouter` |
| 154 | Docs — ORM | Write docs for XModel, queries, relationships |
| 155 | Docs — Migrations | Write docs for migration system and schema builder |
| 156 | Docs — Auth | Write docs for built-in auth, JWT, protect routes |
| 157 | Docs — Frontend | Write docs for views, layouts, SSR, `useAuth` |
| 158 | Docs — CLI | Write docs for all CLI commands |
| 159 | Docs — Packages | Write docs for mail, cache, storage, queue |
| 160 | Web App — Landing Page | Build XAOCS marketing landing page in existing web app |
| 161 | Web App — Feature Section | Add features section to landing page |
| 162 | Web App — Code Showcase | Add code examples section to landing page |
| 163 | Web App — Changelog Page | Pull `CHANGELOG.md` and render as web page |
| 164 | MongoDB Adapter | Implement MongoDB adapter for XModel via Mongoose |
| 165 | MongoDB Migrations | Stub migration system for MongoDB (index creation) |
| 166 | PostgreSQL Full Test | Full integration test for Postgres adapter |
| 167 | MySQL Full Test | Full integration test for MySQL adapter |
| 168 | SQLite Full Test | Full integration test for SQLite adapter |
| 169 | Multi-Layout Support | Support multiple layouts: `export const layout = 'admin'` |
| 170 | Page Transitions | Client-side page transition animations via `<XLink>` |
| 171 | Error Pages | Ship `views/404.tsx` and `views/500.tsx` defaults |
| 172 | Static File Serving | Serve `public/` directory as static assets |
| 173 | Cookie Helper | `req.cookies` + `res.setCookie()` wrappers |
| 174 | Session Support | Optional session middleware via signed cookies |
| 175 | Health Check Route | Auto-mount `GET /health` returning `{ status: 'ok', uptime }` |
| 176 | Graceful Shutdown | Handle `SIGTERM`/`SIGINT` — drain connections before exit |
| 177 | Environment Validation | Startup check for required env vars — fail fast with clear error |
| 178 | TypeScript Path Aliases | Configure `@app`, `@views`, `@api`, `@db` path aliases in tsconfig |
| 179 | Hot Reload (non-view) | Watch `api/` and `app/` for changes, restart routes without full restart |
| 180 | Source Maps | Enable source maps in dev for debugging |
| 181 | E2E Test Suite | Full end-to-end test: scaffold → migrate → API call → assert |
| 182 | Performance Baseline | Benchmark XAOCS vs bare Fastify — document results |
| 183 | Bundle Analysis | Analyze client bundle sizes per page, document report |
| 184 | Security Audit | Review JWT handling, bcrypt rounds, SQL injection protection |
| 185 | Rate Limit Hardening | Per-route configurable rate limits via router options |
| 186 | CORS Hardening | Whitelist origins via config, not wildcard in production |
| 187 | API Versioning | Support `v1.user.api.ts` → `/api/v1/user/` prefix |
| 188 | Pagination Helper | Ship `paginate(query, page, perPage)` util returning standard envelope |
| 189 | Response Envelope | Standard `{ success, data, error, meta }` response shape helper |
| 190 | `xaocs add --package` | CLI command to add official ecosystem packages interactively |
| 191 | NPM Publish Config | Set up `package.json` publish fields, `files`, `main`, `exports` for all packages |
| 192 | Changesets Setup | Integrate `changesets` for versioning and changelogs |
| 193 | GitHub Actions CI | CI pipeline: lint → type-check → test → build on every PR |
| 194 | NPM Publish Workflow | GitHub Actions release workflow — publish all packages to npm |
| 195 | Provenance & Signing | Add npm provenance for all published packages |
| 196 | `create-xaocs-app` Publish | Publish `create-xaocs-app` to npm, test `bunx create-xaocs-app` |
| 197 | Full Integration Demo | Build a complete demo app (blog) using only XAOCS conventions |
| 198 | Demo Deploy | Deploy demo app, link from docs and landing page |
| 199 | Community Prep | Add `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, issue templates |
| 200 | v1.0.0 Release | Tag v1.0.0, publish all packages, announce on xaocs.dev |

---

# SPRINTS 1–50 (Detailed)

---

## Sprint 1 — Monorepo Audit

**Goal:** Understand what already exists before writing a single line of new code.

**Steps:**
1. Run `find . -name "package.json" -not -path "*/node_modules/*"` and list all packages/apps.
2. Document in `MAINTENANCE.md`: existing apps, existing packages, existing turbo pipelines.
3. List any naming conflicts with `@xaocs/*` namespace.
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
"@xaocs" = { token = "" }
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

## Sprint 5 — `@xaocs/shared` Init

**Goal:** Create shared types package — used by all other packages. Zero runtime code, types only.

**Location:** `packages/shared/`

**`packages/shared/package.json`:**
```json
{
  "name": "@xaocs/shared",
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

## Sprint 6 — `@xaocs/core` Init

**Goal:** Scaffold `@xaocs/core` package structure.

**Location:** `packages/core/`

**`packages/core/package.json`:**
```json
{
  "name": "@xaocs/core",
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
    "@xaocs/shared": "workspace:*"
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

## Sprint 11 — `@xaocs/server` Init

**Goal:** Scaffold `@xaocs/server` package.

**Location:** `packages/server/`

**`packages/server/package.json`:**
```json
{
  "name": "@xaocs/server",
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
    "@xaocs/core": "workspace:*",
    "@xaocs/shared": "workspace:*",
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
import { XMiddleware } from '@xaocs/shared';

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

**Goal:** Implement XAOCS request/response wrappers that bridge Fastify ↔ `@xaocs/shared` types.

**`packages/server/src/adapters/RequestAdapter.ts`:**
```typescript
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { XRequest, XResponse, XApp } from '@xaocs/shared';

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
import type { XMiddleware, XRequest, XResponse } from '@xaocs/shared';

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

**Goal:** Allow registering global middleware via `xaocs.config.ts`.

**`packages/core/src/middleware/GlobalMiddlewareRegistry.ts`:**
```typescript
import type { XMiddleware } from '@xaocs/shared';

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

## Sprint 16 — `@xaocs/config` Init

**Goal:** Scaffold `@xaocs/config` package.

**Location:** `packages/config/`

**`packages/config/package.json`:**
```json
{
  "name": "@xaocs/config",
  "version": "0.0.1",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "@xaocs/shared": "workspace:*"
  }
}
```

**`packages/config/src/types.ts`:**
```typescript
import type { XMiddleware } from '@xaocs/shared';
import type { ServiceProvider } from '@xaocs/core';
import type { XContainer } from '@xaocs/core';

export interface XaocsConfig {
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
import type { XaocsConfig } from './types';

export function defineConfig(config: XaocsConfig): XaocsConfig {
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
import type { XMiddleware, XRequest, XResponse } from '@xaocs/shared';

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
import { XRouter } from '@xaocs/core';

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
import type { XApp } from '@xaocs/shared';
import { scanApiFiles } from '@xaocs/core';
import { adaptRequest, adaptResponse } from '../adapters/RequestAdapter';
import { compose } from '@xaocs/core';

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

**Structure created by `create-xaocs-app` scaffold:**
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
import type { XMiddleware } from '@xaocs/shared';

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
import type { XRequest, XResponse } from '@xaocs/shared';

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
import { XController } from '@xaocs/core';
import type { XRequest, XResponse } from '@xaocs/shared';

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
import type { XMiddleware } from '@xaocs/shared';

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

## Sprint 28 — `@xaocs/orm` Init

**Goal:** Scaffold ORM package.

**Location:** `packages/orm/`

**`packages/orm/package.json`:**
```json
{
  "name": "@xaocs/orm",
  "version": "0.0.1",
  "type": "module",
  "exports": {
    ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" }
  },
  "dependencies": {
    "@xaocs/shared": "workspace:*",
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
    Reflect.defineMetadata('xaocs:hasMany', { relatedModel, foreignKey }, target, propertyKey);
  };
}

// Similar for BelongsTo, HasOne, BelongsToMany
```

---

## Sprint 41 — `@Column` Decorator

```typescript
export function Column(options: { hidden?: boolean; default?: unknown } = {}) {
  return function (target: object, propertyKey: string) {
    Reflect.defineMetadata('xaocs:column', options, target, propertyKey);
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
    const meta = Reflect.getMetadata('xaocs:column', proto, key);
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
    // Compare against xaocs_migrations table
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

Create `xaocs_migrations` table on first run:
```typescript
await db.schema.createTableIfNotExists('xaocs_migrations', t => {
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
  const lastBatch = await db('xaocs_migrations').max('batch as b').first();
  const toRollback = await db('xaocs_migrations').where('batch', lastBatch!.b);
  for (const row of toRollback.reverse()) {
    const mod = await import(resolve(migrationsDir, row.name));
    await new mod.default().down(new Schema());
    await db('xaocs_migrations').where('name', row.name).delete();
  }
}
```

---

## Sprint 48 — Migration Fresh

```typescript
async fresh(): Promise<void> {
  // Drop all tables except xaocs_migrations
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
   * Called by the SeederRunner when `xaocs db:seed` is invoked.
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
import { Seeder } from '@xaocs/orm';
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
import { Factory } from '@xaocs/orm';

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

## Sprint 54 — `@xaocs/compiler` Init

**Goal:** Scaffold the `@xaocs/compiler` package — responsible for all JSX/TSX bundling, both dev (Vite) and production (esbuild).

**Location:** `packages/compiler/`

**`packages/compiler/package.json`:**
```json
{
  "name": "@xaocs/compiler",
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
    "@xaocs/config": "workspace:*",
    "@xaocs/shared": "workspace:*",
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
      outDir: resolve('./.xaocs/client'),
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
import { createViteConfig } from '@xaocs/compiler';
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

**Usage in dev boot sequence (Sprint 77 wires this into `xaocs dev`):**
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
import { scanViews } from '@xaocs/compiler';
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
  <script type="module" src="/__xaocs/entry.js"></script>
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

**Note:** In dev mode (Sprint 55), Vite intercepts before Fastify reaches these handlers. In production, esbuild chunks replace `/__xaocs/entry.js` (Sprint 62).

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

**Default layout template (shipped by `create-xaocs-app` in Sprint 96):**
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

**Goal:** Implement production build via esbuild — generates one JS chunk per page into `.xaocs/client/`.

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

**Usage (called by `xaocs build` in Sprint 78):**
```typescript
import { buildProduction } from '@xaocs/compiler';

await buildProduction('./views', './.xaocs/client', process.cwd());
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
  chunkUrl: string;     // e.g. /__xaocs/index.js
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
const chunkUrl = `/__xaocs/${chunkName}.js`;
reply.send(buildHtmlShell({ chunkUrl, meta }));
```

**Serve `.xaocs/client/` as static files** (in production only):
```typescript
// In XServer, production boot:
fastify.register(import('@fastify/static'), {
  root: resolve('.xaocs/client'),
  prefix: '/__xaocs/',
});
```

**MAINTENANCE.md update:** Sprint 62 ✅.
**Done when:** Production `GET /` serves HTML with `<script src="/__xaocs/index.js">`.

---

## Sprint 63 — `@xaocs/client` Init

**Goal:** Scaffold the `@xaocs/client` package — React hooks and navigation components for XAOCS pages.

**Location:** `packages/client/`

**`packages/client/package.json`:**
```json
{
  "name": "@xaocs/client",
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
    "@xaocs/shared": "workspace:*",
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
export { XLink } from './navigation/XLink';
export { redirect } from './navigation/redirect';
export { useAuth } from './hooks/useAuth';
export { useXaocs } from './hooks/useXaocs';
export { useEvent } from './hooks/useEvent';
export { XaocsProvider } from './context/XaocsProvider';
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

**Goal:** Implement `useAuth()` — reads JWT from localStorage, fetches `/api/auth/me`, exposes `{ user, loading, logout }`.

**`packages/client/src/context/XaocsProvider.tsx`:**
```typescript
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { XUser } from '@xaocs/shared';

interface XaocsContextValue {
  user: XUser | null;
  loading: boolean;
  token: string | null;
  setUser: (user: XUser | null) => void;
  setToken: (token: string | null) => void;
}

const XaocsContext = createContext<XaocsContextValue | null>(null);

export function XaocsProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<XUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('xaocs_token');
    if (stored) setToken(stored);
    setLoading(false);
  }, []);

  return (
    <XaocsContext.Provider value={{ user, loading, token, setUser, setToken }}>
      {children}
    </XaocsContext.Provider>
  );
}

export function useXaocsContext(): XaocsContextValue {
  const ctx = useContext(XaocsContext);
  if (!ctx) throw new Error('[XAOCS] useXaocsContext must be used inside <XaocsProvider>');
  return ctx;
}
```

**`packages/client/src/hooks/useAuth.ts`:**
```typescript
import { useState, useEffect, useCallback } from 'react';
import type { XUser } from '@xaocs/shared';

interface UseAuthResult {
  user: XUser | null;
  loading: boolean;
  logout: () => void;
  login: (token: string) => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<XUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        localStorage.removeItem('xaocs_token');
        setUser(null);
        return;
      }
      const data = await res.json() as { user: XUser };
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('xaocs_token');
    if (token) {
      void fetchMe(token);
    } else {
      setLoading(false);
    }
  }, [fetchMe]);

  const login = useCallback(async (token: string) => {
    localStorage.setItem('xaocs_token', token);
    setLoading(true);
    await fetchMe(token);
  }, [fetchMe]);

  const logout = useCallback(() => {
    localStorage.removeItem('xaocs_token');
    setUser(null);
  }, []);

  return { user, loading, logout, login };
}
```

**Usage in a page:**
```tsx
import { useAuth } from '@xaocs/client';

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
**Done when:** `useAuth()` compiles, reads token from localStorage, fetches `/api/auth/me`.

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
import { XLink, redirect } from '@xaocs/client';

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
  readonly __xaocs_redirect = true;
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

**Export from `@xaocs/shared`.**

**MAINTENANCE.md update:** Sprint 66 ✅.
**Done when:** `serverRedirect('/login')` throws `XRedirect`. Client `redirect()` works from Sprint 65.

---

## Sprint 67 — `useXaocs` Hook

**Goal:** Implement `useXaocs()` — exposes `params` and `searchParams` from the current URL.

**`packages/client/src/hooks/useXaocs.ts`:**
```typescript
import { useState, useEffect } from 'react';

interface XaocsRouteInfo {
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
export function useXaocs(): XaocsRouteInfo {
  const [info, setInfo] = useState<XaocsRouteInfo>(() => extractRouteInfo());

  useEffect(() => {
    const handler = () => setInfo(extractRouteInfo());
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  return info;
}

function extractRouteInfo(): XaocsRouteInfo {
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
**Done when:** `useXaocs()` returns correct `params` and `searchParams` from the current URL.

---

## Sprint 68 — `@xaocs/auth` Init

**Goal:** Scaffold the `@xaocs/auth` package — built-in email/password authentication.

**Location:** `packages/auth/`

**`packages/auth/package.json`:**
```json
{
  "name": "@xaocs/auth",
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
    "@xaocs/core": "workspace:*",
    "@xaocs/orm": "workspace:*",
    "@xaocs/shared": "workspace:*",
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
import { XModel, Column } from '@xaocs/orm';

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

**Note:** This `User` model is what `create-xaocs-app` copies into the user's `database/models/User.ts` when auth is selected. It can be customized freely after scaffolding.

**MAINTENANCE.md update:** Sprint 69 ✅.
**Done when:** `User` model compiles. `password` is excluded from JSON via `@Column({ hidden: true })`.

---

## Sprint 70 — Auth Migrations

**Goal:** Ship `001_create_users_table.ts` and `002_create_sessions_table.ts` migration files inside `@xaocs/auth`. These get copied to the user's `database/migrations/` by the scaffolder.

**`packages/auth/src/migrations/001_create_users_table.ts`:**
```typescript
import { Migration, Schema } from '@xaocs/orm';

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
import { Migration, Schema } from '@xaocs/orm';

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
import { requireEnv } from '@xaocs/config';

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
import type { XMiddleware, XRequest, XResponse, XNext } from '@xaocs/shared';
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
import { XRouter } from '@xaocs/core';
import { authenticate, authorizeAdmin } from '@xaocs/auth';

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

**Goal:** Ship the four auth API route files that `create-xaocs-app` copies into the user's `api/` directory.

**`packages/auth/src/routes/auth.register.api.ts`:**
```typescript
import { XRouter } from '@xaocs/core';
import { authService } from '../services/AuthService';

export const router = new XRouter();

// POST /api/auth/register
router.post('/', async (req, res) => {
  const body = req.body as { name?: string; email?: string; password?: string };

  if (!body.name || !body.email || !body.password) {
    return res.status(400).json({ success: false, error: 'name, email, and password are required' });
  }

  const { user, token } = await authService.register({
    name: body.name,
    email: body.email,
    password: body.password,
  });

  return res.status(201).json({ success: true, token, user });
});
```

**`packages/auth/src/routes/auth.login.api.ts`:**
```typescript
import { XRouter } from '@xaocs/core';
import { authService } from '../services/AuthService';

export const router = new XRouter();

// POST /api/auth/login
router.post('/', async (req, res) => {
  const body = req.body as { email?: string; password?: string };

  if (!body.email || !body.password) {
    return res.status(400).json({ success: false, error: 'email and password are required' });
  }

  const { user, token } = await authService.login(body.email, body.password);
  return res.json({ success: true, token, user });
});
```

**`packages/auth/src/routes/auth.logout.api.ts`:**
```typescript
import { XRouter } from '@xaocs/core';
import { authenticate } from '../middlewares/authenticate';

export const router = new XRouter();

// POST /api/auth/logout (protected)
router.post('/', authenticate, async (_req, res) => {
  // JWT is stateless — client should discard the token.
  // For session-based logout, delete from sessions table here.
  return res.json({ success: true, message: 'Logged out' });
});
```

**`packages/auth/src/routes/auth.me.api.ts`:**
```typescript
import { XRouter } from '@xaocs/core';
import { authenticate } from '../middlewares/authenticate';

export const router = new XRouter();

// GET /api/auth/me (protected)
router.get('/', authenticate, async (req, res) => {
  return res.json({ success: true, user: req.user });
});
```

**File naming convention in user's project:**
```
api/
├── auth.register.api.ts   → POST /api/auth/register
├── auth.login.api.ts      → POST /api/auth/login
├── auth.logout.api.ts     → POST /api/auth/logout
└── auth.me.api.ts         → GET  /api/auth/me
```

**MAINTENANCE.md update:** Sprint 73 ✅.
**Done when:** All four routes compile. `POST /api/auth/login` returns `{ token }`.

---

## Sprint 74 — Auth Frontend Pages

**Goal:** Ship default login and register React pages that `create-xaocs-app` copies into `views/auth/`.

**`packages/auth/src/views/auth.login.tsx`:**
```tsx
import React, { useState, type FormEvent } from 'react';
import { redirect } from '@xaocs/client';
import { useAuth } from '@xaocs/client';

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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json() as { success: boolean; token?: string; error?: string };

      if (!data.success || !data.token) {
        setError(data.error ?? 'Login failed');
        return;
      }

      await login(data.token);
      redirect('/dashboard');
    } catch {
      setError('Network error — please try again');
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
import { redirect } from '@xaocs/client';
import { useAuth } from '@xaocs/client';

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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json() as { success: boolean; token?: string; error?: string };

      if (!data.success || !data.token) {
        setError(data.error ?? 'Registration failed');
        return;
      }

      await login(data.token);
      redirect('/dashboard');
    } catch {
      setError('Network error — please try again');
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
**Done when:** Both pages compile. Login calls `/api/auth/login`, stores token, redirects.

---

## Sprint 75 — `@xaocs/cli` Init

**Goal:** Scaffold the `@xaocs/cli` package entry point.

**Location:** `packages/cli/`

**`packages/cli/package.json`:**
```json
{
  "name": "@xaocs/cli",
  "version": "0.0.1",
  "type": "module",
  "bin": {
    "xaocs": "./dist/bin/xaocs.js"
  },
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "@xaocs/config": "workspace:*",
    "@xaocs/compiler": "workspace:*",
    "@xaocs/orm": "workspace:*",
    "@xaocs/server": "workspace:*",
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

**`packages/cli/src/bin/xaocs.ts`:**
```typescript
#!/usr/bin/env bun
import { program } from 'commander';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read version from package.json
const pkg = JSON.parse(readFileSync(resolve(import.meta.dir, '../../package.json'), 'utf-8')) as { version: string };

program
  .name('xaocs')
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
import type { XaocsConfig } from '@xaocs/config';
import { loadEnv } from '@xaocs/config';

export async function loadProjectConfig(): Promise<XaocsConfig> {
  // Always load .env first
  loadEnv(resolve(process.cwd(), '.env'));

  const configPath = resolve(process.cwd(), 'xaocs.config.ts');
  if (!existsSync(configPath)) {
    throw new Error(
      '[XAOCS CLI] xaocs.config.ts not found. Are you in an XAOCS project root?'
    );
  }

  const mod = await import(configPath) as { default: XaocsConfig };
  return mod.default;
}
```

**MAINTENANCE.md update:** Sprint 76 ✅.
**Done when:** `xaocs --help` prints usage. Logger and config loader work.

---

## Sprint 77 — `xaocs dev` Command

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
      const { XServer } = await import('@xaocs/server');
      const { mountApiRoutes } = await import('@xaocs/server');
      const { mountViewRoutes } = await import('@xaocs/server');
      const { mountViteDev } = await import('@xaocs/server');

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
**Done when:** `xaocs dev` starts the server, API routes respond, Vite serves pages with HMR.

---

## Sprint 78 — `xaocs build` Command

**Goal:** Run esbuild production build for all pages.

**`packages/cli/src/commands/build.ts`:**
```typescript
import { program } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';
import { buildProduction } from '@xaocs/compiler';
import ora from 'ora';

program
  .command('build')
  .description('Build for production')
  .option('--out <dir>', 'Output directory', '.xaocs/client')
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
**Done when:** `xaocs build` creates chunks in `.xaocs/client/` and reports sizes.

---

## Sprint 79 — `xaocs start` Command

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

      const { XServer } = await import('@xaocs/server');
      const { mountApiRoutes, mountViewRoutes, serveStaticChunks } = await import('@xaocs/server');

      const server = new XServer();
      const app = server.getApp();

      await serveStaticChunks(server.fastify, '.xaocs/client');
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
    prefix: '/__xaocs/',
  });
}
```

**MAINTENANCE.md update:** Sprint 79 ✅.
**Done when:** `xaocs start` serves the production build with API routes working.

---

## Sprint 80 — `xaocs migrate` Command

**Goal:** Run all pending database migrations.

**`packages/cli/src/commands/migrate.ts`:**
```typescript
import { program } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';
import { MigrationRunner } from '@xaocs/orm';
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
  const ran = await getKnex()('xaocs_migrations').select('name', 'batch');
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
**Done when:** `xaocs migrate`, `xaocs migrate rollback`, `xaocs migrate fresh`, `xaocs migrate status` all work.

---

## Sprint 81–82 — Already covered in Sprint 80

Rollback and fresh are subcommands of `migrate` (implemented above). Sprints 81 and 82 are therefore:

**Sprint 81 — `xaocs migrate:rollback`** — ✅ implemented as `xaocs migrate rollback` in Sprint 80.
**Sprint 82 — `xaocs migrate:fresh`** — ✅ implemented as `xaocs migrate fresh` in Sprint 80.

Both update `MAINTENANCE.md` accordingly.

---

## Sprint 83 — `xaocs migrate:status`

✅ Implemented as `xaocs migrate status` in Sprint 80. Mark ✅ in `MAINTENANCE.md`.

---

## Sprint 84 — `xaocs db:seed` Command

**Goal:** Run all seeders or a specific seeder.

**`packages/cli/src/commands/seed.ts`:**
```typescript
import { program } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';
import { SeederRunner } from '@xaocs/orm';
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
**Done when:** `xaocs db:seed` runs all seeders. `xaocs db:seed --seeder UserSeeder` runs one.

---

## Sprint 85 — `xaocs routes` Command

**Goal:** List all registered routes (API + view) in a formatted table.

**`packages/cli/src/commands/routes.ts`:**
```typescript
import { program } from 'commander';
import { log } from '../utils/logger';
import { loadProjectConfig } from '../utils/loadConfig';
import { scanApiFiles } from '@xaocs/core';
import { scanViews } from '@xaocs/compiler';
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
**Done when:** `xaocs routes` prints all API and view routes.

---

## Sprint 86 — `xaocs tinker` Command

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
      const { application } = await import('@xaocs/core');
      await application.boot({
        servicesDir: './app/services',
        middlewaresDir: './app/middlewares',
      });

      // Start REPL
      const server = repl.start({ prompt: 'xaocs> ' });

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
**Done when:** `xaocs tinker` opens REPL. `await User.all()` returns data. `app.make('UserService')` works.

---

## Sprint 87 — `xaocs info` Command

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
      console.log(chalk.yellow('  ⚠ Could not load xaocs.config.ts'));
    }

    console.log('─'.repeat(40) + '\n');
  });
```

**MAINTENANCE.md update:** Sprint 87 ✅.
**Done when:** `xaocs info` prints a clean info table.

---

## Sprint 88–94 — Code Generators

**Goal:** Implement all `xaocs add` and `xaocs make` commands.

**`packages/cli/src/commands/add.ts`:**

All generators follow the same pattern:
1. Prompt for name (or take from CLI arg)
2. Check if file already exists (refuse to overwrite)
3. Write scaffolded file from template
4. Log success with file path

```typescript
import { program } from 'commander';
import { log } from '../utils/logger';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';

const add = program.command('add').description('Generate XAOCS files');

// ─── xaocs add --model <Name> ─────────────────────────────────────────────
add
  .command('model <name>')
  .alias('--model')
  .description('Generate a new XModel')
  .action((name: string) => {
    const path = resolve(`./database/models/${name}.ts`);
    guard(path, name);
    writeFileSync(path, modelTemplate(name));
    log.success(`Model created: database/models/${name}.ts`);
  });

// ─── xaocs add --middleware <name> ────────────────────────────────────────
add
  .command('middleware <name>')
  .description('Generate a new middleware')
  .action((name: string) => {
    const path = resolve(`./app/middlewares/${name}.middleware.ts`);
    guard(path, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, middlewareTemplate(name));
    log.success(`Middleware created: app/middlewares/${name}.middleware.ts`);
  });

// ─── xaocs add --service <name> ───────────────────────────────────────────
add
  .command('service <name>')
  .description('Generate a new service')
  .action((name: string) => {
    const path = resolve(`./app/services/${name}Service.ts`);
    guard(path, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, serviceTemplate(name));
    log.success(`Service created: app/services/${name}Service.ts`);
  });

// ─── xaocs add --controller <name> ────────────────────────────────────────
add
  .command('controller <name>')
  .description('Generate a new controller')
  .action((name: string) => {
    const path = resolve(`./app/controllers/${name}Controller.ts`);
    guard(path, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, controllerTemplate(name));
    log.success(`Controller created: app/controllers/${name}Controller.ts`);
  });

// ─── xaocs add --api <name> ───────────────────────────────────────────────
add
  .command('api <name>')
  .description('Generate a new *.api.ts route file')
  .action((name: string) => {
    const path = resolve(`./api/${name}.api.ts`);
    guard(path, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, apiTemplate(name));
    log.success(`API route created: api/${name}.api.ts`);
    log.info(`Routes available at: /api/${name}/`);
  });

// ─── Helpers ──────────────────────────────────────────────────────────────

function guard(path: string, name: string) {
  if (existsSync(path)) {
    log.error(`File already exists: ${path}`);
    process.exit(1);
  }
  mkdirSync(dirname(path), { recursive: true });
}

function modelTemplate(name: string): string {
  return `import { XModel, Column } from '@xaocs/orm';

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
  return `import type { XMiddleware } from '@xaocs/shared';

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
  return `import { XController } from '@xaocs/core';
import type { XRequest, XResponse } from '@xaocs/shared';

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
  return `import { XRouter } from '@xaocs/core';
// import { authenticate } from '@xaocs/auth';
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

**`packages/cli/src/commands/make.ts`:**
```typescript
import { program } from 'commander';
import { log } from '../utils/logger';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';

const make = program.command('make').description('Generate database files');

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

make
  .command('seeder <name>')
  .description('Generate a new seeder file')
  .action((name: string) => {
    const path = resolve(`./database/seeders/${name}.ts`);
    if (existsSync(path)) { log.error(`Already exists: ${path}`); process.exit(1); }
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, seederTemplate(name));
    log.success(`Seeder created: database/seeders/${name}.ts`);
  });

function migrationTemplate(name: string): string {
  return `import { Migration, Schema } from '@xaocs/orm';

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
  return `import { Seeder } from '@xaocs/orm';

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

**Covers Sprints 88, 89, 90, 91, 92, 93, 94.**
**MAINTENANCE.md update:** Mark Sprints 88–94 ✅.

---

## Sprint 95 — `create-xaocs-app` Init

**Goal:** Scaffold the `create-xaocs-app` package — the project bootstrapper.

**Location:** `packages/create-xaocs-app/`

**`packages/create-xaocs-app/package.json`:**
```json
{
  "name": "create-xaocs-app",
  "version": "0.0.1",
  "type": "module",
  "bin": {
    "create-xaocs-app": "./dist/bin/create.js"
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

**`packages/create-xaocs-app/src/bin/create.ts`:**
```typescript
#!/usr/bin/env bun
import { program } from 'commander';

program
  .name('create-xaocs-app')
  .description('Create a new XAOCS application')
  .argument('[project-name]', 'Name of the project')
  .action(async (projectName?: string) => {
    const { scaffold } = await import('../scaffold');
    await scaffold(projectName);
  });

program.parse(process.argv);
```

**MAINTENANCE.md update:** Sprint 95 ✅.
**Done when:** Package scaffolded, `bunx create-xaocs-app` runs without error.

---

## Sprint 96–105 — Scaffold Implementation

These sprints implement the full `create-xaocs-app` scaffold. They all live in `packages/create-xaocs-app/src/scaffold.ts` and the `templates/` directory.

**`packages/create-xaocs-app/src/scaffold.ts`:**
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
      initial: 'my-xaocs-app',
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
  console.log(`  ${chalk.cyan('xaocs migrate')}`);
  console.log(`  ${chalk.cyan('xaocs dev')}\n`);
}
```

**Sprints 96–105** each write one category of template files. The key files written:

**Sprint 96 — Base project structure** (dirs + gitignore)
**Sprint 97 — DB prompt + `.env` generation per driver**
**Sprint 98 — Auth files copied from `@xaocs/auth/src/` when `includeAuth = true`**
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

**Sprint 100 — `xaocs.config.ts`:**
```typescript
import { defineConfig } from '@xaocs/config';

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
    "dev": "xaocs dev",
    "build": "xaocs build",
    "start": "xaocs start",
    "migrate": "xaocs migrate",
    "seed": "xaocs db:seed"
  },
  "dependencies": {
    "@xaocs/auth": "latest",
    "@xaocs/client": "latest",
    "@xaocs/core": "latest",
    "@xaocs/orm": "latest",
    "react": "^18.x",
    "react-dom": "^18.x"
  },
  "devDependencies": {
    "@xaocs/cli": "latest",
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
  "exclude": ["node_modules", ".xaocs"]
}
```

**Sprint 103 — Auto-run `bun install`** — already in `scaffold.ts` above.

**Sprint 104 — Auto-run `xaocs migrate`** after install:
```typescript
if (dbDriver === 'sqlite') {
  const migrateSpinner = ora('Running initial migrations…').start();
  try {
    execSync('bun run xaocs migrate', { cwd: projectDir, stdio: 'pipe' });
    migrateSpinner.succeed('Database migrated');
  } catch {
    migrateSpinner.warn('Migration skipped — run `xaocs migrate` manually');
  }
}
```

**Sprint 105 — Project README:**
```markdown
# {{projectName}}

Built with [XAOCS](https://xaocs.dev) — a full-stack TypeScript framework.

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
xaocs dev              # Start dev server with HMR
xaocs build            # Production build
xaocs start            # Start production server
xaocs migrate          # Run pending migrations
xaocs db:seed          # Seed the database
xaocs routes           # List all routes
xaocs tinker           # Interactive REPL
```

**MAINTENANCE.md update:** Mark Sprints 96–105 ✅.
**Done when:** `bunx create-xaocs-app my-app` creates a full working project directory.

---

# END OF SPRINTS 51–100

> Run `bun run build` from root. All packages must compile with zero errors.
> Update `MAINTENANCE.md`: mark sprints 51–100 as ✅. Total completed: 100.
> **Progress: 100/200 sprints complete. Halfway there.**


