#!/usr/bin/env node
import { Command } from "commander";
import initCommand from "../commands/init.js";
import prismaCommand from "../commands/prisma.js";
import createCommand from "../commands/create.js";

const program = new Command();

program
  .name("xacos")
  .description("Node backend scaffolding CLI")
  .version("1.0.0");

program
  .command("init")
  .option("--ts", "Create project in TypeScript")
  .action(initCommand);

program
  .command("prisma")
  .action(prismaCommand);

program
  .command("create <name>")
  .description("Create model/controller/service/route")
  .action(createCommand);

program.parse(process.argv);
