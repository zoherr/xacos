# XAOCS Changelog

- 2026-05-13: Sprint 1 completed (Monorepo audit and baseline inventory documented).
- 2026-05-13: Sprint 2 completed (Turbo task graph expanded with test/type-check/clean and global env dependency).
- 2026-05-13: Sprint 3 completed (Bun workspace setup finalized with root bunfig configuration and install verification).
- 2026-05-13: Sprint 4 completed (root strict TypeScript base config established for new XAOCS packages).
- 2026-05-13: Sprint 5 completed (`@xaocs/shared` package initialized with core framework shared types and explicit exports).
- 2026-05-13: Sprint 6 completed (`@xaocs/core` package scaffolded with strict TS build/test scripts and explicit exports).
- 2026-05-13: Sprint 7 completed (IoC `XContainer` implemented with singleton support and test coverage).
- 2026-05-13: Sprint 8 completed (service provider abstraction and provider registry implemented).
- 2026-05-13: Sprint 9 completed (service auto-discovery implemented with optional static inject support).
- 2026-05-13: Sprint 10 completed (application boot lifecycle implemented with provider and service discovery boot test).
- 2026-05-13: Sprint 11 completed (`@xaocs/server` package initialized with strict TS scripts and explicit exports).
- 2026-05-13: Sprint 12 completed (Fastify integration added via `XServer` wrapper with global middleware registration hooks).
- 2026-05-13: Sprint 13 completed (typed `XRequest`/`XResponse` Fastify adapters implemented and tested).
- 2026-05-13: Sprint 14 completed (koa-compose style middleware pipeline implemented in core with ordered execution test).
- 2026-05-13: Sprint 15 completed (global middleware registry implemented and exported for config-driven registration).
- 2026-05-13: Sprint 16 completed (`@xaocs/config` package initialized with strict TS setup and exports).
- 2026-05-13: Sprint 17 completed (environment loading and required env validation helpers implemented with tests).
- 2026-05-13: Sprint 18 completed (typed `defineConfig()` helper implemented for `xaocs.config.ts`).
- 2026-05-13: Sprint 19 completed (`*.api.ts` scanner implemented for filename-derived API prefixes with dynamic segment support).
- 2026-05-13: Sprint 20 completed (`XRouter` implemented with CRUD route methods, grouping, and middleware support).
- 2026-05-13: Sprint 21 completed (`mountApiRoutes` wires scanned `*.api.ts` routers onto Fastify with compose middleware).
- 2026-05-13: Sprint 22 completed (API filename `[param]` segments mapped to `:param` in URL prefixes).
- 2026-05-13: Sprint 23 completed (`XRouter.group` and per-route middleware chaining validated for API files).
- 2026-05-13: Sprint 24 completed (`discoverMiddlewares` loads `*.middleware.ts` from `app/middlewares/` convention).
- 2026-05-13: Sprint 25 completed (`XController` response helpers implemented and exported from core).
- 2026-05-13: Sprint 26 completed (service discovery supports `static inject` constructor resolution via `XContainer`).
- 2026-05-13: Sprint 27 completed (application boot loads middlewares into `middlewareRegistry` when `middlewaresDir` is set).
- 2026-05-13: Sprint 28 completed (`@xaocs/orm` package scaffolded with Knex, sqlite3 client, strict TS, and tests).
- 2026-05-13: Sprint 29 completed (`buildKnexConfig` supports mysql, postgres, sqlite, and rejects unsupported mongodb via Knex).
- 2026-05-14: Sprint 29.5 completed (MongoDB support implemented via Mongoose and `initMongo`).

- 2026-05-13: Sprint 30 completed (`initDb` / `getKnex` / `closeDb` singleton connection lifecycle for the ORM).
- 2026-05-13: Sprint 31 completed (`XModel` static query entry, soft-delete scope, and Knex-backed persistence).
- 2026-05-13: Sprint 32 completed (`XModel.find` / `findOrFail` with 404 `statusCode` on missing rows).
- 2026-05-13: Sprint 33 completed (`XModel.all` lists rows respecting global query scopes).
- 2026-05-13: Sprint 34 completed (`XModel.where` overloads for column/value and criteria objects).
- 2026-05-13: Sprint 35 completed (`XModel.create` inserts default `created_at` / `updated_at` timestamps).
- 2026-05-13: Sprint 36 completed (`XModel.update` and instance `save` persist changes with `updated_at`).
- 2026-05-13: Sprint 37 completed (instance `delete` and static `destroy` support hard and soft delete modes).
- 2026-05-13: Sprint 38 completed (`XModel.paginate` returns `PaginatedResult` compatible with `@xaocs/shared`).
- 2026-05-13: Sprint 39 completed (`XModel.with` / `RelationScope` eager-loads declared `hasMany` metadata).
- 2026-05-13: Sprint 40 completed (relationship decorators plus `registerRelation` escape hatch for strict runtimes).
- 2026-05-13: Sprint 41 completed (`@Column` decorator and `registerColumnMeta` for field metadata).
- 2026-05-13: Sprint 42 completed (`XModel.toJSON` strips `@Column({ hidden: true })` fields).
- 2026-05-13: Sprint 43 completed (`static softDeletes`, scoped queries, `withTrashed`, and soft `delete`).
- 2026-05-13: Sprint 44 completed (`Migration` abstract class with `up`/`down` using `Schema` wrapper).
- 2026-05-13: Sprint 45 completed (`MigrationRunner` scans directories, orders files, and executes pending migrations).
- 2026-05-13: Sprint 46 completed (`xaocs_migrations` ledger table created before batches are recorded).
- 2026-05-13: Sprint 47 completed (`migrate:rollback` equivalent via `MigrationRunner.rollback` for the last batch).
- 2026-05-13: Sprint 48 completed (`MigrationRunner.fresh` drops user tables and reapplies migrations).
- 2026-05-13: Sprint 49 completed (`Schema` wraps Knex schema builder for migration classes).
- 2026-05-13: Sprint 50 completed (`columnHelpers` adds `id`, `xaocsTimestamps`, and `xaocsSoftDeletes` table helpers).
- 2026-05-14: Sprint 51 completed (Seeder base class and SeederRunner implemented).
- 2026-05-14: Sprint 52 completed (Ordered seeder scanning and numeric-first sorting implemented).
- 2026-05-14: Sprint 53 completed (Factory system with Faker integration implemented).
- 2026-05-14: Sprint 54 completed (@xaocs/compiler package initialized with Vite and esbuild dependencies).
- 2026-05-14: Sprint 55 completed (Vite dev integration implemented via mountViteDev middleware).
- 2026-05-14: Sprint 56 completed (ViewScanner implemented for mapping view files to URL routes).
- 2026-05-14: Sprint 57 completed (Route hydration implemented: View routes are now registered in Fastify during dev).
- 2026-05-14: Sprint 58 completed (Layout system implemented with resolveLayout helper and convention support).
- 2026-05-14: Sprint 59 completed (Page meta export support implemented via extractPageMeta helper).
- 2026-05-14: Sprint 60 completed (SSR opt-in support implemented via export const ssr = true).
- 2026-05-14: Sprint 61 completed (esbuild production build utility implemented for view bundling).











