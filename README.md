# 🚀 Xacos OS 2.0

**Next-Generation Backend Development Platform for Node.js**

Xacos OS is a powerful CLI tool that helps you build production-ready Node.js backend projects with Express.js, following industry best practices.

## 🎯 What is Xacos?

Xacos helps you:
- **Scaffold** professional backend projects
- **Generate** modules, controllers, services automatically
- **Manage** events and pipelines
- **Deploy** with infrastructure as code
- **Monitor** your applications

## 🚀 Installation

### Global Installation (Recommended)

```bash
npm install -g xacos
```

### Use without installation

```bash
npx xacos <command>
```

## 📖 Commands

### `init <name>` - Initialize a new project

Creates a new backend project with a professional folder structure.

```bash
# JavaScript project
npx xacos init my-api --js --mongodb

# TypeScript project
npx xacos init my-api --ts --prisma

# With multiple features
npx xacos init my-api --ts --prisma --redis --docker
```

**Options:**
- `--js` - Use JavaScript (default)
- `--ts` - Use TypeScript
- `--mongodb` - Setup MongoDB with Mongoose
- `--prisma` - Setup Prisma ORM
- `--redis` - Include Redis client
- `--ws` - Include native WebSocket
- `--socket.io` - Include Socket.io
- `--docker` - Include Docker files
- `--git-action` - Include GitHub Actions CI/CD

---

### `add <name>` - Add a new module

Creates a complete module with controller, service, model, and routes.

```bash
# Basic module
npx xacos add Users

# With options
npx xacos add Invoice --fields "amount:number,status:string" --crud --events
```

**Options:**
- `--fields` - Define model fields (format: `name:type,name2:type`)
- `--crud` - Generate full CRUD operations
- `--events` - Generate event emitters/subscribers

**Generates:**
- `src/controllers/{name}.controller.js`
- `src/services/{name}.service.js`
- `src/models/{name}.model.js`
- `src/routes/{name}.routes.js`
- `src/events/{name}.*.ts` (if `--events`)

---

### `create:flow <name>` - Create a pipeline

Creates a typed, composable pipeline for event-driven workflows.

```bash
npx xacos create:flow user.signup
npx xacos create:flow order.process
```

**Generates:**
- `src/flows/{name}.flow.ts` - Pipeline definition

---

### `add:adapter <type> <name>` - Add an adapter

Adds a vendor-agnostic adapter for databases, mailers, queues, etc.

```bash
npx xacos add:adapter mailer resend
npx xacos add:adapter db prisma
npx xacos add:adapter queue bullmq
```

**Adapter Types:**
- `db` - Database (prisma, mongoose)
- `mailer` - Email (smtp, resend, ses)
- `queue` - Queue (bullmq, rabbitmq)
- `storage` - Storage (s3, local)

---

### `switch <type> <adapter>` - Switch adapter

Switch between adapters at runtime.

```bash
npx xacos switch mailer smtp
npx xacos switch db mongoose
```

---

### `events:list` - List all events

Lists all registered events in your system.

```bash
npx xacos events:list
```

---

### `events:graph` - Visualize event graph

Generates a visual graph of event dependencies.

```bash
npx xacos events:graph
```

---

### `plugin install <name>` - Install plugin

Installs a Xacos plugin.

```bash
npx xacos plugin install auth-jwt
npx xacos plugin install stripe
```

---

### `plugin create <name>` - Create plugin

Scaffolds a new plugin.

```bash
npx xacos plugin create my-plugin
```

---

### `explain <path>` - Explain code

AI-powered code explanation.

```bash
npx xacos explain src/services/invoice.service.ts
```

---

### `monitor` - Show observability dashboard

Displays real-time metrics and observability data.

```bash
npx xacos monitor
```

---

### `deploy` - Deploy infrastructure

Auto-generates and deploys infrastructure as code.

```bash
npx xacos deploy --platform docker
npx xacos deploy --platform k8s
```

---

### `create:redis` - Create Redis utility

Sets up Redis client with helper functions.

```bash
npx xacos create:redis
```

---

### `create:prisma` - Create Prisma setup

Sets up Prisma ORM with schema and database configuration.

```bash
npx xacos create:prisma
```

---

### `create:ws` - Create native WebSocket setup

Sets up native WebSocket server.

```bash
npx xacos create:ws
```

---

### `create:socket.io` - Create Socket.io setup

Sets up Socket.io server.

```bash
npx xacos create:socket.io
```

---

### `create:message-queue` - Create message queue setup

Sets up BullMQ for job processing.

```bash
npx xacos create:message-queue
```

---

### `create:pub-sub` - Create pub/sub setup

Sets up event-driven pub/sub system.

```bash
npx xacos create:pub-sub
```

---

### `make:docker` - Create Docker files

Creates Dockerfile and docker-compose.yml.

```bash
npx xacos make:docker
```

---

### `make:git-action` - Create GitHub Actions CI/CD

Creates GitHub Actions workflow for CI/CD.

```bash
npx xacos make:git-action
```

---

## 📁 Project Structure

After running `init`, you'll get:

```
my-backend/
├── src/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server bootstrap
│   ├── config/             # Configuration files
│   │   ├── db.js
│   │   └── env.js
│   ├── routes/             # API routes
│   │   └── index.js
│   ├── controllers/        # Route controllers
│   ├── services/           # Business logic
│   ├── models/             # Data models
│   ├── middlewares/        # Custom middlewares
│   ├── utils/              # Utility functions
│   ├── flows/              # Pipelines
│   ├── events/             # Event definitions
│   ├── adapters/           # Adapter implementations
│   ├── sockets/            # WebSocket/Socket.io
│   ├── queues/             # Message queues
│   └── subscribers/        # Event subscribers
├── prisma/                 # Prisma schema (if --prisma)
├── docker/                 # Docker files (if --docker)
├── .github/workflows/      # CI/CD (if --git-action)
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── xacos.json              # CLI metadata
```

