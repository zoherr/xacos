import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { generateFromTemplate, getTemplatePath } from "../utils/templateEngine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function addCommand(name) {
  const moduleName = name.toLowerCase();
  const ModuleName = capitalizeFirst(name);
  const MODULE_NAME = name.toUpperCase();

  const projectPath = process.cwd();
  const xacosConfigPath = path.join(projectPath, "xacos.json");

  // Check if we're in a xacos project
  let isTs = false;
  let useMongo = false;
  let usePrisma = false;
  
  try {
    const config = await fs.readJSON(xacosConfigPath);
    isTs = config.ts || false;
    useMongo = config.mongodb || false;
    usePrisma = config.prisma || false;
  } catch (error) {
    // Not a xacos project, default to JS
  }

  const ext = isTs ? "ts" : "js";

  try {
    // Ensure directories exist
    const dirs = ["controllers", "services", "models", "routes"];
    if (isTs) {
      dirs.push("interfaces");
    }
    
    for (const dir of dirs) {
      await fs.ensureDir(path.join(projectPath, "src", dir));
    }

    // Template variables
    const variables = {
      moduleName,
      ModuleName,
      MODULE_NAME,
      ext,
    };

    // Create interface (TypeScript only)
    if (isTs) {
      const interfaceTemplate = getTemplatePath("interface.ts", "modules");
      const interfacePath = path.join(projectPath, `src/interfaces/${moduleName}.interface.${ext}`);
      await generateFromTemplate(interfaceTemplate, interfacePath, variables);
    }

    // Create controller
    const controllerTemplate = getTemplatePath(
      isTs ? "controller.ts" : "controller.js",
      "modules"
    );
    const controllerPath = path.join(projectPath, `src/controllers/${moduleName}.controller.${ext}`);
    await generateFromTemplate(controllerTemplate, controllerPath, variables);

    // Create service
    const serviceTemplate = getTemplatePath(
      isTs ? "service.ts" : "service.js",
      "modules"
    );
    const servicePath = path.join(projectPath, `src/services/${moduleName}.service.${ext}`);
    await generateFromTemplate(serviceTemplate, servicePath, variables);

    // Create model (choose based on database)
    let modelTemplate;
    if (useMongo) {
      modelTemplate = getTemplatePath(
        isTs ? "model-mongodb.ts" : "model-mongodb.js",
        "modules"
      );
    } else if (usePrisma) {
      modelTemplate = getTemplatePath(
        isTs ? "model-prisma.ts" : "model-prisma.js",
        "modules"
      );
    } else {
      modelTemplate = getTemplatePath(
        isTs ? "model-basic.ts" : "model-basic.js",
        "modules"
      );
    }
    const modelPath = path.join(projectPath, `src/models/${moduleName}.model.${ext}`);
    await generateFromTemplate(modelTemplate, modelPath, variables);

    // Create routes
    const routesTemplate = getTemplatePath(
      isTs ? "routes.ts" : "routes.js",
      "modules"
    );
    const routesPath = path.join(projectPath, `src/routes/${moduleName}.routes.${ext}`);
    await generateFromTemplate(routesTemplate, routesPath, variables);

    // Update routes/index.js to include new route
    await updateRoutesIndex(projectPath, moduleName, ext);

    console.log(chalk.green(`\n✔ Module "${ModuleName}" created successfully!`));
    console.log(chalk.cyan(`\n📁 Files created:`));
    if (isTs) {
      console.log(chalk.white(`   - src/interfaces/${moduleName}.interface.${ext}`));
    }
    console.log(chalk.white(`   - src/controllers/${moduleName}.controller.${ext}`));
    console.log(chalk.white(`   - src/services/${moduleName}.service.${ext}`));
    console.log(chalk.white(`   - src/models/${moduleName}.model.${ext}`));
    console.log(chalk.white(`   - src/routes/${moduleName}.routes.${ext}`));
    console.log(chalk.yellow(`\n📝 Route registered at: /api/${moduleName}s\n`));
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    console.error(chalk.red(error.stack));
    process.exit(1);
  }
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function updateRoutesIndex(projectPath, moduleName, ext) {
  const indexPath = path.join(projectPath, `src/routes/index.${ext}`);
  
  try {
    let content = await fs.readFile(indexPath, "utf-8");
    
    // Check if route already exists
    if (content.includes(`${moduleName}Routes`)) {
      console.log(chalk.yellow(`⚠ Route for ${moduleName} already exists in index.${ext}`));
      return;
    }

    // Add import
    const importLine = `import ${moduleName}Routes from "./${moduleName}.routes.${ext}";\n`;
    
    // Find where to insert (after existing imports, before router definition)
    const routerIndex = content.indexOf("const router");
    if (routerIndex !== -1) {
      content = content.slice(0, routerIndex) + importLine + content.slice(routerIndex);
    } else {
      // If no router found, add at the beginning
      content = importLine + content;
    }

    // Add route registration
    const routeLine = `router.use("/${moduleName}s", ${moduleName}Routes);\n`;
    
    // Find the router.get("/") line and add before it
    const apiRouteIndex = content.indexOf('router.get("/"');
    if (apiRouteIndex !== -1) {
      content = content.slice(0, apiRouteIndex) + routeLine + content.slice(apiRouteIndex);
    } else {
      // Add before export
      const exportIndex = content.indexOf("export default");
      if (exportIndex !== -1) {
        content = content.slice(0, exportIndex) + routeLine + content.slice(exportIndex);
      }
    }

    await fs.writeFile(indexPath, content);
  } catch (error) {
    // If file doesn't exist or can't be read, create a new one
    const newContent = `import { Router } from "express";
import ${moduleName}Routes from "./${moduleName}.routes.${ext}";

const router = Router();

router.use("/${moduleName}s", ${moduleName}Routes);

router.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default router;
`;
    await fs.writeFile(indexPath, newContent);
  }
}
