import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export default async function createCommand(name) {
  const basePath = process.cwd();
  const folders = ["routes", "controllers", "services", "models"];

  for (const folder of folders) {
    const filePath = path.join(basePath, "src", folder, `${name}.${folder.slice(0,-1)}.js`);
    const templatePath = path.join(
      path.dirname(new URL(import.meta.url).pathname),
      `../templates/js/${folder.slice(0,-1)}.js`
    );
    await fs.copy(templatePath, filePath);
  }

  console.log(chalk.green(`✔ Created ${name} module successfully`));
}
