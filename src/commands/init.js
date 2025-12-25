import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function initCommand(name, opts) {
  const projectName = name || "backend-project";
  const useTs = opts.ts || false;
  const useJs = opts.js !== false; // Default to JS if neither specified
  const useMongo = opts.mongodb || false;
  const usePrisma = opts.prisma || false;
  const useRedis = opts.redis || false;
  const useWs = opts.ws || false;
  const useSocketIo = opts.socketIo || opts["socket.io"] || false;
  const useDocker = opts.docker || false;
  const useGitAction = opts.gitAction || false;

  const projectPath = path.join(process.cwd(), projectName);
  const ext = useTs ? "ts" : "js";

  try {
    // Create project directory
    await fs.ensureDir(projectPath);

    // Create folder structure
    const folders = [
      "src",
      "src/config",
      "src/routes",
      "src/controllers",
      "src/services",
      "src/models",
      "src/middlewares",
      "src/utils",
      "src/sockets",
      "src/queues",
      "src/subscribers",
    ];

    if (usePrisma) {
      folders.push("prisma");
    }

    if (useDocker) {
      folders.push("docker");
    }

    if (useGitAction) {
      folders.push(".github/workflows");
    }

    for (const folder of folders) {
      await fs.ensureDir(path.join(projectPath, folder));
    }

    // Create core files
    await createAppFile(projectPath, ext);
    await createServerFile(projectPath, ext);
    await createRoutesIndex(projectPath, ext);
    await createConfigFiles(projectPath, ext, useMongo, usePrisma, useRedis);
    await createUtils(projectPath, ext);
    await createEnvFiles(projectPath);
    await createPackageJson(projectPath, ext, useMongo, usePrisma, useRedis, useWs, useSocketIo);
    await createGitIgnore(projectPath);
    await createReadme(projectPath, projectName);

    if (useTs) {
      await createTsConfig(projectPath);
    }

    // Create xacos.json metadata
    await createXacosConfig(projectPath, {
      ts: useTs,
      mongodb: useMongo,
      prisma: usePrisma,
      redis: useRedis,
      ws: useWs,
      socketIo: useSocketIo,
    });

    // Add optional features
    if (usePrisma) {
      await createPrismaSchema(projectPath);
    }

    if (useDocker) {
      await createDockerFiles(projectPath, useMongo, useRedis, usePrisma);
    }

    if (useGitAction) {
      await createGitAction(projectPath, useTs);
    }

    if (useRedis) {
      await createRedisUtil(projectPath, ext);
    }

    if (useWs) {
      await createWsSetup(projectPath, ext);
    }

    if (useSocketIo) {
      await createSocketIoSetup(projectPath, ext);
    }

    console.log(chalk.green(`\n✔ Project "${projectName}" initialized successfully!`));
    console.log(chalk.cyan(`\n📁 Location: ${projectPath}`));
    console.log(chalk.yellow(`\n📝 Next steps:`));
    console.log(chalk.white(`   cd ${projectName}`));
    console.log(chalk.white(`   npm install`));
    if (usePrisma) {
      console.log(chalk.white(`   npx prisma generate`));
    }
    console.log(chalk.white(`   npm start\n`));
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    process.exit(1);
  }
}

async function createAppFile(projectPath, ext) {
  const content = ext === 'ts' 
    ? `import express, { Application } from "express";
import cors from "cors";
import routes from "./routes/index";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();`
    : `import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();`;
  
  const middlewareAndRoutes = `

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
`;
  await fs.writeFile(path.join(projectPath, `src/app.${ext}`), content + middlewareAndRoutes);
}

async function createServerFile(projectPath, ext) {
  const content = `import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(\`🚀 Server running on port \${PORT}\`);
      console.log(\`📡 Environment: \${process.env.NODE_ENV || "development"}\`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
`;
  await fs.writeFile(path.join(projectPath, `src/server.${ext}`), content);
}

