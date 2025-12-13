import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function createWsCommand() {
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

    const content = `import { WebSocketServer } from "ws";

export const initWebSocket = (server) => {
  const wss = new WebSocketServer({ 
    server,
    path: "/ws",
  });

  wss.on("connection", (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log(\`🔌 WebSocket client connected from \${clientIp}\`);

    // Send welcome message
    ws.send(JSON.stringify({ 
      type: "welcome", 
      message: "Connected to WebSocket server" 
    }));

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("📨 Received:", data);

        // Echo back
        ws.send(JSON.stringify({ 
          type: "echo", 
          data,
          timestamp: new Date().toISOString() 
        }));

        // Broadcast to all clients (optional)
        // wss.clients.forEach((client) => {
        //   if (client !== ws && client.readyState === WebSocket.OPEN) {
        //     client.send(JSON.stringify({ type: "broadcast", data }));
        //   }
        // });
      } catch (error) {
        ws.send(JSON.stringify({ 
          type: "error", 
          message: "Invalid JSON format" 
        }));
      }
    });

    ws.on("close", () => {
      console.log(\`🔌 WebSocket client disconnected from \${clientIp}\`);
    });

    ws.on("error", (error) => {
      console.error("❌ WebSocket error:", error);
    });

    // Heartbeat
    const heartbeat = setInterval(() => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    }, 30000);

    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.on("close", () => {
      clearInterval(heartbeat);
    });
  });

  return wss;
};
`;
    await fs.writeFile(path.join(projectPath, `src/sockets/index.${ext}`), content);

    // Update server.js to use WebSocket
    const serverPath = path.join(projectPath, `src/server.${ext}`);
    try {
      let serverContent = await fs.readFile(serverPath, "utf-8");
      
      if (!serverContent.includes("initWebSocket")) {
        // Add import
        const importLine = `import { initWebSocket } from "./sockets/index.${ext}";\n`;
        const httpImport = serverContent.includes("http") ? "" : `import http from "http";\n`;
        
        // Find app.listen and replace with http server
        if (serverContent.includes("app.listen")) {
          const newServerContent = serverContent
            .replace(/import app from/g, `${httpImport}import app from`)
            .replace(/app\.listen\(PORT,/, `const server = http.createServer(app);\n\n  ${importLine}  initWebSocket(server);\n\n  server.listen(PORT,`);
          
          await fs.writeFile(serverPath, newServerContent);
        } else {
          // Just add the import if server already uses http
          if (!serverContent.includes("initWebSocket")) {
            const beforeListen = serverContent.indexOf("app.listen") || serverContent.indexOf("server.listen");
            if (beforeListen !== -1) {
              serverContent = serverContent.slice(0, beforeListen) + importLine + serverContent.slice(beforeListen);
              serverContent = serverContent.replace(/app\.listen/, `const server = http.createServer(app);\n  initWebSocket(server);\n  server.listen`);
              await fs.writeFile(serverPath, serverContent);
            }
          }
        }
      }
    } catch (error) {
      console.log(chalk.yellow("⚠ Could not update server.js. Please integrate WebSocket manually."));
    }

    // Update package.json
    const packageJsonPath = path.join(projectPath, "package.json");
    try {
      const pkg = await fs.readJSON(packageJsonPath);
      if (!pkg.dependencies) pkg.dependencies = {};
      if (!pkg.dependencies.ws) {
        pkg.dependencies.ws = "^8.14.2";
      }
      if (isTs && !pkg.devDependencies) pkg.devDependencies = {};
      if (isTs && !pkg.devDependencies["@types/ws"]) {
        pkg.devDependencies["@types/ws"] = "^8.5.10";
      }
      await fs.writeJSON(packageJsonPath, pkg, { spaces: 2 });
    } catch (error) {
      console.log(chalk.yellow("⚠ Could not update package.json. Please add 'ws' manually."));
    }

    console.log(chalk.green(`\n✔ WebSocket setup created successfully!`));
    console.log(chalk.cyan(`\n📁 File: src/sockets/index.${ext}`));
    console.log(chalk.yellow(`\n📝 Usage:`));
    console.log(chalk.white(`   WebSocket server available at: ws://localhost:4000/ws`));
    console.log(chalk.white(`   Make sure to integrate initWebSocket() in your server.${ext}\n`));
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    process.exit(1);
  }
}

