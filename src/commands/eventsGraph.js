import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

async function findEventFiles(dir, fileList = []) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      await findEventFiles(filePath, fileList);
    } else if (file.endsWith(".ts") || file.endsWith(".js")) {
      const relativePath = path.relative(path.join(process.cwd(), "src/events"), filePath);
      fileList.push(relativePath);
    }
  }
  return fileList;
}

export default async function eventsGraphCommand(opts) {
  const projectPath = process.cwd();
  const eventsDir = path.join(projectPath, "src/events");
  const format = opts.format || "mermaid";
  const output = opts.output;

  try {
    if (!(await fs.pathExists(eventsDir))) {
      console.log(chalk.yellow("No events directory found."));
      return;
    }

    const eventFiles = await findEventFiles(eventsDir);
    const graph = generateGraph(eventFiles, format);

    if (output) {
      await fs.writeFile(path.join(projectPath, output), graph);
      console.log(chalk.green(`\n✔ Graph saved to: ${output}\n`));
    } else {
      console.log(chalk.cyan("\n📊 Event Graph:\n"));
      console.log(graph);
      console.log();
    }
  } catch (error) {
    console.error(chalk.red(`✖ Error: ${error.message}`));
    process.exit(1);
  }
}

function generateGraph(eventFiles, format) {
  if (format === "mermaid") {
    return generateMermaidGraph(eventFiles);
  } else if (format === "dot") {
    return generateDotGraph(eventFiles);
  } else if (format === "json") {
    return JSON.stringify({ events: eventFiles }, null, 2);
  } else {
    return generateMermaidGraph(eventFiles);
  }
}

function generateMermaidGraph(eventFiles) {
  let graph = "graph TD\n";
  eventFiles.forEach((file, index) => {
    const eventName = file.replace(/\.(ts|js)$/, "").replace(/\//g, ".");
    graph += `    E${index}[${eventName}]\n`;
  });
  return graph;
}

function generateDotGraph(eventFiles) {
  let graph = "digraph Events {\n";
  eventFiles.forEach((file, index) => {
    const eventName = file.replace(/\.(ts|js)$/, "").replace(/\//g, ".");
    graph += `  E${index} [label="${eventName}"];\n`;
  });
  graph += "}\n";
  return graph;
}

