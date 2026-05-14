import { resolve } from 'path';
import { existsSync, readdirSync } from 'fs';
import type { Seeder } from './Seeder';

export class SeederRunner {
  constructor(private seedersDir: string) {}

  /**
   * Run a specific seeder by class name.
   * e.g. runOne('UserSeeder')
   */
  async runOne(name: string): Promise<void> {
    const path = resolve(this.seedersDir, `${name}.ts`);
    const jsPath = resolve(this.seedersDir, `${name}.js`);
    
    let targetPath = path;
    if (!existsSync(path)) {
      if (existsSync(jsPath)) {
        targetPath = jsPath;
      } else {
        throw new Error(`[XAOCS] Seeder not found: ${name} at ${path}`);
      }
    }

    const mod = await import(targetPath);
    const SeederClass: new () => Seeder = mod.default ?? mod[name];
    
    if (!SeederClass) {
      throw new Error(`[XAOCS] Seeder class not exported from ${name}.ts`);
    }

    const instance = new SeederClass();
    console.log(`  ▶ Running seeder: ${name}`);
    await instance.run();
    console.log(`  ✓ Done: ${name}`);
  }

  /**
   * Run all seeders in the seeders directory, in alphabetical order.
   */
  async runAll(): Promise<void> {
    const files = this.getSortedFiles();
    if (files.length === 0) {
      console.log('[XAOCS] No seeder files found.');
      return;
    }
    
    for (const file of files) {
      const name = file.replace(/\.(ts|js)$/, '');
      await this.runOne(name);
    }
  }

  /**
   * Scan the seeders directory and return file names sorted correctly.
   * Files prefixed with numbers sort numerically: 001_, 002_, etc.
   * Files without prefix sort alphabetically after numbered ones.
   */
  private getSortedFiles(): string[] {
    const fullPath = resolve(this.seedersDir);
    if (!existsSync(fullPath)) return [];

    return readdirSync(fullPath)
      .filter((f: string) => f.endsWith('.ts') || f.endsWith('.js'))
      .sort((a: string, b: string) => {
        // Extract leading number if present: "001_UserSeeder.ts" → 1
        const numA = parseInt(a.match(/^(\d+)/)?.[1] ?? 'Infinity', 10);
        const numB = parseInt(b.match(/^(\d+)/)?.[1] ?? 'Infinity', 10);
        
        if (numA !== numB) return numA - numB;
        return a.localeCompare(b);
      });
  }
}

