import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function createPrismaCommand() {
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
    // Ensure directories exist
    await fs.ensureDir(path.join(projectPath, "prisma"));
    await fs.ensureDir(path.join(projectPath, "src/config"));

    // Create Prisma schema
    const schemaContent = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // Change to "mysql", "sqlite", "mongodb", etc.
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
    await fs.writeFile(path.join(projectPath, "prisma/schema.prisma"), schemaContent);

    // Create or update db config
    const dbConfigContent = `import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");
  } catch (error) {
    console.error(\`❌ Database Error: \${error.message}\`);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
`;
    await fs.writeFile(path.join(projectPath, `src/config/db.${ext}`), dbConfigContent);

    // Update package.json
    const packageJsonPath = path.join(projectPath, "package.json");
    try {
      const pkg = await fs.readJSON(packageJsonPath);
      if (!pkg.dependencies) pkg.dependencies = {};
      if (!pkg.devDependencies) pkg.devDependencies = {};
      
      if (!pkg.dependencies["@prisma/client"]) {
        pkg.dependencies["@prisma/client"] = "^5.7.1";
      }
      if (!pkg.devDependencies.prisma) {
        pkg.devDependencies.prisma = "^5.7.1";
      }

      if (!pkg.scripts) pkg.scripts = {};
      pkg.scripts["prisma:generate"] = "prisma generate";
      pkg.scripts["prisma:migrate"] = "prisma migrate dev";
      pkg.scripts["prisma:studio"] = "prisma studio";
      pkg.scripts["prisma:seed"] = "prisma db seed";

      await fs.writeJSON(packageJsonPath, pkg, { spaces: 2 });
    } catch (error) {
      console.log(chalk.yellow("⚠ Could not update package.json. Please add Prisma dependencies manually."));
    }

    // Update .env.example
    const envExamplePath = path.join(projectPath, ".env.example");
    try {
      let envContent = await fs.readFile(envExamplePath, "utf-8");
      if (!envContent.includes("DATABASE_URL")) {
        envContent += `\n# Database (Prisma)\nDATABASE_URL="postgresql://user:password@localhost:5432/xacos?schema=public"\n`;
        await fs.writeFile(envExamplePath, envContent);
      }
    } catch (error) {
      // .env.example might not exist, that's okay
    }

    console.log(chalk.green(`\n✔ Prisma setup created successfully!`));
    console.log(chalk.cyan(`\n📁 Files created:`));
    console.log(chalk.white(`   - prisma/schema.prisma`));
    console.log(chalk.white(`   - src/config/db.${ext}`));
    console.log(chalk.yellow(`\n📝 Next steps:`));
    console.log(chalk.white(`   1. Update DATABASE_URL in .env`));
    console.log(chalk.white(`   2. Run: npx prisma generate`));
    console.log(chalk.white(`   3. Run: npx prisma migrate dev`));
    console.log(chalk.white(`   4. (Optional) Run: npx prisma studio\n`));
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    process.exit(1);
  }
}

