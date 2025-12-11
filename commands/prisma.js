import { execSync } from "child_process";

export default function prismaCommand() {
  console.log("⚙ Initializing Prisma...");
  execSync("npx prisma init", { stdio: "inherit" });
}
