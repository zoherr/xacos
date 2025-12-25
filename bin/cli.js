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
import createFlowCommand from "../src/commands/createFlow.js";
import addAdapterCommand from "../src/commands/addAdapter.js";
import switchAdapterCommand from "../src/commands/switchAdapter.js";
import eventsListCommand from "../src/commands/eventsList.js";
import eventsGraphCommand from "../src/commands/eventsGraph.js";
import pluginInstallCommand from "../src/commands/pluginInstall.js";
import pluginCreateCommand from "../src/commands/pluginCreate.js";
import explainCommand from "../src/commands/explain.js";
import monitorCommand from "../src/commands/monitor.js";
import deployCommand from "../src/commands/deploy.js";

const program = new Command();

program
  .name("xacos")
  .description("Professional backend scaffolding CLI - for Node.js")
  .version("2.0.0");

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
  .option("--fields <fields>", "Define model fields (format: name:type,name2:type)")
  .option("--crud", "Generate full CRUD operations")
  .option("--events", "Generate event emitters/subscribers")
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

program
  .command("create:flow <name>")
  .description("Create a pipeline for event-driven workflows")
  .action(createFlowCommand);

// Adapter commands
program
  .command("add:adapter <type> <name>")
  .description("Add a vendor-agnostic adapter")
  .action(addAdapterCommand);

program
  .command("switch <type> <adapter>")
  .description("Switch between adapters at runtime")
  .action(switchAdapterCommand);

// Events commands
program
  .command("events:list")
  .description("List all registered events")
  .action(eventsListCommand);

program
  .command("events:graph")
  .description("Visualize event dependencies")
  .option("--format <format>", "Output format (dot, mermaid, json)")
  .option("--output <file>", "Output file")
  .action(eventsGraphCommand);

// Plugin commands
program
  .command("plugin install <name>")
  .description("Install a Xacos plugin")
  .action(pluginInstallCommand);

program
  .command("plugin create <name>")
  .description("Create a new plugin")
  .action(pluginCreateCommand);

// Utility commands
program
  .command("explain <path>")
  .description("AI-powered code explanation")
  .action(explainCommand);

program
  .command("monitor")
  .description("Show observability dashboard")
  .option("--port <port>", "Port for dashboard", "3001")
  .option("--host <host>", "Host for dashboard", "localhost")
  .option("--format <format>", "Output format (json)")
  .action(monitorCommand);

program
  .command("deploy")
  .description("Deploy infrastructure as code")
  .option("--platform <name>", "Target platform (docker, k8s, railway, fly, render)")
  .option("--dry-run", "Generate configs without deploying")
  .option("--output <dir>", "Output directory for generated configs")
  .action(deployCommand);

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
