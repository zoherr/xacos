import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

async function findEventFiles(dir, fileList = []) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      await findEventFiles(filePath, fileList);
    } else if (file.endsWith(".ts") || file.endsWith(".js")) {
      const relativePath = path.relative(path.join(process.cwd(), "src/events"), filePath);
      fileList.push(relativePath);
    }
  }
  return fileList;
}

export default async function eventsListCommand() {
  const projectPath = process.cwd();
  const eventsDir = path.join(projectPath, "src/events");

  try {
    if (!(await fs.pathExists(eventsDir))) {
      console.log(chalk.yellow("No events directory found. No events registered."));
      return;
    }

    const eventFiles = await findEventFiles(eventsDir);

    if (eventFiles.length === 0) {
      console.log(chalk.yellow("No events found."));
      return;
    }

    console.log(chalk.cyan("\n📋 Registered Events:\n"));

    for (const file of eventFiles) {
      const eventName = file.replace(/\.(ts|js)$/, "").replace(/\\/g, "/").replace(/\//g, ".");
      console.log(chalk.white(`  • ${eventName}`));
    }

    console.log(chalk.cyan(`\nTotal: ${eventFiles.length} event(s)\n`));
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    process.exit(1);
  }
}

