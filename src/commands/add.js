import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

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
  try {
    const config = await fs.readJSON(xacosConfigPath);
    isTs = config.ts || false;
  } catch (error) {
    // Not a xacos project, default to JS
  }

  const ext = isTs ? "ts" : "js";

  try {
    // Ensure directories exist
    const dirs = ["controllers", "services", "models", "routes"];
    for (const dir of dirs) {
      await fs.ensureDir(path.join(projectPath, "src", dir));
    }

    // Create controller
    await createController(projectPath, moduleName, ModuleName, ext);

    // Create service
    await createService(projectPath, moduleName, ModuleName, ext);

    // Create model
    await createModel(projectPath, moduleName, ModuleName, ext, isTs);

    // Create routes
    await createRoutes(projectPath, moduleName, ModuleName, ext);

    // Update routes/index.js to include new route
    await updateRoutesIndex(projectPath, moduleName, ext);

    console.log(chalk.green(`\n✔ Module "${ModuleName}" created successfully!`));
    console.log(chalk.cyan(`\n📁 Files created:`));
    console.log(chalk.white(`   - src/controllers/${moduleName}.controller.${ext}`));
    console.log(chalk.white(`   - src/services/${moduleName}.service.${ext}`));
    console.log(chalk.white(`   - src/models/${moduleName}.model.${ext}`));
    console.log(chalk.white(`   - src/routes/${moduleName}.routes.${ext}`));
    console.log(chalk.yellow(`\n📝 Route registered at: /api/${moduleName}s\n`));
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    process.exit(1);
  }
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function createController(projectPath, moduleName, ModuleName, ext) {
  const content = `import * as ${moduleName}Service from "../services/${moduleName}.service.${ext}";
import { sendResponse, sendError } from "../utils/response.${ext}";

export const get${ModuleName}s = async (req, res) => {
  try {
    const ${moduleName}s = await ${moduleName}Service.getAll${ModuleName}s();
    return sendResponse(res, 200, "${ModuleName}s retrieved successfully", ${moduleName}s);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const get${ModuleName}ById = async (req, res) => {
  try {
    const { id } = req.params;
    const ${moduleName} = await ${moduleName}Service.get${ModuleName}ById(id);
    if (!${moduleName}) {
      return sendError(res, 404, "${ModuleName} not found");
    }
    return sendResponse(res, 200, "${ModuleName} retrieved successfully", ${moduleName});
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const create${ModuleName} = async (req, res) => {
  try {
    const ${moduleName} = await ${moduleName}Service.create${ModuleName}(req.body);
    return sendResponse(res, 201, "${ModuleName} created successfully", ${moduleName});
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

export const update${ModuleName} = async (req, res) => {
  try {
    const { id } = req.params;
    const ${moduleName} = await ${moduleName}Service.update${ModuleName}(id, req.body);
    if (!${moduleName}) {
      return sendError(res, 404, "${ModuleName} not found");
    }
    return sendResponse(res, 200, "${ModuleName} updated successfully", ${moduleName});
  } catch (error) {
    return sendError(res, 400, error.message);
  }
};

export const delete${ModuleName} = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ${moduleName}Service.delete${ModuleName}(id);
    if (!deleted) {
      return sendError(res, 404, "${ModuleName} not found");
    }
    return sendResponse(res, 200, "${ModuleName} deleted successfully");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
`;
  await fs.writeFile(
    path.join(projectPath, `src/controllers/${moduleName}.controller.${ext}`),
    content
  );
}

async function createService(projectPath, moduleName, ModuleName, ext) {
  const content = `import * as ${moduleName}Model from "../models/${moduleName}.model.${ext}";

export const getAll${ModuleName}s = async () => {
  return await ${moduleName}Model.findAll();
};

export const get${ModuleName}ById = async (id) => {
  return await ${moduleName}Model.findById(id);
};

export const create${ModuleName} = async (data) => {
  return await ${moduleName}Model.create(data);
};

export const update${ModuleName} = async (id, data) => {
  return await ${moduleName}Model.update(id, data);
};

export const delete${ModuleName} = async (id) => {
  return await ${moduleName}Model.remove(id);
};
`;
  await fs.writeFile(
    path.join(projectPath, `src/services/${moduleName}.service.${ext}`),
    content
  );
}

