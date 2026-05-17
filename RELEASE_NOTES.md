# XAOCS v1.0.0 — Initial Stable Release

We are incredibly proud to announce the formal **v1.0.0 stable release** of the XAOCS Framework! E.g., built from the ground up for AI-native full-stack TypeScript development on Bun, XAOCS delivers the legendary developer experience of Laravel combined with the sheer speed of modern JavaScript tooling.

---

## 🔥 Top Features & Highlights

### 1. One Server, One Port (5000)
Eliminate CORS headaches, proxy configurations, and complex microservices. XAOCS serves your backend API and React frontend from a single, unified Fastify instance.

### 2. AI-Native Architecture
Every folder convention, file pattern, and export is meticulously optimized for AI coding assistants (Cursor, Copilot, Claude). E.g., predictable patterns ensure your AI generates perfect code on the first prompt.

### 3. File-Based Routing
Zero manual route registration. E.g., `user.api.ts` maps directly to `/api/user`. E.g., `views/index.tsx` maps directly to `/`. E.g., dynamic segments like `[id].api.ts` map flawlessly to `:id`.

### 4. Type-Safe ORM (`XModel`)
An Eloquent-inspired, Knex-backed ORM supporting MySQL, PostgreSQL, SQLite, and MongoDB. Includes relationship decorators (`@HasMany`, `@BelongsTo`), soft deletes, automatic timestamp management, migrations, seeders, and factories.

### 5. Built-In Authentication & Security
Out-of-the-box support for email + password authentication, secure HTTP-only cookie sessions, JWT verification, password hashing, rate limiting, and comprehensive security headers.

### 6. Production Scaffolding & Tooling
Instantly boot new projects with `bunx create-xaocs-app my-app`. Includes a full suite of CLI generators (`xacos add model`, `xacos add controller`, `xacos make migration`) and interactive REPL (`xacos tinker`).

---

## 📦 Ecosystem Packages Published (v1.0.0)

All 18 official framework packages are now live on the registry with full provenance and TypeScript declarations:

- `@xacos/shared` — Shared types and response interfaces
- `@xacos/core` — IoC Container, Dependency Injection, and Boot Lifecycle
- `@xacos/config` — Environment loading and typed `defineConfig`
- `@xacos/server` — Fastify integration, middleware pipeline, and error handling
- `@xacos/orm` — Knex-backed `XModel`, migrations, seeders, and schema builders
- `@xacos/compiler` — Vite dev integration, esbuild production view bundling, and HTML shell generation
- `@xacos/client` — React frontend hooks (`useAuth`, `useXacos`, `useEvent`) and navigation (`XLink`)
- `@xacos/auth` — Built-in authentication service, User model, and JWT middleware
- `@xacos/mail` — Multi-driver mailer supporting SMTP, SES, Mailgun, Postmark, and Resend
- `@xacos/cache` — Distributed caching supporting Memory and Redis drivers
- `@xacos/storage` — S3-compatible and Local file storage management
- `@xacos/queue` — BullMQ Redis and Memory background job processing
- `@xacos/events` — Real-time WebSocket broadcasting via Socket.IO
- `@xacos/validation` — Zod request validation wrapper and structured 422 error handling
- `@xacos/ui` — Tailwind CSS React component primitives
- `@xacos/testing` — In-process Fastify `testClient()` and database isolation utilities
- `@xacos/cli` — Comprehensive CLI tooling suite
- `create-xaocs-app` — Interactive project scaffolding binary

---

## 🚀 Getting Started

Boot your first XAOCS application in seconds:

```bash
bunx create-xaocs-app my-app
cd my-app
xacos migrate
xacos dev
```

Visit `http://localhost:5000` to see your new application live!

---

## 🤝 Contributing & Community

Join our thriving open-source community:
- **Discord**: [https://discord.gg/xaocs](https://discord.gg/xaocs)
- **GitHub**: [https://github.com/zoherr/xaocs](https://github.com/zoherr/xaocs)
- **Twitter / X**: [https://x.com/xaocsdev](https://x.com/xaocsdev)

Please review our `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` before submitting pull requests. E.g., thank you to all our amazing contributors who made v1.0.0 possible!
