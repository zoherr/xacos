import { existsSync, readdirSync } from "node:fs";
import { basename, resolve } from "node:path";

export interface ApiRouteFile {
  filePath: string;
  urlPrefix: string;
}

export function scanApiFiles(apiDir: string, prefix = "/api"): ApiRouteFile[] {
  const fullPath = resolve(apiDir);
  if (!existsSync(fullPath)) {
    return [];
  }

  const files = readdirSync(fullPath, { recursive: true }) as string[];

  return files
    .filter((file) => file.endsWith(".api.ts") || file.endsWith(".api.js"))
    .map((file) => {
      const name = basename(file).replace(/\.api\.(ts|js)$/u, "");
      const parts = name.split(".");
      const normalizedParts = parts.map((part) =>
        part.replace(/^\[(.+)\]$/u, ":$1"),
      );
      const urlPrefix = `${prefix}/${normalizedParts.join("/")}/`;

      return {
        filePath: resolve(fullPath, file),
        urlPrefix,
      };
    });
}

