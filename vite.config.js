import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

export default defineConfig({
  plugins: [react(), {
    name: 'static-preview-404',
    configurePreviewServer(server) {
      return () => server.middlewares.use(async (request, response, next) => {
        const root = resolve('dist');
        const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
        const file = resolve(root, '.' + pathname, pathname.endsWith('/') ? 'index.html' : '');
        if (file.startsWith(root + sep)) {
          try { if ((await stat(file)).isFile()) return next(); } catch { /* Continue to the static not-found page. */ }
        }
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        try { response.end(await readFile('dist/404.html')); }
        catch { response.end('Page not found'); }
      });
    },
  }],
  appType: 'mpa',
  server: { port: 5173 },
});
