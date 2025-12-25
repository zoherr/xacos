import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export default async function pluginCreateCommand(name) {
  const projectPath = process.cwd();
  const pluginsDir = path.join(projectPath, "src/plugins", name);
  const xacosConfigPath = path.join(projectPath, "xacos.json");

  let isTs = false;

  try {
    const config = await fs.readJSON(xacosConfigPath);
    isTs = config.ts || false;
  } catch (error) {
    // Not a xacos project, default to JS
  }

  const ext = isTs ? "ts" : "js";

  try {
    await fs.ensureDir(pluginsDir);

    const indexPath = path.join(pluginsDir, `index.${ext}`);
    const configPath = path.join(pluginsDir, "plugin.json");

    if (await fs.pathExists(indexPath)) {
      console.log(chalk.yellow(`⚠ Plugin "${name}" already exists`));
      return;
    }

    const content = isTs ? generateTypeScriptPlugin(name) : generateJavaScriptPlugin(name);
    await fs.writeFile(indexPath, content);

    const pluginConfig = {
      name,
      version: "1.0.0",
      description: `Xacos plugin: ${name}`,
      main: `index.${ext}`,
    };
    await fs.writeJSON(configPath, pluginConfig, { spaces: 2 });

    console.log(chalk.green(`\n✔ Plugin "${name}" created successfully!`));
    console.log(chalk.cyan(`\n📁 Files created:`));
    console.log(chalk.white(`   - src/plugins/${name}/index.${ext}`));
    console.log(chalk.white(`   - src/plugins/${name}/plugin.json\n`));
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    process.exit(1);
  }
}

function generateTypeScriptPlugin(name) {
  const PluginName = `${capitalize(name)}Plugin`;
  return `import { Plugin } from "@xacos/plugins";

export class ${PluginName} implements Plugin {
  name = "${name}";
  
  async onInit(): Promise<void> {
    // Plugin initialization
    // Example: Load configuration, initialize resources
  }
  
  async onStart(): Promise<void> {
    // Plugin startup logic
    // Example: Start services, connect to external APIs
  }
  
  async onStop(): Promise<void> {
    // Plugin shutdown logic
    // Example: Cleanup resources, close connections
  }
}

export default new ${PluginName}();
`;
}

function generateJavaScriptPlugin(name) {
  const PluginName = `${capitalize(name)}Plugin`;
  return `export class ${PluginName} {
  name = "${name}";
  
  async onInit() {
    // Plugin initialization
    // Example: Load configuration, initialize resources
  }
  
  async onStart() {
    // Plugin startup logic
    // Example: Start services, connect to external APIs
  }
  
  async onStop() {
    // Plugin shutdown logic
    // Example: Cleanup resources, close connections
  }
}

export default new ${PluginName}();
`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