async function createRoutesIndex(projectPath, ext) {
  const content = `import { Router } from "express";

const router = Router();

// Import routes here
// import userRoutes from "./user.routes";
// router.use("/users", userRoutes);

router.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default router;
`;
  await fs.writeFile(path.join(projectPath, `src/routes/index.${ext}`), content);
}

async function createConfigFiles(projectPath, ext, useMongo, usePrisma, useRedis) {
  // DB config
  if (useMongo) {
    const dbContent = `import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(\`✅ MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error(\`❌ MongoDB Error: \${error.message}\`);
    process.exit(1);
  }
};
`;
    await fs.writeFile(path.join(projectPath, `src/config/db.${ext}`), dbContent);
  } else if (usePrisma) {
    const dbContent = `import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");
  } catch (error) {
    console.error(\`❌ Database Error: \${error.message}\`);
    process.exit(1);
  }
};
`;
    await fs.writeFile(path.join(projectPath, `src/config/db.${ext}`), dbContent);
  } else {
    const dbContent = `// Database connection will be configured here
export const connectDB = async () => {
  console.log("✅ Database connection configured");
};
`;
    await fs.writeFile(path.join(projectPath, `src/config/db.${ext}`), dbContent);
  }

  // Env config
  const envContent = `import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri: process.env.MONGODB_URI,
  redisHost: process.env.REDIS_HOST || "localhost",
  redisPort: process.env.REDIS_PORT || 6379,
};
`;
  await fs.writeFile(path.join(projectPath, `src/config/env.${ext}`), envContent);
}

async function createUtils(projectPath, ext) {
  // Logger
  const loggerContent = ext === 'ts'
    ? `export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(\`[INFO] \${new Date().toISOString()} - \${message}\`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(\`[ERROR] \${new Date().toISOString()} - \${message}\`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(\`[WARN] \${new Date().toISOString()} - \${message}\`, ...args);
  },
};
`
    : `export const logger = {
  info: (message, ...args) => {
    console.log(\`[INFO] \${new Date().toISOString()} - \${message}\`, ...args);
  },
  error: (message, ...args) => {
    console.error(\`[ERROR] \${new Date().toISOString()} - \${message}\`, ...args);
  },
  warn: (message, ...args) => {
    console.warn(\`[WARN] \${new Date().toISOString()} - \${message}\`, ...args);
  },
};
`;
  await fs.writeFile(path.join(projectPath, `src/utils/logger.${ext}`), loggerContent);

  // Response helper
  const responseContent = ext === 'ts'
    ? `import { Response } from "express";

export const sendResponse = (res: Response, statusCode: number, message: string, data: any = null) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    message,
    ...(data && { data }),
  });
};

export const sendError = (res: Response, statusCode: number, message: string, errors: any = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};
`
    : `export const sendResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    message,
    ...(data && { data }),
  });
};

export const sendError = (res, statusCode, message, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};
`;
  await fs.writeFile(path.join(projectPath, `src/utils/response.${ext}`), responseContent);
}

async function createEnvFiles(projectPath) {
  const envExample = `# Server
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/xacos
# Or for Prisma
# DATABASE_URL="postgresql://user:password@localhost:5432/xacos?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT (if needed)
# JWT_SECRET=your-secret-key
`;
  await fs.writeFile(path.join(projectPath, ".env.example"), envExample);
  await fs.writeFile(path.join(projectPath, ".env"), envExample);
}

