# 📦 Xacos CLI

**Backend scaffolding CLI -  for Node.js**

Xacos is a powerful CLI tool that helps you scaffold production-ready Node.js backend projects with Express.js, following industry best practices and professional folder structures.

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
npx xacos init my-backend --js --mongodb
npx xacos init my-backend --ts --prisma
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

**Example:**
```bash
npx xacos init api-server --ts --prisma --redis --docker
```

### `add <name>` - Add a new module

Creates a complete module with controller, service, model, and routes.

```bash
npx xacos add Users
npx xacos add notifications
npx xacos add products
```

This command generates:
- `src/controllers/{name}.controller.js`
- `src/services/{name}.service.js`
- `src/models/{name}.model.js`
- `src/routes/{name}.routes.js`

And automatically registers the route in `src/routes/index.js`.

### `create:redis` - Create Redis utility

Sets up Redis client with helper functions.

```bash
npx xacos create:redis
```

Creates `src/utils/redis.js` with connection, caching helpers, and error handling.

### `create:prisma` - Create Prisma setup

Sets up Prisma ORM with schema and database configuration.

```bash
npx xacos create:prisma
```

Creates:
- `prisma/schema.prisma`
- `src/config/db.js` (Prisma client)

### `create:ws` - Create native WebSocket setup

Sets up native WebSocket server.

```bash
npx xacos create:ws
```

Creates `src/sockets/index.js` with WebSocket server configuration.

### `create:socket.io` - Create Socket.io setup

Sets up Socket.io server.

```bash
npx xacos create:socket.io
```

Creates `src/sockets/index.js` with Socket.io server and room management.

### `create:message-queue` - Create message queue setup

Sets up BullMQ for job processing.

```bash
npx xacos create:message-queue
```

Creates `src/queues/index.js` with example email queue and worker.

### `create:pub-sub` - Create pub/sub setup

Sets up event-driven pub/sub system.

```bash
npx xacos create:pub-sub
```

Creates:
- `src/utils/pubsub.js` - Event emitter wrapper
- `src/subscribers/index.js` - Example subscribers

### `make:docker` - Create Docker files

Creates Dockerfile and docker-compose.yml.

```bash
npx xacos make:docker
```

Creates:
- `docker/Dockerfile`
- `docker/docker-compose.yml`
- `.dockerignore`

Automatically configures services based on your project (MongoDB, Redis, PostgreSQL).

### `make:git-action` - Create GitHub Actions CI/CD

Creates GitHub Actions workflow for CI/CD.

```bash
npx xacos make:git-action
```

Creates `.github/workflows/ci.yml` with:
- Node.js setup
- Dependency caching
- Linting, testing, building
- Prisma migrations (if using Prisma)

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
│   │   ├── logger.js
│   │   └── response.js
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

## 📝 Example Workflow

```bash
# 1. Initialize project
npx xacos init blog-api --ts --prisma --redis

# 2. Add modules
cd blog-api
npx xacos add Posts
npx xacos add Comments
npx xacos add Users

# 3. Add features
npx xacos create:message-queue
npx xacos create:pub-sub

# 4. Setup deployment
npx xacos make:docker
npx xacos make:git-action

# 5. Install and run
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## 🔧 Features

- ✅ **Professional Structure** - Industry-standard folder organization
- ✅ **TypeScript Support** - Full TypeScript support with type definitions
- ✅ **Database Options** - MongoDB (Mongoose) or Prisma ORM
- ✅ **Real-time** - WebSocket and Socket.io support
- ✅ **Caching** - Redis integration
- ✅ **Job Queues** - BullMQ for background jobs
- ✅ **Event System** - Pub/Sub for event-driven architecture
- ✅ **Docker Ready** - Docker and docker-compose setup
- ✅ **CI/CD** - GitHub Actions workflows
- ✅ **Auto-wiring** - Routes automatically registered

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

## 🛠️ Tech Stack

- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM (optional)
- **Prisma** - Next-generation ORM (optional)
- **Redis** - Caching and sessions (optional)
- **BullMQ** - Job queue (optional)
- **Socket.io** - Real-time communication (optional)
- **WebSocket** - Native WebSocket (optional)

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and feature requests, please use the GitHub issue tracker.

---

**Built with ❤️ for the Node.js community**

