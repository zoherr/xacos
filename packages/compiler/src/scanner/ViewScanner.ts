import { readdirSync, existsSync, statSync } from 'fs';
import { join, relative, sep } from 'path';

export interface ViewRoute {
  path: string;        // URL path, e.g., "/users/:id"
  urlPattern: string;  // Alias for path, used in production bundling
  filePath: string;    // Absolute file path
  chunkName: string;   // Sanitized name for JS chunk
}


export class ViewScanner {
  constructor(private viewsDir: string) {}

  /**
   * Scan the views directory and return a list of routes.
   * Maps "index.tsx" -> "/", "about.tsx" -> "/about", "[id].tsx" -> "/:id"
   */
  scan(): ViewRoute[] {
    if (!existsSync(this.viewsDir)) return [];
    
    const routes: ViewRoute[] = [];
    this.walk(this.viewsDir, routes);
    return routes;
  }

  private walk(dir: string, routes: ViewRoute[]) {
    const files = readdirSync(dir);

    for (const file of files) {
      const fullPath = join(dir, file);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        this.walk(fullPath, routes);
      } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        const path = this.pathToRoute(fullPath);
        routes.push({
          path,
          urlPattern: path,
          filePath: fullPath,
          chunkName: this.deriveChunkName(path),
        });
      }

    }
  }

  private pathToRoute(filePath: string): string {
    let rel = relative(this.viewsDir, filePath)
      .replace(/\.(tsx|jsx)$/, '')
      .replace(/\\/g, '/'); // ensure forward slashes

    // Handle "index" files
    if (rel === 'index') return '/';
    if (rel.endsWith('/index')) rel = rel.slice(0, -6);

    // Handle dynamic segments: [id] -> :id
    rel = rel.replace(/\[([^\]]+)\]/g, ':$1');

    return rel.startsWith('/') ? rel : '/' + rel;
  }

  private deriveChunkName(urlPattern: string): string {
    return urlPattern
      .replace(/^\//, '')
      .replace(/\//g, '_')
      .replace(/:/g, '')
      .replace(/[^a-zA-Z0-9_]/g, '') || 'index';
  }
}

