import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

const ADAPTER_TYPES = {
  db: ["prisma", "mongoose"],
  mailer: ["smtp", "resend", "ses"],
  queue: ["bullmq", "rabbitmq"],
  storage: ["s3", "local"],
};

export default async function addAdapterCommand(type, name) {
  const projectPath = process.cwd();
  const adaptersDir = path.join(projectPath, "src/adapters", type);
  const xacosConfigPath = path.join(projectPath, "xacos.json");

  // Validate adapter type
  if (!ADAPTER_TYPES[type]) {
    console.error(chalk.red(`✖ Invalid adapter type: ${type}`));
    console.log(chalk.yellow(`Available types: ${Object.keys(ADAPTER_TYPES).join(", ")}`));
    process.exit(1);
  }

  // Validate adapter name
  if (!ADAPTER_TYPES[type].includes(name)) {
    console.error(chalk.red(`✖ Invalid adapter name: ${name}`));
    console.log(chalk.yellow(`Available ${type} adapters: ${ADAPTER_TYPES[type].join(", ")}`));
    process.exit(1);
  }

  let isTs = false;
  let config = { adapters: {} };

  try {
    config = await fs.readJSON(xacosConfigPath);
    isTs = config.ts || false;
  } catch (error) {
    // Create new config
  }

  const ext = isTs ? "ts" : "js";
  const adapterPath = path.join(adaptersDir, `${name}.${ext}`);

  try {
    await fs.ensureDir(adaptersDir);

    if (await fs.pathExists(adapterPath)) {
      console.log(chalk.yellow(`⚠ Adapter "${type}/${name}" already exists`));
      return;
    }

    const content = isTs ? generateTypeScriptAdapter(type, name) : generateJavaScriptAdapter(type, name);
    await fs.writeFile(adapterPath, content);

    // Update xacos.json
    if (!config.adapters) config.adapters = {};
    if (!config.adapters[type]) config.adapters[type] = [];
    if (!config.adapters[type].includes(name)) {
      config.adapters[type].push(name);
    }
    await fs.writeJSON(xacosConfigPath, config, { spaces: 2 });

    console.log(chalk.green(`\n✔ Adapter "${type}/${name}" added successfully!`));
    console.log(chalk.cyan(`\n📁 File created: src/adapters/${type}/${name}.${ext}\n`));
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    process.exit(1);
  }
}

function generateTypeScriptAdapter(type, name) {
  const AdapterName = `${capitalize(name)}${capitalize(type)}Adapter`;
  const AdapterType = `${capitalize(type)}Adapter`;
  return `import { ${AdapterType} } from "@xacos/adapters";

export class ${AdapterName} implements ${AdapterType} {
  // Implement adapter methods here
  
  async connect(): Promise<void> {
    // Connection logic
    // Example: await this.client.connect();
  }
  
  async disconnect(): Promise<void> {
    // Disconnection logic
    // Example: await this.client.disconnect();
  }
}

export default new ${AdapterName}();
`;
}

function generateJavaScriptAdapter(type, name) {
  const AdapterName = `${capitalize(name)}${capitalize(type)}Adapter`;
  return `export class ${AdapterName} {
  async connect() {
    // Connection logic
    // Example: await this.client.connect();
  }
  
  async disconnect() {
    // Disconnection logic
    // Example: await this.client.disconnect();
  }
}

export default new ${AdapterName}();
`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