---

## 🎯 Quick Start

1. **Create a new project:**
   ```bash
   npx xacos init my-api --js --mongodb
   ```

2. **Add a module:**
   ```bash
   cd my-api
   npx xacos add Users
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

---

## 📝 Examples

### JavaScript Single Project

```bash
# 1. Initialize project
npx xacos init my-api --js --mongodb --redis

# 2. Navigate to project
cd my-api

# 3. Install dependencies
npm install

# 4. Add modules
npx xacos add Users --crud
npx xacos add Products --crud --events
npx xacos add Orders --crud --events

# 5. Add features
npx xacos create:message-queue
npx xacos add:adapter mailer resend

# 6. Start development
npm run dev
```

### TypeScript Single Project

```bash
# 1. Initialize project
npx xacos init my-api --ts --prisma --redis

# 2. Navigate to project
cd my-api

# 3. Install dependencies
npm install

# 4. Setup Prisma
npx prisma generate
npx prisma migrate dev

# 5. Add modules
npx xacos add Users --crud --events
npx xacos add Products --crud --events
npx xacos add Orders --crud --events

# 6. Add features
npx xacos create:flow order.process
npx xacos add:adapter mailer resend
npx xacos create:message-queue

# 7. Build and start
npm run build
npm start
```

### JavaScript Monorepo

```bash
# 1. Initialize monorepo
npx xacos init my-org --js

# 2. Navigate to monorepo
cd my-org

# 3. Install dependencies
npm install

# 4. Add services
cd apps/api
npx xacos add Users --crud
npx xacos add Products --crud

cd ../worker
npx xacos create:message-queue

# 5. Start all services
cd ../..
npm run dev
```

### TypeScript Monorepo

```bash
# 1. Initialize monorepo
npx xacos init my-org --ts

# 2. Navigate to monorepo
cd my-org

# 3. Install dependencies
npm install

# 4. Setup shared packages
cd packages/database
npx xacos create:prisma

# 5. Add services
cd ../../apps/api
npx xacos add Users --crud --events
npx xacos add Products --crud --events
npx xacos create:flow order.process

cd ../worker
npx xacos create:message-queue

# 6. Build and start
cd ../..
npm run build
npm start
```

---

## 📄 Understanding xacos.json

The `xacos.json` file is the configuration file that Xacos uses to track your project settings and metadata. It's automatically created when you initialize a project.

### What is xacos.json?

`xacos.json` serves as the source of truth for your project configuration. It stores:
- Project language (TypeScript/JavaScript)
- Database configuration (MongoDB/Prisma)
- Installed adapters and plugins
- Active adapter selections
- Feature flags (Redis, WebSocket, etc.)

### Example xacos.json

```json
{
  "ts": true,
  "mongodb": false,
  "prisma": true,
  "redis": true,
  "ws": false,
  "socketIo": false,
  "adapters": {
    "db": ["prisma"],
    "mailer": ["resend"],
    "queue": ["bullmq"]
  },
  "activeAdapters": {
    "db": "prisma",
    "mailer": "resend"
  },
  "plugins": ["auth-jwt", "stripe"]
}
```

### How Xacos Uses xacos.json

When you run Xacos commands, it reads `xacos.json` to:
- Determine if TypeScript or JavaScript is being used
- Know which database adapter is configured
- Track installed adapters and plugins
- Generate code with the correct syntax and structure
- Maintain consistency across your project

### Monorepo Configuration

In a monorepo, each service can have its own `xacos.json` file, or you can have a single root `xacos.json` that applies to all services. This allows you to manage configurations at different levels of your monorepo.

---

## 🔧 Features

- ✅ **Professional Structure** - Industry-standard folder organization
- ✅ **TypeScript Support** - Full TypeScript support with type definitions
- ✅ **Database Options** - MongoDB (Mongoose) or Prisma ORM
- ✅ **Real-time** - WebSocket and Socket.io support
- ✅ **Caching** - Redis integration
- ✅ **Job Queues** - BullMQ for background jobs
- ✅ **Event System** - Pub/Sub for event-driven architecture
- ✅ **Pipelines** - Code-first workflows
- ✅ **Adapters** - Vendor-agnostic adapters
- ✅ **Plugins** - Extensible plugin system
- ✅ **Observability** - Built-in monitoring
- ✅ **Docker Ready** - Docker and docker-compose setup
- ✅ **CI/CD** - GitHub Actions workflows
- ✅ **Auto-wiring** - Routes automatically registered

---

## 📚 Module Structure

When you run `npx xacos add Users`, you get:

**Controller** (`user.controller.js`):
- `getUsers()` - GET /api/users
- `getUserById()` - GET /api/users/:id
- `createUser()` - POST /api/users
- `updateUser()` - PUT /api/users/:id
- `deleteUser()` - DELETE /api/users/:id

**Service** (`user.service.js`):
- Business logic layer
- Calls model methods

**Model** (`user.model.js`):
- Database operations
- Adapts to MongoDB or Prisma automatically

**Routes** (`user.routes.js`):
- RESTful routes
- Auto-registered in `routes/index.js`

---

## 🛠️ Tech Stack

- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM (optional)
- **Prisma** - Next-generation ORM (optional)
- **Redis** - Caching and sessions (optional)
- **BullMQ** - Job queue (optional)
- **Socket.io** - Real-time communication (optional)
- **WebSocket** - Native WebSocket (optional)
- **TypeScript** - Type safety

---

## 📄 License

MIT

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues and feature requests, please use the GitHub issue tracker.

---

**Built with ❤️ for the Node.js community**
