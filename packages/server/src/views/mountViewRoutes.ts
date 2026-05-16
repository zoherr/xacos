import type { FastifyInstance } from 'fastify';
import { scanViews, extractPageMeta } from '@xacos/compiler';
import { buildHtmlShell } from './buildHtmlShell';
import { resolve } from 'path';

/**
 * Scans views and mounts GET routes for each page.
 * Each route serves the production HTML shell with hydrated chunks.
 */
export async function mountViewRoutes(
  fastify: FastifyInstance,
  viewsDir: string
): Promise<void> {
  const views = scanViews(viewsDir);

  for (const view of views) {
    // Import view to extract meta (Bun handles TS)
    const mod = await import(view.filePath);
    const meta = extractPageMeta(mod);

    fastify.get(view.urlPattern, async (_request, reply) => {
      const html = buildHtmlShell({
        chunkUrl: `/__xacos/${view.chunkName}.js`,
        meta: {
          title: meta.title,
          description: meta.description,
        },
      });

      return reply.type('text/html').send(html);
    });
  }
}

