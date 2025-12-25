import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export default async function switchAdapterCommand(type, adapter) {
  const projectPath = process.cwd();
  const xacosConfigPath = path.join(projectPath, "xacos.json");

  try {
    const config = await fs.readJSON(xacosConfigPath);

    if (!config.adapters || !config.adapters[type]) {
      console.error(chalk.red(`✖ No adapters found for type: ${type}`));
      process.exit(1);
    }

    if (!config.adapters[type].includes(adapter)) {
      console.error(chalk.red(`✖ Adapter "${adapter}" not found for type: ${type}`));
      console.log(chalk.yellow(`Available adapters: ${config.adapters[type].join(", ")}`));
      process.exit(1);
    }

    // Set as active adapter
    if (!config.activeAdapters) config.activeAdapters = {};
    config.activeAdapters[type] = adapter;

    await fs.writeJSON(xacosConfigPath, config, { spaces: 2 });

    console.log(chalk.green(`\n✔ Switched ${type} adapter to: ${adapter}\n`));
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    process.exit(1);
  }
}

