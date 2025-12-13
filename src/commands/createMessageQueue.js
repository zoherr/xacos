import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function createMessageQueueCommand() {
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
    // Ensure queues directory exists
    await fs.ensureDir(path.join(projectPath, "src/queues"));

    const content = `import { Queue, Worker } from "bullmq";
import { redis } from "../utils/redis.${ext}";

// Create a queue
export const emailQueue = new Queue("email", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
});

// Example: Add job to queue
export const addEmailJob = async (data) => {
  return await emailQueue.add("send-email", data, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });
};

// Example: Process jobs
export const emailWorker = new Worker(
  "email",
  async (job) => {
    const { to, subject, body } = job.data;
    console.log(\`📧 Processing email job \${job.id}: \${subject}\`);
    
    // Simulate email sending
    // await sendEmail(to, subject, body);
    
    return { success: true, messageId: \`msg-\${Date.now()}\` };
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
    },
  }
);

emailWorker.on("completed", (job) => {
  console.log(\`✅ Email job \${job.id} completed\`);
});

emailWorker.on("failed", (job, err) => {
  console.error(\`❌ Email job \${job.id} failed:\`, err);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  await emailWorker.close();
  await emailQueue.close();
});
`;
    await fs.writeFile(path.join(projectPath, `src/queues/index.${ext}`), content);

    // Update package.json
    const packageJsonPath = path.join(projectPath, "package.json");
    try {
      const pkg = await fs.readJSON(packageJsonPath);
      if (!pkg.dependencies) pkg.dependencies = {};
      if (!pkg.dependencies.bullmq) {
        pkg.dependencies.bullmq = "^5.3.0";
      }
      await fs.writeJSON(packageJsonPath, pkg, { spaces: 2 });
    } catch (error) {
      console.log(chalk.yellow("⚠ Could not update package.json. Please add 'bullmq' manually."));
    }

    console.log(chalk.green(`\n✔ Message queue setup created successfully!`));
    console.log(chalk.cyan(`\n📁 File: src/queues/index.${ext}`));
    console.log(chalk.yellow(`\n📝 Usage:`));
    console.log(chalk.white(`   import { addEmailJob } from "./queues/index.${ext}";`));
    console.log(chalk.white(`   await addEmailJob({ to: "user@example.com", subject: "Hello", body: "World" });`));
    console.log(chalk.yellow(`\n⚠ Note: Make sure Redis is running and configured.\n`));
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    process.exit(1);
  }
}

