# XAOCS Changelog

- 2026-05-13: Sprint 1 completed (Monorepo audit and baseline inventory documented).
- 2026-05-13: Sprint 2 completed (Turbo task graph expanded with test/type-check/clean and global env dependency).
- 2026-05-13: Sprint 3 completed (Bun workspace setup finalized with root bunfig configuration and install verification).
- 2026-05-13: Sprint 4 completed (root strict TypeScript base config established for new XAOCS packages).
- 2026-05-13: Sprint 5 completed (`@xacos/shared` package initialized with core framework shared types and explicit exports).
- 2026-05-13: Sprint 6 completed (`@xacos/core` package scaffolded with strict TS build/test scripts and explicit exports).
- 2026-05-13: Sprint 7 completed (IoC `XContainer` implemented with singleton support and test coverage).
- 2026-05-13: Sprint 8 completed (service provider abstraction and provider registry implemented).
- 2026-05-13: Sprint 9 completed (service auto-discovery implemented with optional static inject support).
- 2026-05-13: Sprint 10 completed (application boot lifecycle implemented with provider and service discovery boot test).
- 2026-05-13: Sprint 11 completed (`@xacos/server` package initialized with strict TS scripts and explicit exports).
- 2026-05-13: Sprint 12 completed (Fastify integration added via `XServer` wrapper with global middleware registration hooks).
- 2026-05-13: Sprint 13 completed (typed `XRequest`/`XResponse` Fastify adapters implemented and tested).
- 2026-05-13: Sprint 14 completed (koa-compose style middleware pipeline implemented in core with ordered execution test).
- 2026-05-13: Sprint 15 completed (global middleware registry implemented and exported for config-driven registration).
- 2026-05-13: Sprint 16 completed (`@xacos/config` package initialized with strict TS setup and exports).
- 2026-05-13: Sprint 17 completed (environment loading and required env validation helpers implemented with tests).
- 2026-05-13: Sprint 18 completed (typed `defineConfig()` helper implemented for `xacos.config.ts`).
- 2026-05-13: Sprint 19 completed (`*.api.ts` scanner implemented for filename-derived API prefixes with dynamic segment support).
- 2026-05-13: Sprint 20 completed (`XRouter` implemented with CRUD route methods, grouping, and middleware support).
- 2026-05-13: Sprint 21 completed (`mountApiRoutes` wires scanned `*.api.ts` routers onto Fastify with compose middleware).
- 2026-05-13: Sprint 22 completed (API filename `[param]` segments mapped to `:param` in URL prefixes).
- 2026-05-13: Sprint 23 completed (`XRouter.group` and per-route middleware chaining validated for API files).
- 2026-05-13: Sprint 24 completed (`discoverMiddlewares` loads `*.middleware.ts` from `app/middlewares/` convention).
- 2026-05-13: Sprint 25 completed (`XController` response helpers implemented and exported from core).
- 2026-05-13: Sprint 26 completed (service discovery supports `static inject` constructor resolution via `XContainer`).
- 2026-05-13: Sprint 27 completed (application boot loads middlewares into `middlewareRegistry` when `middlewaresDir` is set).
- 2026-05-13: Sprint 28 completed (`@xacos/orm` package scaffolded with Knex, sqlite3 client, strict TS, and tests).
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
- 2026-05-13: Sprint 38 completed (`XModel.paginate` returns `PaginatedResult` compatible with `@xacos/shared`).
- 2026-05-13: Sprint 39 completed (`XModel.with` / `RelationScope` eager-loads declared `hasMany` metadata).
- 2026-05-13: Sprint 40 completed (relationship decorators plus `registerRelation` escape hatch for strict runtimes).
- 2026-05-13: Sprint 41 completed (`@Column` decorator and `registerColumnMeta` for field metadata).
- 2026-05-13: Sprint 42 completed (`XModel.toJSON` strips `@Column({ hidden: true })` fields).
- 2026-05-13: Sprint 43 completed (`static softDeletes`, scoped queries, `withTrashed`, and soft `delete`).
- 2026-05-13: Sprint 44 completed (`Migration` abstract class with `up`/`down` using `Schema` wrapper).
- 2026-05-13: Sprint 45 completed (`MigrationRunner` scans directories, orders files, and executes pending migrations).
- 2026-05-13: Sprint 46 completed (`xacos_migrations` ledger table created before batches are recorded).
- 2026-05-13: Sprint 47 completed (`migrate:rollback` equivalent via `MigrationRunner.rollback` for the last batch).
- 2026-05-13: Sprint 48 completed (`MigrationRunner.fresh` drops user tables and reapplies migrations).
- 2026-05-13: Sprint 49 completed (`Schema` wraps Knex schema builder for migration classes).
- 2026-05-13: Sprint 50 completed (`columnHelpers` adds `id`, `xacosTimestamps`, and `xacosSoftDeletes` table helpers).
- 2026-05-14: Sprint 51 completed (Seeder base class and SeederRunner implemented).
- 2026-05-14: Sprint 52 completed (Ordered seeder scanning and numeric-first sorting implemented).
- 2026-05-14: Sprint 53 completed (Factory system with Faker integration implemented).
- 2026-05-14: Sprint 54 completed (@xacos/compiler package initialized with Vite and esbuild dependencies).
- 2026-05-14: Sprint 55 completed (Vite dev integration implemented via mountViteDev middleware).
- 2026-05-14: Sprint 56 completed (ViewScanner implemented for mapping view files to URL routes).
- 2026-05-14: Sprint 57 completed (Route hydration implemented: View routes are now registered in Fastify during dev).
- 2026-05-14: Sprint 58 completed (Layout system implemented with resolveLayout helper and convention support).
- 2026-05-14: Sprint 59 completed (Page meta export support implemented via extractPageMeta helper).
- 2026-05-14: Sprint 60 completed (SSR opt-in support implemented via export const ssr = true).
- 2026-05-14: Sprint 61 completed (esbuild production build utility implemented for view bundling).
- 2026-05-14: Sprint 62 completed (HTML shell generation utility implemented for production view rendering).
- 2026-05-14: Sprint 63 completed (@xacos/client package scaffolded with basic hooks and components).
- 2026-05-14: Sprint 64 completed (useAuth hook and XacosProvider implemented for secure cookie-based auth).
- 2026-05-14: Sprint 65 completed (XLink component and redirect utility implemented for history-based client navigation).

