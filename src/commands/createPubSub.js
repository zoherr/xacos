import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function createPubSubCommand() {
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
    // Ensure subscribers directory exists
    await fs.ensureDir(path.join(projectPath, "src/subscribers"));

    // Create pubsub utility
    const pubsubContent = `import { EventEmitter } from "events";

class PubSub extends EventEmitter {
  publish(event, data) {
    this.emit(event, data);
  }

  subscribe(event, handler) {
    this.on(event, handler);
  }

  unsubscribe(event, handler) {
    this.off(event, handler);
  }
}

export const pubsub = new PubSub();

// Example usage:
// pubsub.subscribe("user.created", (user) => {
//   console.log("User created:", user);
// });
//
// pubsub.publish("user.created", { id: 1, name: "John" });
`;
    await fs.writeFile(path.join(projectPath, `src/utils/pubsub.${ext}`), pubsubContent);

    // Create example subscriber
    const subscriberContent = `import { pubsub } from "../utils/pubsub.${ext}";

// Example: User created subscriber
pubsub.subscribe("user.created", (user) => {
  console.log(\`📢 User created event received: \${user.name}\`);
  // Handle user created event
  // e.g., send welcome email, create profile, etc.
});

// Example: User updated subscriber
pubsub.subscribe("user.updated", (user) => {
  console.log(\`📢 User updated event received: \${user.name}\`);
  // Handle user updated event
});

// Example: User deleted subscriber
pubsub.subscribe("user.deleted", (userId) => {
  console.log(\`📢 User deleted event received: \${userId}\`);
  // Handle user deleted event
  // e.g., cleanup related data
});

export default pubsub;
`;
    await fs.writeFile(path.join(projectPath, `src/subscribers/index.${ext}`), subscriberContent);

    console.log(chalk.green(`\n✔ Pub/Sub setup created successfully!`));
    console.log(chalk.cyan(`\n📁 Files created:`));
    console.log(chalk.white(`   - src/utils/pubsub.${ext}`));
    console.log(chalk.white(`   - src/subscribers/index.${ext}`));
    console.log(chalk.yellow(`\n📝 Usage:`));
    console.log(chalk.white(`   import { pubsub } from "./utils/pubsub.${ext}";`));
    console.log(chalk.white(`   pubsub.publish("event.name", { data: "value" });`));
    console.log(chalk.white(`   pubsub.subscribe("event.name", (data) => { ... });\n`));
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    process.exit(1);
  }
}

