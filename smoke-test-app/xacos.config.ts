import { defineConfig } from '@xacos/config';

export default defineConfig({
  port: Number(process.env['APP_PORT']) || 5000,
  views: { dir: './views', defaultLayout: 'main' },
  api: { prefix: '/api', dir: './api' },
});
