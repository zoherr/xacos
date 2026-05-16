import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { XContainer } from "../container/XContainer";

type Constructable = new (...args: readonly unknown[]) => unknown;

type ServiceModuleValue = {
  inject?: readonly string[];
} & Constructable;

function isServiceExport(name: string, value: unknown): value is ServiceModuleValue {
  return typeof value === "function" && name.endsWith("Service");
}

export async function discoverServices(
  container: XContainer,
  servicesDir: string,
): Promise<void> {
  const fullPath = resolve(servicesDir);

  let files: string[];
  try {
    files = readdirSync(fullPath).filter(
      (file: string) => file.endsWith(".ts") || file.endsWith(".js"),
    );
  } catch {
    return;
  }

  for (const file of files) {
    const mod = (await import(join(fullPath, file))) as Record<string, unknown>;

    for (const [exportName, exportedValue] of Object.entries(mod)) {
      if (!isServiceExport(exportName, exportedValue) || container.has(exportName)) {
        continue;
      }

      container.singleton(exportName, () => {
        const inject = exportedValue.inject ?? [];
        const deps = inject.map((key) => container.make<unknown>(key));
        return new exportedValue(...deps);
      });
    }
  }
}

