# XAOCS Maintenance Log

## Progress

- Total Sprints: 200
- Completed: 61
- In Progress: 0
- Remaining: 139

## Sprint Log

| # | Title | Status | Date | Notes |
|---|-------|--------|------|-------|
| 1 | Monorepo Audit | ✅ Done | 2026-05-13 | Inventory for apps/packages, turbo, Bun, and `@xaocs/*` namespace check. |
| 2 | TurboRepo Config | ✅ Done | 2026-05-13 | Root `turbo.json` tasks for build/dev/test/lint/type-check/clean. |
| 3 | Bun Workspace Setup | ✅ Done | 2026-05-13 | Workspaces `apps/*`, `packages/*`; root `bunfig.toml`. |
| 4 | Shared TS Config | ✅ Done | 2026-05-13 | `tsconfig.base.json` strict defaults for packages. |
| 5 | `@xaocs/shared` Init | ✅ Done | 2026-05-13 | Shared types including `PaginatedResult`. |
| 6 | `@xaocs/core` Init | ✅ Done | 2026-05-13 | Core package scaffold and exports. |
| 7 | IoC Container | ✅ Done | 2026-05-13 | `XContainer` bind/singleton/make/has/flush + tests. |
| 8 | Service Provider Base | ✅ Done | 2026-05-13 | `ServiceProvider`, `ProviderRegistry`. |
| 9 | Auto-Discovery | ✅ Done | 2026-05-13 | `discoverServices` with optional `static inject`. |
| 10 | Boot Lifecycle | ✅ Done | 2026-05-13 | `Application.boot` providers + services (+ middlewares, sprint 27). |
| 11 | `@xaocs/server` Init | ✅ Done | 2026-05-13 | Server package scaffold. |
| 12 | Fastify Integration | ✅ Done | 2026-05-13 | `XServer` Fastify wrapper. |
| 13 | XRequest / XResponse | ✅ Done | 2026-05-13 | `RequestAdapter` + tests. |
| 14 | Middleware Pipeline | ✅ Done | 2026-05-13 | `compose` + tests. |
| 15 | Global Middleware Reg | ✅ Done | 2026-05-13 | `globalMiddlewareRegistry`. |
| 16 | `@xaocs/config` Init | ✅ Done | 2026-05-13 | Config package + types. |
| 17 | Env Loading | ✅ Done | 2026-05-13 | `loadEnv`, `requireEnv` + tests. |
| 18 | `defineConfig` Helper | ✅ Done | 2026-05-13 | Typed defaults merge. |
| 19 | New API File Convention | ✅ Done | 2026-05-13 | `scanApiFiles` + `[id]` → `:id`. |
| 20 | Router Class | ✅ Done | 2026-05-13 | `XRouter` CRUD, `use`, `group`. |
| 21 | API Route Scanner | ✅ Done | 2026-05-13 | `mountApiRoutes` on Fastify with adapters + compose. |
| 22 | Dynamic Route Segments | ✅ Done | 2026-05-13 | Filename bracket segments in `ApiScanner`. |
| 23 | Route Middleware Attach | ✅ Done | 2026-05-13 | Per-route and `use` middleware on `XRouter`. |
| 24 | `app/` Folder Convention | ✅ Done | 2026-05-13 | `discoverMiddlewares` for `*.middleware.ts` in `app/middlewares/`. |
| 25 | Controller Base | ✅ Done | 2026-05-13 | `XController` JSON helpers. |
| 26 | Service Auto-Inject | ✅ Done | 2026-05-13 | `discoverServices` + `inject` array resolution. |
| 27 | Middleware Auto-Load | ✅ Done | 2026-05-13 | `Application.boot({ middlewaresDir })` + registry test. |
| 28 | `@xaocs/orm` Init | ✅ Done | 2026-05-13 | Package deps, exports, `bun test` / `tsc`. |
| 29 | DB Driver Config | ✅ Done | 2026-05-13 | `buildKnexConfig` mysql/postgres/sqlite + mongo guard. |
| 29.5 | MongoDB Integration | ✅ Done | 2026-05-14 | `initMongo`, `XMongoModel`, and Mongoose integration added. |
| 30 | Knex Connection | ✅ Done | 2026-05-13 | `initDb`, `getKnex`, `closeDb`. |
| 31 | `XModel` Base Class | ✅ Done | 2026-05-13 | `query`, soft-delete scope, Knex integration. |
| 32 | `XModel.find()` | ✅ Done | 2026-05-13 | `find`, `findOrFail` + 404 error. |
| 33 | `XModel.all()` | ✅ Done | 2026-05-13 | `all()` via scoped query. |
| 34 | `XModel.where()` | ✅ Done | 2026-05-13 | Column/value and object overloads. |
| 35 | `XModel.create()` | ✅ Done | 2026-05-13 | Timestamps on insert + id resolution. |
| 36 | `XModel.update()` | ✅ Done | 2026-05-13 | Static `update` + instance `save`. |
| 37 | `XModel.delete()` | ✅ Done | 2026-05-13 | Instance `delete`, static `destroy`. |
| 38 | `XModel.paginate()` | ✅ Done | 2026-05-13 | `PaginatedResult` shape from `@xaocs/shared`. |
| 39 | `XModel.with()` | ✅ Done | 2026-05-13 | `RelationScope` + `hasMany` hydration. |
| 40 | Relationship Decorators | ✅ Done | 2026-05-13 | `HasMany` / `BelongsTo` / `HasOne` / `BelongsToMany` + `registerRelation`. |
| 41 | `@Column` Decorator | ✅ Done | 2026-05-13 | `Column` + `registerColumnMeta`. |
| 42 | Hidden Fields | ✅ Done | 2026-05-13 | `toJSON` strips hidden columns. |
| 43 | Soft Deletes | ✅ Done | 2026-05-13 | `softDeletes`, `withTrashed`, scoped queries. |
| 44 | Migration System | ✅ Done | 2026-05-13 | `Migration` abstract class. |
| 45 | Migration Scanner | ✅ Done | 2026-05-13 | `MigrationRunner.run` + pending detection. |
| 46 | Migration Tracking | ✅ Done | 2026-05-13 | `xaocs_migrations` table + batch column. |
| 47 | Migration Rollback | ✅ Done | 2026-05-13 | `MigrationRunner.rollback`. |
| 48 | Migration Fresh | ✅ Done | 2026-05-13 | `MigrationRunner.fresh` (DB-specific table listing). |
| 49 | Schema Builder | ✅ Done | 2026-05-13 | `Schema` wraps `createTable` / `dropTable`. |
| 50 | Column Type Helpers | ✅ Done | 2026-05-13 | `id`, `xaocsTimestamps`, `xaocsSoftDeletes` on `XCreateTableBuilder`. |
| 51 | Seeder System | ✅ Done | 2026-05-14 | `Seeder` base class and `SeederRunner` implemented. |
| 52 | Seeder Scanner | ✅ Done | 2026-05-14 | Ordered seeder scanning and numeric-first sorting implemented. |
| 53 | Factory System | ✅ Done | 2026-05-14 | `Factory.times(n).create()` with Faker integration implemented. |
| 54 | `@xaocs/compiler` Init | ✅ Done | 2026-05-14 | `@xaocs/compiler` package scaffolded with Vite/esbuild. |
| 55 | Vite Dev Integration | ✅ Done | 2026-05-14 | mountViteDev middleware added to `@xaocs/server`. |
| 56 | View Scanner | ✅ Done | 2026-05-14 | `ViewScanner` implemented to map view files to URL routes. |
| 57 | Route Hydration | ✅ Done | 2026-05-14 | `mountViteDev` updated to inject View routes into Fastify. |
| 58 | Layout System | ✅ Done | 2026-05-14 | `resolveLayout` implemented to handle `views/layouts/main.tsx` convention. |
| 59 | Page Meta Export | ✅ Done | 2026-05-14 | `extractPageMeta` implemented to support `export const meta` in views. |
| 60 | SSR Opt-In | ✅ Done | 2026-05-14 | `renderSSR` helper and `ssr: true` opt-in handling in server. |

