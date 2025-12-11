import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export default async function prismaCommand() {
  const schema = `
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}
  `;
  await fs.writeFile("./prisma/schema.prisma", schema);

  console.log(chalk.green("✔ Prisma schema created"));
  console.log(chalk.yellow("Run: npx prisma generate"));
}
