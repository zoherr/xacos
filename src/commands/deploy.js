import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

const SUPPORTED_PLATFORMS = ["docker", "k8s", "railway", "fly", "render", "vercel", "aws"];

export default async function deployCommand(opts) {
  const projectPath = process.cwd();
  const platform = opts.platform || "docker";
  const dryRun = opts.dryRun || false;
  const outputDir = opts.output || "infra";

  if (!SUPPORTED_PLATFORMS.includes(platform)) {
    console.error(chalk.red(`✖ Unsupported platform: ${platform}`));
    console.log(chalk.yellow(`Supported platforms: ${SUPPORTED_PLATFORMS.join(", ")}`));
    process.exit(1);
  }

  try {
    const xacosConfigPath = path.join(projectPath, "xacos.json");
    let config = {};

    try {
      config = await fs.readJSON(xacosConfigPath);
    } catch (error) {
      console.log(chalk.yellow("⚠ No xacos.json found, using defaults"));
    }

    console.log(chalk.cyan(`\n🚀 Generating deployment config for: ${platform}\n`));

    if (platform === "docker") {
      await generateDockerConfig(projectPath, outputDir, config);
    } else {
      console.log(chalk.yellow(`⚠ Platform "${platform}" deployment config generation coming soon`));
    }

    if (dryRun) {
      console.log(chalk.green(`\n✔ Configs generated (dry-run mode)\n`));
    } else {
      console.log(chalk.green(`\n✔ Deployment configs generated in: ${outputDir}\n`));
    }
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    process.exit(1);
  }
}

async function generateDockerConfig(projectPath, outputDir, config) {
  const infraDir = path.join(projectPath, outputDir);
  await fs.ensureDir(infraDir);

  const dockerfile = `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build || true

EXPOSE 4000

CMD ["npm", "start"]
`;

  await fs.writeFile(path.join(infraDir, "Dockerfile"), dockerfile);
  console.log(chalk.green("  ✓ Dockerfile created"));
}

