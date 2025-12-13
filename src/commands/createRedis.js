import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function createRedisCommand() {
  const projectPath = process.cwd();
  const xacosConfigPath = path.join(projectPath, "xacos.json");

  let isTs = false;
  try {
    const config = await fs.readJSON(xacosConfigPath);
    isTs = config.ts || false;
  } catch (error) {
    // Default to JS
  }

  const ext = isTs ? "ts" : "js";

  try {
    // Ensure utils directory exists
    await fs.ensureDir(path.join(projectPath, "src/utils"));

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

// Helper functions
export const getCache = async (key) => {
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
};

export const setCache = async (key, value, expiry = 3600) => {
  await redis.setex(key, expiry, JSON.stringify(value));
};

export const deleteCache = async (key) => {
  await redis.del(key);
};

export const clearCache = async (pattern = "*") => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};
`;
    await fs.writeFile(path.join(projectPath, `src/utils/redis.${ext}`), content);

    // Update package.json to include ioredis
    const packageJsonPath = path.join(projectPath, "package.json");
    try {
      const pkg = await fs.readJSON(packageJsonPath);
      if (!pkg.dependencies) pkg.dependencies = {};
      if (!pkg.dependencies.ioredis) {
        pkg.dependencies.ioredis = "^5.3.2";
      }
      await fs.writeJSON(packageJsonPath, pkg, { spaces: 2 });
    } catch (error) {
      console.log(chalk.yellow("⚠ Could not update package.json. Please add 'ioredis' manually."));
    }

    console.log(chalk.green(`\n✔ Redis utility created successfully!`));
    console.log(chalk.cyan(`\n📁 File: src/utils/redis.${ext}`));
    console.log(chalk.yellow(`\n📝 Usage:`));
    console.log(chalk.white(`   import { redis, getCache, setCache } from "./utils/redis.${ext}";`));
    console.log(chalk.white(`   await setCache("key", { data: "value" }, 3600);`));
    console.log(chalk.white(`   const data = await getCache("key");\n`));
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    process.exit(1);
  }
}

