import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export default async function initCommand(opts) {
  const useTs = opts.ts;
  const templatePath = useTs
    ? path.join(__dirname, "../templates/ts/base-project")
    : path.join(__dirname, "../templates/js/base-project");

  const dest = process.cwd();

  await fs.copy(templatePath, dest);

  console.log(chalk.green("✔ Project initialized successfully"));
}
