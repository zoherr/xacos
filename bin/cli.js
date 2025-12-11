#!/usr/bin/env node
import { Command } from "commander";
import initCommand from "../src/commands/init.js";
import prismaCommand from "../src/commands/prisma.js";
import createCommand from "../src/commands/create.js";

const program = new Command();

program
  .name("xacos")
  .description("Xacos backend scaffolding CLI")
  .version("1.0.0");

program
  .command("init")
  .option("--ts", "Use TypeScript")
  .action(initCommand);

program
  .command("prisma")
  .action(prismaCommand);

program
  .command("create <name>")
  .action(createCommand);

program.parse();
