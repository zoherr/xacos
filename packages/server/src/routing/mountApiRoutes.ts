import { pathToFileURL } from "node:url";
import type { FastifyInstance } from "fastify";
import type { XApp } from "@xaocs/shared";
import { scanApiFiles } from "@xaocs/core";
import { adaptRequest, adaptResponse } from "../adapters/RequestAdapter";
import { compose } from "@xaocs/core";

export async function mountApiRoutes(
  fastify: FastifyInstance,
  apiDir: string,
  app: XApp,
): Promise<void> {
  const files = scanApiFiles(apiDir);

  for (const { filePath, urlPrefix } of files) {
    // Dynamic import of the file module
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const mod = await import(pathToFileURL(filePath).href);
      const router = mod?.router;
      if (!router) continue;

      for (const route of router.routes) {
        const routePath = route.path === "/" ? "" : route.path;
        const fullPath = `${urlPrefix}${routePath}`;

        fastify.route({
          method: route.method,
          url: fullPath,
          handler: async (request, reply) => {
            const req = adaptRequest(request, app);
            const res = adaptResponse(reply);

            if (route.middlewares?.length) {
              const pipeline = compose(route.middlewares);
              await pipeline(req, res);
            }

            await route.handler(req, res);
            if (!reply.sent) {
              return reply;
            }
          },
        });
      }
    } catch (err) {
      // Don't crash mount process; log and continue
      // eslint-disable-next-line no-console
      console.error("Failed to mount API file", filePath, err);
    }
  }
}
