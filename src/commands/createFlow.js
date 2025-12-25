import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function createFlowCommand(name) {
  const projectPath = process.cwd();
  const flowsDir = path.join(projectPath, "src/flows");
  const xacosConfigPath = path.join(projectPath, "xacos.json");

  let isTs = false;

  try {
    const config = await fs.readJSON(xacosConfigPath);
    isTs = config.ts || false;
  } catch (error) {
    // Not a xacos project, default to JS
  }

  const ext = isTs ? "ts" : "js";
  const flowName = name.replace(/\./g, "-");
  const flowPath = path.join(flowsDir, `${flowName}.flow.${ext}`);

  try {
    await fs.ensureDir(flowsDir);

    if (await fs.pathExists(flowPath)) {
      console.log(chalk.yellow(`⚠ Flow "${name}" already exists`));
      return;
    }

    const content = isTs ? generateTypeScriptFlow(name) : generateJavaScriptFlow(name);
    await fs.writeFile(flowPath, content);

    console.log(chalk.green(`\n✔ Pipeline "${name}" created successfully!`));
    console.log(chalk.cyan(`\n📁 File created: src/flows/${flowName}.flow.${ext}\n`));
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    process.exit(1);
  }
}

function generateTypeScriptFlow(name) {
  const schemaName = name.replace(/\./g, "");
  return `import { flow } from "@xacos/flow";
import { z } from "zod";

// Define your input schema
const ${schemaName}Schema = z.object({
  // example: email: z.string().email(),
  // example: name: z.string().min(1),
});

// Define input type from schema
type ${schemaName}Input = z.infer<typeof ${schemaName}Schema>;

export default flow("${name}")
  .input<${schemaName}Input>()
  .validate(${schemaName}Schema)
  // Add your pipeline steps here
  // .save("db.users")
  // .emit("email.welcome")
  // .queue("sendEmail");
`;
}

function generateJavaScriptFlow(name) {
  const schemaName = name.replace(/\./g, "");
  return `import { flow } from "@xacos/flow";
import { z } from "zod";

// Define your input schema
const ${schemaName}Schema = z.object({
  // example: email: z.string().email(),
  // example: name: z.string().min(1),
});

export default flow("${name}")
  .input({ /* Define input */ })
  .validate(${schemaName}Schema)
  // Add your pipeline steps here
  // .save("db.users")
  // .emit("email.welcome")
  // .queue("sendEmail");
`;
}

