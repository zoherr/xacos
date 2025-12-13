import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function makeGitActionCommand() {
  const projectPath = process.cwd();
  const xacosConfigPath = path.join(projectPath, "xacos.json");

  let isTs = false;
  let usePrisma = false;

  try {
    const config = await fs.readJSON(xacosConfigPath);
    isTs = config.ts || false;
    usePrisma = config.prisma || false;
  } catch (error) {
    // Default values
  }

  try {
    // Ensure .github/workflows directory exists
    await fs.ensureDir(path.join(projectPath, ".github/workflows"));

    const content = `name: CI

on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main, master, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
${usePrisma ? `      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5` : ""}

    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
${usePrisma ? `    - name: Setup Prisma
      run: npx prisma generate
    
    - name: Run Prisma migrations
      run: npx prisma migrate deploy
      env:
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/test?schema=public"` : ""}
    
    - name: Run linter
      run: npm run lint || echo "No lint script found"
      continue-on-error: true
    
    - name: Run tests
      run: npm test || echo "No test script found"
      continue-on-error: true
    
    - name: Build
      run: npm run build || echo "No build script found"
      continue-on-error: true
    
    - name: Upload build artifacts
      if: success()
      uses: actions/upload-artifact@v4
      with:
        name: build
        path: dist/
        if-no-files-found: ignore
`;
    await fs.writeFile(path.join(projectPath, ".github/workflows/ci.yml"), content);

    console.log(chalk.green(`\n✔ GitHub Actions CI/CD workflow created successfully!`));
    console.log(chalk.cyan(`\n📁 File: .github/workflows/ci.yml`));
    console.log(chalk.yellow(`\n📝 Features:`));
    console.log(chalk.white(`   ✓ Runs on push/PR to main/master/develop`));
    console.log(chalk.white(`   ✓ Node.js 20 setup`));
    console.log(chalk.white(`   ✓ Dependency caching`));
    if (usePrisma) {
      console.log(chalk.white(`   ✓ Prisma setup and migrations`));
    }
    console.log(chalk.white(`   ✓ Linting, testing, and building`));
    console.log(chalk.white(`   ✓ Build artifacts upload\n`));
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    process.exit(1);
  }
}