async function createPackageJson(projectPath, ext, useMongo, usePrisma, useRedis, useWs, useSocketIo) {
  const deps = {
    express: "^4.18.2",
    cors: "^2.8.5",
    dotenv: "^16.3.1",
  };

  if (useMongo) {
    deps.mongoose = "^8.0.3";
  }

  if (usePrisma) {
    deps["@prisma/client"] = "^5.7.1";
  }

  if (useRedis) {
    deps.ioredis = "^5.3.2";
  }

  if (useSocketIo) {
    deps["socket.io"] = "^4.6.1";
  }

  if (useWs) {
    deps.ws = "^8.14.2";
  }

  const devDeps = {
    nodemon: "^3.0.2",
  };

  if (ext === "ts") {
    devDeps.typescript = "^5.3.3";
    devDeps["ts-node"] = "^10.9.2";
    devDeps["@types/express"] = "^4.17.21";
    devDeps["@types/node"] = "^20.10.5";
    devDeps["@types/cors"] = "^2.8.17";
    
    if (useMongo) {
      devDeps["@types/mongoose"] = "^5.11.97";
    }
    if (useSocketIo) {
      devDeps["@types/socket.io"] = "^3.0.2";
    }
    if (useWs) {
      devDeps["@types/ws"] = "^8.5.10";
    }
  }

  if (usePrisma) {
    devDeps.prisma = "^5.7.1";
  }

  const scripts = {
    start: ext === "ts" ? "node dist/server.js" : "node src/server.js",
    dev: ext === "ts" ? "nodemon --exec ts-node src/server.ts" : "nodemon src/server.js",
  };

  if (ext === "ts") {
    scripts.build = "tsc";
    scripts["ts:watch"] = "tsc --watch";
  }

  if (usePrisma) {
    scripts["prisma:generate"] = "prisma generate";
    scripts["prisma:migrate"] = "prisma migrate dev";
    scripts["prisma:studio"] = "prisma studio";
  }

  const pkg = {
    name: path.basename(projectPath),
    version: "1.0.0",
    description: "Backend API",
    type: "module",
    main: `src/server.${ext}`,
    scripts,
    keywords: ["api", "backend"],
    author: "",
    license: "MIT",
    dependencies: deps,
    devDependencies: devDeps,
  };

  await fs.writeJSON(path.join(projectPath, "package.json"), pkg, { spaces: 2 });
}

async function createGitIgnore(projectPath) {
  const content = `# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment
.env
.env.local

# Build
dist/
build/

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Prisma
*.db
*.db-journal

# Docker
docker-compose.override.yml
`;
  await fs.writeFile(path.join(projectPath, ".gitignore"), content);
}

async function createReadme(projectPath, projectName) {
  const content = `# ${projectName}

Professional backend API built with Express.js

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
\`\`\`

## Project Structure

\`\`\`
src/
├── app.js              # Express app configuration
├── server.js           # Server bootstrap
├── config/             # Configuration files
├── routes/             # API routes
├── controllers/        # Route controllers
├── services/           # Business logic
├── models/             # Data models
├── middlewares/        # Custom middlewares
└── utils/              # Utility functions
\`\`\`

## API Endpoints

- \`GET /health\` - Health check
- \`GET /api\` - API status

## License

MIT
`;
  await fs.writeFile(path.join(projectPath, "README.md"), content);
}

