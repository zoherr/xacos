import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { generateFromTemplate, getTemplatePath } from "../utils/templateEngine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function createSocketIoCommand() {
  const projectPath = process.cwd();
  const xacosConfigPath = path.join(projectPath, "xacos.json");

  let isTs = false;
  try {
    const config = await fs.readJSON(xacosConfigPath);
    isTs = config.ts || false;
  } catch (error) {
    // Default to JS
  }

  const ext = isTs ? "ts" : "js";

  try {
    // Ensure sockets directory exists
    await fs.ensureDir(path.join(projectPath, "src/sockets"));

    // Use template
    const templatePath = getTemplatePath("socketio.js", "features");
    const destinationPath = path.join(projectPath, `src/sockets/index.${ext}`);
    await generateFromTemplate(templatePath, destinationPath, { ext });

    // Update server.js to use Socket.io
    const serverPath = path.join(projectPath, `src/server.${ext}`);
    try {
      let serverContent = await fs.readFile(serverPath, "utf-8");
      
      if (!serverContent.includes("initSocketIO")) {
        // Add import
        const importLine = `import { initSocketIO } from "./sockets/index.${ext}";\n`;
        const httpImport = serverContent.includes("http") ? "" : `import http from "http";\n`;
        
        // Find app.listen and replace with http server
        if (serverContent.includes("app.listen")) {
          const newServerContent = serverContent
            .replace(/import app from/g, `${httpImport}import app from`)
            .replace(/app\.listen\(PORT,/, `const server = http.createServer(app);\n\n  ${importLine}  initSocketIO(server);\n\n  server.listen(PORT,`);
          
          await fs.writeFile(serverPath, newServerContent);
        }
      }
    } catch (error) {
      console.log(chalk.yellow("⚠ Could not update server.js. Please integrate Socket.io manually."));
    }

    // Update package.json
    const packageJsonPath = path.join(projectPath, "package.json");
    try {
      const pkg = await fs.readJSON(packageJsonPath);
      if (!pkg.dependencies) pkg.dependencies = {};
      if (!pkg.dependencies["socket.io"]) {
        pkg.dependencies["socket.io"] = "^4.6.1";
      }
      await fs.writeJSON(packageJsonPath, pkg, { spaces: 2 });
    } catch (error) {
      console.log(chalk.yellow("⚠ Could not update package.json. Please add 'socket.io' manually."));
    }

    console.log(chalk.green(`\n✔ Socket.io setup created successfully!`));
    console.log(chalk.cyan(`\n📁 File: src/sockets/index.${ext}`));
    console.log(chalk.yellow(`\n📝 Usage:`));
    console.log(chalk.white(`   Socket.io server available at: http://localhost:4000/socket.io`));
    console.log(chalk.white(`   Client: import { io } from "socket.io-client";`));
    console.log(chalk.white(`   const socket = io("http://localhost:4000");\n`));
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    process.exit(1);
  }
}