- 2026-05-14: Sprint 66 completed (serverRedirect helper implemented in @xacos/shared).
- 2026-05-14: Sprint 67 completed (useXacos hook implemented for dynamic route info extraction).
- 2026-05-14: Sprint 68 completed (@xacos/auth package scaffolded for built-in authentication).
- 2026-05-14: Sprint 69 completed (Default User model implemented with hidden password support).
- 2026-05-14: Sprint 70 completed (Auth migrations implemented for users and sessions tables).
- 2026-05-14: Sprint 71 completed (AuthService implemented with JWT generation and verification).
- 2026-05-14: Sprint 72 completed (Cookie-based authenticate middleware implemented for route protection).
- 2026-05-14: Sprint 73 completed (Consolidated Auth API routes into a single auth.api.ts following new architecture rules).
- 2026-05-14: Sprint 74 completed (Auth frontend pages login and register implemented).
- 2026-05-14: Sprint 75 completed (@xacos/cli package scaffolded with cac).
- 2026-05-15: Sprint 76 completed (CLI entry setup — `xacos` CLI with `dev` command scaffolded).
- 2026-05-15: Sprint 77 completed (`xacos dev` command implemented (placeholder/bootstrap) to start dev server/HMR).
- 2026-05-15: Sprint 78 completed (`xacos build` command implemented for production view bundling via `@xacos/compiler`).
- 2026-05-15: Sprint 79 completed (`xacos start` command implemented with production static serving and view routing).
- 2026-05-15: Sprint 80 completed (`xacos migrate` command implemented to run pending migrations).
- 2026-05-15: Sprint 81 completed (`xacos migrate rollback` command implemented to revert last migration batch).
- 2026-05-15: Sprint 82 completed (`xacos migrate fresh` command implemented to reset and re-run all migrations).
- 2026-05-15: Sprint 83 completed (`xacos migrate status` command implemented to view migration progress).
- 2026-05-15: Sprint 84 completed (`xacos db:seed` command implemented to run database seeders).
- 2026-05-15: Sprint 85 completed (`xacos routes` command implemented to list all registered API and view routes).
- 2026-05-15: Sprint 86 completed (`xacos tinker` command implemented providing an interactive REPL with full app context).
- 2026-05-15: Sprint 87 completed (`xacos info` command implemented to show framework and environment diagnostics).
- 2026-05-15: Sprint 88 completed (Generator suite implemented: `xacos add` for app files and `xacos make` for database files).
- 2026-05-15: Sprint 89 completed (`create-xacos-app` package initialized with CLI entry point).
- 2026-05-15: Sprint 90 completed (Interactive scaffold implementation: prompts, directory structure, and base project files).
- 2026-05-16: Sprint 91 completed (Template generation: added base project files including `index.api.ts`, `index.tsx`, and `main.tsx` layout to `create-xacos-app`).
- 2026-05-16: Sprint 92 completed (Error Handling Core: implemented global Fastify error handler in `@xacos/server` for standardized JSON error responses).
- 2026-05-16: Sprint 93 completed (Validation Layer: integrated Zod for request validation via `req.validate(schema)` with structured error responses).
- 2026-05-16: Sprint 94 completed (Request Body Parsing: added `@fastify/formbody` and `@fastify/multipart` support for forms and file uploads).
- 2026-05-16: Sprint 95 completed (CORS Middleware: added `@fastify/cors` with configurable origin and credentials in `xacos.config.ts`).
- 2026-05-16: Sprint 96 completed (Rate Limit Middleware: added `@fastify/rate-limit` with configurable max requests and time window).
- 2026-05-16: Sprint 97 completed (Logger Integration: wired Fastify's Pino logger with `pino-pretty` for development and exposed a global `Logger` service).
- 2026-05-16: Sprint 98 completed (`@xacos/mail` package initialized with a base `Mailer` abstraction and `LogMailer` driver).
- 2026-05-16: Sprint 99 completed (SMTP Driver: implemented `SmtpMailer` using `nodemailer` with configurable host, port, and credentials).
- 2026-05-16: Sprint 100 completed (Mail Templates: added simple `{{ key }}` interpolation to the base `Mailer` for dynamic HTML and text content).
- 2026-05-16: Sprint 101 completed (Mail Service: implemented `MailManager` for dynamic driver resolution based on `xacos.config.ts`).
- 2026-05-16: Sprint 102 completed (SES Driver: implemented `SesMailer` using `@aws-sdk/client-ses` for Amazon SES integration).
- 2026-05-16: Sprint 103 completed (Mailgun Driver: implemented `MailgunMailer` using `mailgun.js`).
- 2026-05-16: Sprint 104 completed (Postmark Driver: implemented `PostmarkMailer` using `postmark` SDK).
- 2026-05-16: Sprint 105 completed (Resend Driver: implemented `ResendMailer` using `resend` SDK).
- 2026-05-16: Sprint 106 completed (Cache System: initialized `@xacos/cache` package with standard `Cache` interface).
- 2026-05-16: Sprint 107 completed (Memory Cache: implemented `MemoryCache` driver with TTL support).
- 2026-05-16: Sprint 108 completed (Cache Manager: implemented `CacheManager` for config-driven driver resolution).
- 2026-05-16: Sprint 109 completed (Redis Driver: implemented `RedisCache` using `ioredis`).
- 2026-05-16: Sprint 110 completed (Cache Middleware: implemented `cacheResponse` middleware for API response caching).
- 2026-05-16: Sprint 111 completed (LocalStorage driver implemented with static file serving).
- 2026-05-16: Sprint 112 completed (S3Storage driver with signed URLs and S3-compatible endpoint support).
- 2026-05-16: Sprint 113 completed (StorageManager singleton, driver selection, and req.file() helper).
- 2026-05-16: Sprint 114 completed (@xacos/queue package scaffolded with XJob base class).
- 2026-05-16: Sprint 115 completed (MemoryQueue driver with retry and failure handling).
- 2026-05-16: Sprint 116 completed (BullMQQueue driver with Redis-backed production queue).
- 2026-05-16: Sprint 117 completed (dispatch() helper and QueueManager implemented).
- 2026-05-16: Sprint 118 completed (xacos queue:work command to start a queue worker process).
- 2026-05-15: CLI Architecture Refactor (Moved to functional registration pattern, resolving duplicate command errors in tests).
- 2026-05-16: Sprint 122 completed (`@xacos/testing` package scaffolded).
- 2026-05-16: Sprint 123 completed (`testClient()` for fake HTTP requests in `bun:test`).
- 2026-05-16: Sprint 124 completed (`mockAuth()` and `useTestDb()` test utilities implemented).
- 2026-05-16: Sprint 125 completed (`@xacos/validation` with Zod `v` alias, `validate()`, and `ValidationError` with 422 field errors).
- 2026-05-16: Sprint 126 completed (route-level Zod schema validation on `XRouter`, automatic 422 responses from `mountApiRoutes`).
- 2026-05-16: Sprint 127 completed (`@xacos/ui` scaffold: Tailwind preset, design tokens, global CSS export).
- 2026-05-16: Sprint 128 completed (`Button` and `Input` with variants and error states).
- 2026-05-16: Sprint 129 completed (`Card`, `Badge`, `Spinner` components).
- 2026-05-16: Sprint 130 completed (`Modal` and generic `Table` components).
- 2026-05-16: Sprint 131 completed (Navbar / NavLink; default app layout scaffold uses `@xacos/ui` + `@xacos/client`).
- 2026-05-15: Workspace stabilization completed (root `bun install`, `bun run build`, and `bun run test` now pass; fixed CLI smoke tests, Fastify cookie compatibility, and Bun decorator loading in auth models).
- 2026-05-16: Sprint 132 completed (XAOCS docs wired into apps/docs with MDX and sidebar config).
- 2026-05-16: Sprint 133 completed (Docs: Getting Started page authored in MDX).
- 2026-05-16: Sprint 134 completed (Docs: Core Concepts container and lifecycle pages authored in MDX).
- 2026-05-16: Sprint 135 completed (Docs: API Routes file convention, XRouter, and controllers pages authored in MDX).
- 2026-05-16: Sprint 136 completed (Docs: ORM & Models page authored in MDX).
- 2026-05-16: Sprint 137 completed (Docs: Authentication page authored in MDX).
- 2026-05-16: Sprint 138 completed (Docs: Frontend Views page authored in MDX).
- 2026-05-16: Sprint 139 completed (Docs: CLI Commands page authored in MDX).
- 2026-05-16: Sprint 140 completed (Docs: Ecosystem Packages page authored in MDX).
- 2026-05-16: Sprint 141 completed (Web App marketing landing page live in apps/web).
- 2026-05-16: Sprint 142 completed (Web App interactive code showcase section live on landing page).
- 2026-05-16: Sprint 143 completed (Web App dynamic Changelog page live at /changelog).
- 2026-05-16: Sprint 144 completed (Web App docs redirect page live at /docs).
- 2026-05-16: Sprint 145 completed (Error Handling Deep-dive: structured Pino logging, dev stack traces, error codes).
- 2026-05-16: Sprint 146 completed (Cookie-Based Auth Hardening: secure flags, SameSite strict/lax, near-expiry refresh, token rotation).
- 2026-05-16: Sprint 147 completed (TypeScript Path Aliases: universal alias resolution across Bun, TS, Vite, and esbuild).
- 2026-05-16: Sprint 148 completed (Hot Reload for API Routes: chokidar HMR watching api/ and app/ with dynamic route registry).
- 2026-05-16: Sprint 149 completed (Health Check + Graceful Shutdown: GET /health endpoint and SIGTERM/SIGINT process draining).
- 2026-05-16: Sprint 150 completed (Source Maps + Debug Mode: dev sourcemaps inline, Pino APP_DEBUG=true support, stack traces).
- 2026-05-16: Sprint 151 completed (NPM Publishing Foundation: standardized package.json metadata, keywords, licenses, and READMEs).
- 2026-05-16: Sprint 152 completed (Changesets Integration: initialized @changesets/cli, linked versioning strategy, and initial v1.0.0 baseline).
- 2026-05-17: Sprint 153 completed (E2E Integration Test Suite: full E2E test suite covering CRUD, middleware, and stack integration in `@xacos/testing`).
- 2026-05-17: Sprint 154 completed (Performance Baseline: performance baseline benchmark added. Results at `benchmarks/results.md`).
- 2026-05-17: Sprint 155 completed (Security Audit: JWT validation, cookie hardening, security headers, request limits, and SECURITY.md policy).
- 2026-05-17: Sprint 156 completed (Bundle Analysis: `xaocs analyze` command with per-page bundle size report).
- 2026-05-17: Sprint 157 completed (API Versioning: documented and tested `v1.user.api.ts` convention, added `--version` flag to `xacos add api`).
- 2026-05-17: Sprint 158 completed (Pagination + Response Envelope Helpers: shipped `paginate()` utility and `ApiResponse` envelope helpers).
- 2026-05-17: Sprint 159 completed (xaocs add:package interactive ecosystem package installer).
- 2026-05-17: Sprint 160 completed (Full SQLite integration test — passing assertions covering all XModel methods).
- 2026-05-17: Sprint 161 completed (GitHub Actions CI — build, type-check, unit, and integration tests on every PR).
- 2026-05-17: Sprint 162 completed (npm publish workflow via changesets. Docs auto-deploy on push to main).
- 2026-05-17: Sprint 163 completed (npm provenance enabled for all packages. Supply chain integrity assured).
- 2026-05-17: Sprint 164 completed (Demo App: Blog Part 1 — Directory structure, migrations for posts, comments, tags, and XModel definitions).
- 2026-05-17: Sprint 165 completed (Demo App: Blog Part 2 — API Routes for blog CRUD and PostService with caching).
- 2026-05-17: Sprint 166 completed (Demo App: Blog Part 3 — Frontend React views for home, post detail, and dashboard).
- 2026-05-17: Sprint 167 completed (Demo App: Blog Part 4 — Database seeders for users and 25 blog posts, plus turbo dev graph wiring).
- 2026-05-17: Sprint 168 completed (Demo App Deploy — Fly.io deployment config, Dockerfile, and live demo links in docs and landing page).
- 2026-05-17: Sprint 169 completed (CONTRIBUTING.md, CODE_OF_CONDUCT.md, issue templates, PR template added).
- 2026-05-17: Sprint 170 completed (create-xaocs-app published to npm. bunx and npx compatibility verified).
- 2026-05-17: Sprint 171 completed (v1.0.0 published to npm. All 18 packages live on the registry).
- 2026-05-17: Sprint 172 completed (Root README written with quick start, ecosystem table, and badges).
- 2026-05-17: Sprint 173 completed (Monorepo cleanup. Full build verification passed. 18 packages confirmed).
- 2026-05-17: Sprint 174 completed (Community page and external links added to web app).
- 2026-05-17: Sprint 175 completed (Final pre-release smoke test complete. All CLI commands, demo blog app, and create-xaocs-app verified).
- 2026-05-17: Sprint 176 completed (Git tag v1.0.0 prepared and verified).
- 2026-05-17: Sprint 177 completed (Changesets release execution verified for v1.0.0 atomic publishing).
- 2026-05-17: Sprint 178 completed (GitHub release notes authored and documented in RELEASE_NOTES.md).






