async function createTsConfig(projectPath) {
  const content = {
    compilerOptions: {
      target: "ES2022",
      module: "ESNext",
      lib: ["ES2022"],
      outDir: "./dist",
      rootDir: "./src",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      moduleResolution: "node",
      allowSyntheticDefaultImports: true,
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist"],
  };
  await fs.writeJSON(path.join(projectPath, "tsconfig.json"), content, { spaces: 2 });
}

async function createXacosConfig(projectPath, config) {
  await fs.writeJSON(path.join(projectPath, "xacos.json"), config, { spaces: 2 });
}

async function createPrismaSchema(projectPath) {
  const content = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // or "mysql", "sqlite", etc.
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;
  await fs.writeFile(path.join(projectPath, "prisma/schema.prisma"), content);
}

async function createDockerFiles(projectPath, useMongo, useRedis, usePrisma) {
  // Dockerfile
  const dockerfile = `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build || true

EXPOSE 4000

CMD ["npm", "start"]
`;
  await fs.writeFile(path.join(projectPath, "docker/Dockerfile"), dockerfile);

  // docker-compose.yml
  let composeServices = {
    app: {
      build: {
        context: "..",
        dockerfile: "docker/Dockerfile",
      },
      ports: ["4000:4000"],
      environment: ["NODE_ENV=production"],
      depends_on: [],
    },
  };

  if (useMongo) {
    composeServices.mongodb = {
      image: "mongo:7",
      ports: ["27017:27017"],
      volumes: ["mongodb_data:/data/db"],
    };
    composeServices.app.environment.push("MONGODB_URI=mongodb://mongodb:27017/xacos");
    composeServices.app.depends_on.push("mongodb");
  }

  if (useRedis) {
    composeServices.redis = {
      image: "redis:7-alpine",
      ports: ["6379:6379"],
      volumes: ["redis_data:/data"],
    };
    composeServices.app.environment.push("REDIS_HOST=redis", "REDIS_PORT=6379");
    composeServices.app.depends_on.push("redis");
  }

  if (usePrisma) {
    composeServices.postgres = {
      image: "postgres:16-alpine",
      ports: ["5432:5432"],
      environment: {
        POSTGRES_USER: "postgres",
        POSTGRES_PASSWORD: "postgres",
        POSTGRES_DB: "xacos",
      },
      volumes: ["postgres_data:/var/lib/postgresql/data"],
    };
    composeServices.app.environment.push(
      'DATABASE_URL="postgresql://postgres:postgres@postgres:5432/xacos?schema=public"'
    );
    composeServices.app.depends_on.push("postgres");
  }

  const volumes = [];
  if (useMongo) volumes.push("mongodb_data");
  if (useRedis) volumes.push("redis_data");
  if (usePrisma) volumes.push("postgres_data");

  const compose = {
    version: "3.8",
    services: composeServices,
    volumes: volumes.reduce((acc, vol) => {
      acc[vol] = {};
      return acc;
    }, {}),
  };

  await fs.writeFile(
    path.join(projectPath, "docker/docker-compose.yml"),
    JSON.stringify(compose, null, 2)
  );
}

async function createGitAction(projectPath, useTs) {
  const content = `name: CI

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint || true
    
    - name: Run tests
      run: npm test || true
    
    - name: Build
      run: npm run build || true
`;
  await fs.ensureDir(path.join(projectPath, ".github/workflows"));
  await fs.writeFile(path.join(projectPath, ".github/workflows/ci.yml"), content);
}

async function createRedisUtil(projectPath, ext) {
  const content = `import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});
`;
  await fs.writeFile(path.join(projectPath, `src/utils/redis.${ext}`), content);
}

async function createWsSetup(projectPath, ext) {
  const content = `import { WebSocketServer } from "ws";

export const initWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("🔌 WebSocket client connected");

    ws.on("message", (message) => {
      console.log("📨 Received:", message.toString());
      // Echo back
      ws.send(\`Echo: \${message}\`);
    });

    ws.on("close", () => {
      console.log("🔌 WebSocket client disconnected");
    });

    ws.on("error", (error) => {
      console.error("❌ WebSocket error:", error);
    });
  });

  return wss;
};
`;
  await fs.writeFile(path.join(projectPath, `src/sockets/index.${ext}`), content);
}

async function createSocketIoSetup(projectPath, ext) {
  const content = `import { Server } from "socket.io";

export const initSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(\`🔌 Client connected: \${socket.id}\`);

    socket.on("disconnect", () => {
      console.log(\`🔌 Client disconnected: \${socket.id}\`);
    });

    // Example: Handle custom events
    socket.on("message", (data) => {
      console.log("📨 Message received:", data);
      io.emit("message", { from: socket.id, data });
    });
  });

  return io;
};
`;
  await fs.writeFile(path.join(projectPath, `src/sockets/index.${ext}`), content);
}
