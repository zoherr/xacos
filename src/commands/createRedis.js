import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { generateFromTemplate, getTemplatePath } from "../utils/templateEngine.js";

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

    // Use template
    const templatePath = getTemplatePath("redis.js", "features");
    const destinationPath = path.join(projectPath, `src/utils/redis.${ext}`);
    await generateFromTemplate(templatePath, destinationPath, { ext });

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

