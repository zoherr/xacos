import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import type { FastifyInstance } from "fastify";
import type { XApp } from "@xacos/shared";
import { scanApiFiles, compose } from "@xacos/core";
import { adaptRequest, adaptResponse } from "../adapters/RequestAdapter";
import { validate, ValidationError } from "@xacos/validation";
import { log } from "../Logger";

interface ActiveRouteMeta {
  route: any;
  pipeline: any;
}

// WeakMap scoping route registries per Fastify instance
const serverRoutesRegistry = new WeakMap<FastifyInstance, Map<string, ActiveRouteMeta>>();
// Track if chokidar watcher is already initialized for this fastify instance
const activeWatchers = new WeakSet<FastifyInstance>();

export async function mountApiRoutes(
  fastify: FastifyInstance,
  apiDir: string,
  app: XApp,
): Promise<void> {
  let activeRoutesRegistry = serverRoutesRegistry.get(fastify);
  if (!activeRoutesRegistry) {
    activeRoutesRegistry = new Map<string, ActiveRouteMeta>();
    serverRoutesRegistry.set(fastify, activeRoutesRegistry);
  }

  const files = scanApiFiles(apiDir);

  for (const { filePath, urlPrefix } of files) {
    try {
      const mod = await import(pathToFileURL(filePath).href);
      const router = mod?.router;
      if (!router) continue;

      for (const route of router.routes) {
        const routePath = route.path === "/" ? "" : route.path;
        const fullPath = `${urlPrefix}${routePath}`.replace(/\/+/g, "/");
        const pipeline = route.middlewares && route.middlewares.length ? compose(route.middlewares) : null;
        const routeKey = `${route.method}:${fullPath}`;

        if (activeRoutesRegistry.has(routeKey)) {
          activeRoutesRegistry.set(routeKey, { route, pipeline });
        } else {
          activeRoutesRegistry.set(routeKey, { route, pipeline });

          fastify.route({
            method: route.method,
            url: fullPath,
            handler: async (request, reply) => {
              // Ensure we retrieve from the instance-scoped registry at request time
              const registry = serverRoutesRegistry.get(fastify);
              const meta = registry?.get(routeKey);
              if (!meta) {
                void reply.code(404);
                return { error: "Route not found" };
              }
              const currentRoute = meta.route;
              const currentPipeline = meta.pipeline;

              const req = adaptRequest(request, app);
              const res = adaptResponse(reply);

              try {
                if (currentRoute.schema) {
                  if (currentRoute.schema.body) validate(req.body, currentRoute.schema.body);
                  if (currentRoute.schema.query) validate(req.query as unknown, currentRoute.schema.query);
                  if (currentRoute.schema.params) validate(req.params as unknown, currentRoute.schema.params);
                }

                if (currentPipeline) {
                  await currentPipeline(req, res);
                }

                await currentRoute.handler(req, res);
                if ((res as unknown as { _payload?: unknown })._payload !== undefined) {
                  return (res as unknown as { _payload: unknown })._payload;
                }
              } catch (e) {
                if (e instanceof ValidationError) {
                  void reply.code(e.statusCode);
                  return { errors: e.errors };
                }
                throw e;
              }
            },
          });
        }
      }
    } catch (err) {
      console.error("IMPORT ERROR:", err);
      log.error(`Failed to mount API file ${filePath}: ${(err as Error).message}`);
    }
  }

  if (process.env["APP_ENV"] !== "production" && !activeWatchers.has(fastify)) {
    activeWatchers.add(fastify);
    try {
      const chokidar = await import("chokidar");
      const watcher = chokidar.watch([apiDir, resolve(apiDir, "../app")], {
        ignoreInitial: true,
      });

      fastify.addHook("onClose", async () => {
        await watcher.close();
        activeWatchers.delete(fastify);
      });

      watcher.on("all", (event, path) => {
        log.info(`[HMR] Detected change in ${path} (${event})`);
        void (async () => {
          try {
            const registry = serverRoutesRegistry.get(fastify);
            if (!registry) return;

            const updatedFiles = scanApiFiles(apiDir);
            for (const { filePath, urlPrefix } of updatedFiles) {
              const mod = await import(pathToFileURL(filePath).href + "?t=" + Date.now());
              const router = mod?.router;
              if (!router) continue;

              for (const route of router.routes) {
                const routePath = route.path === "/" ? "" : route.path;
                const fullPath = `${urlPrefix}${routePath}`.replace(/\/+/g, "/");
                const pipeline = route.middlewares && route.middlewares.length ? compose(route.middlewares) : null;
                const routeKey = `${route.method}:${fullPath}`;

                if (registry.has(routeKey)) {
                  registry.set(routeKey, { route, pipeline });
                  log.info(`[HMR] Hot-swapped route ${route.method} ${fullPath}`);
                } else {
                  registry.set(routeKey, { route, pipeline });
                  log.info(`[HMR] Registered new route ${route.method} ${fullPath}`);
                }
              }
            }
          } catch (err) {
            log.error(`[HMR] Failed to hot-reload routes: ${(err as Error).message}`);
          }
        })();
      });
    } catch (err) {
      log.error(`[HMR] Failed to initialize chokidar: ${(err as Error).message}`);
    }
  }
}

