import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function makeDockerCommand() {
  const projectPath = process.cwd();
  const xacosConfigPath = path.join(projectPath, "xacos.json");

  let useMongo = false;
  let useRedis = false;
  let usePrisma = false;
  let isTs = false;

  try {
    const config = await fs.readJSON(xacosConfigPath);
    useMongo = config.mongodb || false;
    useRedis = config.redis || false;
    usePrisma = config.prisma || false;
    isTs = config.ts || false;
  } catch (error) {
    // Default values
  }

  try {
    // Ensure docker directory exists
    await fs.ensureDir(path.join(projectPath, "docker"));

    // Create Dockerfile
    const dockerfile = `FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build if TypeScript
${isTs ? "RUN npm run build" : "# No build step needed for JavaScript"}

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["npm", "start"]
`;
    await fs.writeFile(path.join(projectPath, "docker/Dockerfile"), dockerfile);

    // Create docker-compose.yml
    const composeServices = {
      app: {
        build: {
          context: "..",
          dockerfile: "docker/Dockerfile",
        },
        ports: ["4000:4000"],
        environment: [
          "NODE_ENV=production",
          ...(useMongo ? ["MONGODB_URI=mongodb://mongodb:27017/xacos"] : []),
          ...(useRedis ? ["REDIS_HOST=redis", "REDIS_PORT=6379"] : []),
          ...(usePrisma
            ? ['DATABASE_URL="postgresql://postgres:postgres@postgres:5432/xacos?schema=public"']
            : []),
        ],
        depends_on: [],
        restart: "unless-stopped",
      },
    };

    const volumes = {};

    if (useMongo) {
      composeServices.mongodb = {
        image: "mongo:7",
        ports: ["27017:27017"],
        volumes: ["mongodb_data:/data/db"],
        restart: "unless-stopped",
      };
      composeServices.app.depends_on.push("mongodb");
      volumes.mongodb_data = {};
    }

    if (useRedis) {
      composeServices.redis = {
        image: "redis:7-alpine",
        ports: ["6379:6379"],
        volumes: ["redis_data:/data"],
        restart: "unless-stopped",
        command: "redis-server --appendonly yes",
      };
      composeServices.app.depends_on.push("redis");
      volumes.redis_data = {};
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
        restart: "unless-stopped",
      };
      composeServices.app.depends_on.push("postgres");
      volumes.postgres_data = {};
    }

    const compose = {
      version: "3.8",
      services: composeServices,
      volumes,
    };

    await fs.writeFile(
      path.join(projectPath, "docker/docker-compose.yml"),
      JSON.stringify(compose, null, 2)
    );

    // Create .dockerignore
    const dockerignore = `node_modules
npm-debug.log
.env
.env.local
.git
.gitignore
README.md
.dockerignore
dist
build
*.log
.DS_Store
`;
    await fs.writeFile(path.join(projectPath, ".dockerignore"), dockerignore);

    console.log(chalk.green(`\n✔ Docker files created successfully!`));
    console.log(chalk.cyan(`\n📁 Files created:`));
    console.log(chalk.white(`   - docker/Dockerfile`));
    console.log(chalk.white(`   - docker/docker-compose.yml`));
    console.log(chalk.white(`   - .dockerignore`));
    console.log(chalk.yellow(`\n📝 Usage:`));
    console.log(chalk.white(`   cd docker`));
    console.log(chalk.white(`   docker-compose up -d`));
    console.log(chalk.white(`   docker-compose down\n`));
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    process.exit(1);
  }
}

