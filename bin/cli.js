#!/usr/bin/env node
import { Command } from "commander";
import initCommand from "../src/commands/init.js";
import addCommand from "../src/commands/add.js";
import createRedisCommand from "../src/commands/createRedis.js";
import createPrismaCommand from "../src/commands/createPrisma.js";
import createWsCommand from "../src/commands/createWs.js";
import createSocketIoCommand from "../src/commands/createSocketIo.js";
import createMessageQueueCommand from "../src/commands/createMessageQueue.js";
import createPubSubCommand from "../src/commands/createPubSub.js";
import makeDockerCommand from "../src/commands/makeDocker.js";
import makeGitActionCommand from "../src/commands/makeGitAction.js";

const program = new Command();

program
  .name("xacos")
  .description("Professional backend scaffolding CLI - Laravel Artisan for Node.js")
  .version("1.0.7");

// Init command
program
  .command("init <name>")
  .description("Initialize a new backend project")
  .option("--js", "Use JavaScript")
  .option("--ts", "Use TypeScript")
  .option("--mongodb", "Setup MongoDB with Mongoose")
  .option("--prisma", "Setup Prisma ORM")
  .option("--redis", "Include Redis client")
  .option("--ws", "Include native WebSocket")
  .option("--socket.io", "Include Socket.io")
  .option("--docker", "Include Docker files")
  .option("--git-action", "Include GitHub Actions CI/CD")
  .action(initCommand);

// Add module command
program
  .command("add <name>")
  .description("Add a new module (controller, model, service, routes)")
  .action(addCommand);

// Create commands
program
  .command("create:redis")
  .description("Create Redis utility file")
  .action(createRedisCommand);

program
  .command("create:prisma")
  .description("Create Prisma setup")
  .action(createPrismaCommand);

program
  .command("create:ws")
  .description("Create native WebSocket setup")
  .action(createWsCommand);

program
  .command("create:socket.io")
  .alias("create:socketio")
  .description("Create Socket.io setup")
  .action(createSocketIoCommand);

program
  .command("create:message-queue")
  .description("Create message queue setup (BullMQ)")
  .action(createMessageQueueCommand);

program
  .command("create:pub-sub")
  .description("Create pub/sub setup")
  .action(createPubSubCommand);

// Make commands
program
  .command("make:docker")
  .description("Create Docker files (Dockerfile + docker-compose.yml)")
  .action(makeDockerCommand);

program
  .command("make:git-action")
  .description("Create GitHub Actions CI/CD workflow")
  .action(makeGitActionCommand);

program.parse();
