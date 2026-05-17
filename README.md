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
