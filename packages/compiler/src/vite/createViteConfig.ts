import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export function createViteConfig(viewsDir: string, root: string): UserConfig {
  return defineConfig({
    root,
    plugins: [react()],
    server: {
      middlewareMode: true, // XAOCS handles the HTTP server
    },
    resolve: {
      alias: {
        '@views': resolve(viewsDir),
        '@app': resolve('./app'),
        '@api': resolve('./api'),
        '@db': resolve('./database'),
      },
    },
    build: {
      outDir: resolve('./.xaocs/client'),
      rollupOptions: {
        input: {}, // filled dynamically per page in later sprints
      },
    },
  });
}
