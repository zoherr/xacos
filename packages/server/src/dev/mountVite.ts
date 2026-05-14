import type { FastifyInstance } from 'fastify';
import { createViteConfig, ViewScanner } from '@xaocs/compiler';

import { createServer as createViteServer, type InlineConfig } from 'vite';

export async function mountViteDev(
  fastify: FastifyInstance,
  viewsDir: string,
  root: string
): Promise<void> {
  const scanner = new ViewScanner(viewsDir);
  const routes = scanner.scan();

  // Register routes in Fastify so it knows about them, 
  // even though Vite middleware will actually serve them.
  for (const route of routes) {
    fastify.get(route.path, async (request, reply) => {
      const mod = await vite.ssrLoadModule(route.filePath);
      
      if (mod['ssr'] === true) {
        const Component = mod.default;
        if (typeof Component !== 'function') {
           throw new Error(`[XAOCS] Page at ${route.filePath} does not have a default export component`);
        }
        
        // In dev mode, we still let Vite handle the HTML shell usually, 
        // but for a true SSR opt-in, we might want to render the component here.
        // For now, following the sprint goal: render to string if ssr=true.
        const { renderSSR } = await import('@xaocs/compiler');
        const { html, meta } = await renderSSR(route.filePath, {
          params: request.params as Record<string, string>,
          query: request.query as Record<string, string>,
        });

        // We need a basic HTML shell. For now, we'll return the rendered HTML.
        // Real implementation would inject into a template.
        reply.type('text/html').send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${meta.title ?? 'XAOCS App'}</title>
              ${meta.description ? `<meta name="description" content="${meta.description}">` : ''}
            </head>
            <body>
              <div id="root">${html}</div>
            </body>
          </html>
        `);
        return;
      }

      // The onRequest hook handles the actual Vite forwarding for non-SSR.
      return reply.callNotFound(); 
    });
  }


  const config = createViteConfig(viewsDir, root) as unknown as InlineConfig;
  const vite = await createViteServer(config);



  // Forward all non-API requests to Vite in dev mode
  fastify.addHook('onRequest', async (request, reply) => {
    const url = request.raw.url ?? '/';
    // Skip API routes — those are handled by XAOCS API router
    if (url.startsWith('/api/')) return;

    // Use Vite's connect-style middleware
    return new Promise<void>((resolve, reject) => {
      vite.middlewares(request.raw, reply.raw, (err: unknown) => {

        if (err) {
          reject(err);
        } else {
          // If Vite doesn't handle it, it will call next()
          // We don't really have a 'next' in Fastify onRequest hook in this way,
          // but resolve() lets Fastify continue.
          resolve();
        }
      });
    });
  });

  // Handle graceful shutdown
  fastify.addHook('onClose', async () => {
    await vite.close();
  });
}
