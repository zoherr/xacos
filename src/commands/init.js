import fs from "fs-extra";

export default async function initCommand(options) {
  const isTs = options.ts;

  console.log("🚀 Creating Xacos backend structure...");

  fs.ensureDirSync("src/controllers");
  fs.ensureDirSync("src/models");
  fs.ensureDirSync("src/routes");
  fs.ensureDirSync("src/services");

  const indexFile = isTs ? "src/index.ts" : "src/index.js";

  fs.writeFileSync(
    indexFile,
    `
import express from "express";
const app = express();
app.use(express.json());
app.listen(3000, () => console.log("Server running on port 3000"));`
  );

  console.log("✔ Backend initialized!");
}

