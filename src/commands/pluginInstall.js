import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export default async function pluginInstallCommand(name) {
  const projectPath = process.cwd();
  const pluginsDir = path.join(projectPath, "src/plugins");
  const xacosConfigPath = path.join(projectPath, "xacos.json");

  try {
    let config = { plugins: [] };

    try {
      config = await fs.readJSON(xacosConfigPath);
    } catch (error) {
      // Create new config
    }

    if (!config.plugins) config.plugins = [];

    if (config.plugins.includes(name)) {
      console.log(chalk.yellow(`⚠ Plugin "${name}" is already installed`));
      return;
    }

    // In a real implementation, this would install from npm or a plugin registry
    console.log(chalk.cyan(`\n📦 Installing plugin: ${name}...`));
    
    // For now, just add to config
    config.plugins.push(name);
    await fs.writeJSON(xacosConfigPath, config, { spaces: 2 });

    console.log(chalk.green(`\n✔ Plugin "${name}" installed successfully!`));
    console.log(chalk.yellow(`\n📝 Note: Plugin installation from registry coming soon.\n`));
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    process.exit(1);
  }
}