async function createModel(projectPath, moduleName, ModuleName, ext, isTs) {
  // Check if using MongoDB or Prisma
  const xacosConfigPath = path.join(projectPath, "xacos.json");
  let useMongo = false;
  let usePrisma = false;

  try {
    const config = await fs.readJSON(xacosConfigPath);
    useMongo = config.mongodb || false;
    usePrisma = config.prisma || false;
  } catch (error) {
    // Default to basic model
  }

  if (useMongo) {
    const content = `import mongoose from "mongoose";

const ${ModuleName}Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // Add more fields as needed
  },
  {
    timestamps: true,
  }
);

export const ${ModuleName} = mongoose.model("${ModuleName}", ${ModuleName}Schema);

export const findAll = async () => {
  return await ${ModuleName}.find();
};

export const findById = async (id) => {
  return await ${ModuleName}.findById(id);
};

export const create = async (data) => {
  return await ${ModuleName}.create(data);
};

export const update = async (id, data) => {
  return await ${ModuleName}.findByIdAndUpdate(id, data, { new: true });
};

export const remove = async (id) => {
  return await ${ModuleName}.findByIdAndDelete(id);
};
`;
    await fs.writeFile(
      path.join(projectPath, `src/models/${moduleName}.model.${ext}`),
      content
    );
  } else if (usePrisma) {
    const content = `import { prisma } from "../config/db.${ext}";

export const findAll = async () => {
  return await prisma.${moduleName}.findMany();
};

export const findById = async (id) => {
  return await prisma.${moduleName}.findUnique({
    where: { id: parseInt(id) },
  });
};

export const create = async (data) => {
  return await prisma.${moduleName}.create({
    data,
  });
};

export const update = async (id, data) => {
  return await prisma.${moduleName}.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const remove = async (id) => {
  return await prisma.${moduleName}.delete({
    where: { id: parseInt(id) },
  });
};
`;
    await fs.writeFile(
      path.join(projectPath, `src/models/${moduleName}.model.${ext}`),
      content
    );
  } else {
    // Basic in-memory model
    const content = `// In-memory storage (replace with actual database)
let ${moduleName}s = [];
let nextId = 1;

export const findAll = async () => {
  return ${moduleName}s;
};

export const findById = async (id) => {
  return ${moduleName}s.find((item) => item.id === id);
};

export const create = async (data) => {
  const new${ModuleName} = {
    id: nextId++,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  ${moduleName}s.push(new${ModuleName});
  return new${ModuleName};
};

export const update = async (id, data) => {
  const index = ${moduleName}s.findIndex((item) => item.id === id);
  if (index === -1) return null;
  ${moduleName}s[index] = {
    ...${moduleName}s[index],
    ...data,
    updatedAt: new Date(),
  };
  return ${moduleName}s[index];
};

export const remove = async (id) => {
  const index = ${moduleName}s.findIndex((item) => item.id === id);
  if (index === -1) return null;
  return ${moduleName}s.splice(index, 1)[0];
};
`;
    await fs.writeFile(
      path.join(projectPath, `src/models/${moduleName}.model.${ext}`),
      content
    );
  }
}

async function createRoutes(projectPath, moduleName, ModuleName, ext) {
  const content = `import { Router } from "express";
import * as controller from "../controllers/${moduleName}.controller.${ext}";

const router = Router();

router.get("/", controller.get${ModuleName}s);
router.get("/:id", controller.get${ModuleName}ById);
router.post("/", controller.create${ModuleName});
router.put("/:id", controller.update${ModuleName});
router.delete("/:id", controller.delete${ModuleName});

export default router;
`;
  await fs.writeFile(
    path.join(projectPath, `src/routes/${moduleName}.routes.${ext}`),
    content
  );
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

