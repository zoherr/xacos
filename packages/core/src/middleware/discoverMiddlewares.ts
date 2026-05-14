import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import type { XMiddleware } from "@xaocs/shared";
import { middlewareRegistry } from "./MiddlewareRegistry";

export async function discoverMiddlewares(dir: string): Promise<void> {
  const fullPath = resolve(dir);
  if (!existsSync(fullPath)) return;

  const files = readdirSync(fullPath).filter((f) =>
    f.endsWith(".middleware.ts") || f.endsWith(".middleware.js"),
  );

  for (const file of files) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const mod = await import(join(fullPath, file));
      for (const [key, val] of Object.entries(mod)) {
        if (typeof val === "function") {
          middlewareRegistry.register(key, val as XMiddleware);
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to load middleware", file, err);
    }
  }
}