## Recent Changes

- ORM now supports MongoDB via Mongoose (Sprint 29.5).
- `initOrmFromEnv` auto-selects between Knex and Mongoose based on `DB_DRIVER`.
- ORM uses `sqlite3` Knex client for Windows compatibility in tests.
- Migration fixtures live under `packages/orm/test-fixtures/`.
- Sprint 51-53: Seeder system and Factory system implemented.
- Sprint 54-55: Compiler package and Vite dev integration.
- Sprint 56-57: View scanning and dynamic route hydration.
- Sprint 58-59: Layout resolution and page metadata extraction.
- Sprint 60: Server-side rendering (SSR) opt-in support via `renderSSR`.

## Known Issues

- Internal legacy packages still use `@repo/*`.
- `useDefineForClassFields: false` is required for ORM decorator compatibility.

## Next Up

- Sprint 61: esbuild Prod Build — Implementation of production bundle utilities.

## Sprint 1 Audit Inventory

### Applications (apps/*)

| Path | Package Name | Purpose |
|------|----------------|---------|
| apps/docs | docs | Documentation site (Next.js) |
| apps/web | web | Web application (Next.js) |

### Packages (packages/*)

| Path | Package Name | Notes |
|------|----------------|-------|
| packages/ui | @repo/ui | Shared UI components package |
| packages/eslint-config | @repo/eslint-config | Shared ESLint config package |
| packages/typescript-config | @repo/typescript-config | Shared TypeScript config package |
| packages/shared | @xaocs/shared | XAOCS shared types (`XRequest`, `PaginatedResult`, …) |
| packages/core | @xaocs/core | XAOCS core (container, boot, routing, middleware) |
| packages/config | @xaocs/config | XAOCS config loader and `defineConfig` |
| packages/server | @xaocs/server | Fastify integration and API mounting |
| packages/orm | @xaocs/orm | Knex-backed `XModel`, migrations, schema helpers |

### Workspace package.json inventory

| Path | Name |
|------|------|
| package.json | xacos |
| apps/docs/package.json | docs |
| apps/web/package.json | web |
| packages/ui/package.json | @repo/ui |
| packages/eslint-config/package.json | @repo/eslint-config |
| packages/typescript-config/package.json | @repo/typescript-config |
| packages/shared/package.json | @xaocs/shared |
| packages/core/package.json | @xaocs/core |
| packages/config/package.json | @xaocs/config |
| packages/server/package.json | @xaocs/server |
| packages/orm/package.json | @xaocs/orm |

### Turbo configuration snapshot

| File | Key Points |
|------|------------|
| turbo.json | `tasks` for build, lint, check-types, dev; outputs for Next.js and `dist/**`. |

### Namespace conflict check (`@xaocs/*`)

| Finding | Result |
|---------|--------|
| Existing `@xaocs/*` package names present | New XAOCS packages added alongside legacy `@repo/*`. |
| Direct naming collision with `@xaocs/*` | None for core/shared/config/server/orm. |
| Migration consideration | Existing internal namespace remains `@repo/*` for historical apps. |

### Bun/npm setup snapshot

| Finding | Result |
|---------|--------|
| Root package manager | `bun@1.3.12` |
| Workspaces configured | Yes (`apps/*`, `packages/*`) |
| lockfile detected | `bun.lock` |
| Node engine | `>=18` |
| npm/yarn lockfiles | Not detected in root |
