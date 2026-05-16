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
        '@app': resolve(root, 'app'),
        '@api': resolve(root, 'api'),
        '@db': resolve(root, 'database'),
      },
    },
    build: {
      outDir: resolve('./.xacos/client'),
      rollupOptions: {
        input: {}, // filled dynamically per page in later sprints
      },
    },
  });
}

