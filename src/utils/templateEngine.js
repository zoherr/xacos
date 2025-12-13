import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Simple template engine that replaces placeholders in template files
 * @param {string} templatePath - Path to template file
 * @param {object} variables - Variables to replace in template
 * @returns {Promise<string>} - Processed template content
 */
export async function processTemplate(templatePath, variables = {}) {
  try {
    const templateContent = await fs.readFile(templatePath, "utf-8");
    return replaceVariables(templateContent, variables);
  } catch (error) {
    throw new Error(`Failed to read template: ${templatePath} - ${error.message}`);
  }
}

/**
 * Replace variables in template string
 * @param {string} content - Template content
 * @param {object} variables - Variables to replace
 * @returns {string} - Processed content
 */
function replaceVariables(content, variables) {
  let result = content;
  
  // Replace all {{variable}} patterns
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, value);
  }
  
  return result;
}

/**
 * Get template path
 * @param {string} templateName - Name of template file
 * @param {string} category - Template category (base, modules, features, config, utils)
 * @returns {string} - Full path to template
 */
export function getTemplatePath(templateName, category = "base") {
  return path.join(__dirname, "..", "templates", category, templateName);
}

/**
 * Process and write template to destination
 * @param {string} templatePath - Path to template
 * @param {string} destinationPath - Path to write processed template
 * @param {object} variables - Variables to replace
 */
export async function generateFromTemplate(templatePath, destinationPath, variables = {}) {
  const content = await processTemplate(templatePath, variables);
  await fs.ensureDir(path.dirname(destinationPath));
  await fs.writeFile(destinationPath, content);
}

