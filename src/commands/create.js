import fs from "fs-extra";

export default async function createCommand(name) {
  const pascal = name.charAt(0).toUpperCase() + name.slice(1);
  const lower = name.toLowerCase();

  console.log(`🚧 Creating ${pascal} resources...`);

  fs.writeFileSync(
    `src/models/${pascal}.ts`,
    `export const ${pascal}Model = {}`
  );

  fs.writeFileSync(
    `src/controllers/${pascal}Controller.ts`,
    `export default {
  async index(req, res) {
    res.send("${pascal} list");
  }
}`
  );

  fs.writeFileSync(
    `src/services/${pascal}Service.ts`,
    `export default {
  async getAll() {
    return [];
  }
}`
  );

  fs.writeFileSync(
    `src/routes/${lower}.js`,
    `
import { Router } from "express";
import Controller from "../controllers/${pascal}Controller.js";

const router = Router();
router.get("/", Controller.index);
export default router;
`
  );

  console.log("✔ All files created!");
}
