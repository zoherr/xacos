import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { SeederRunner } from './SeederRunner';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { resolve } from 'path';

const TMP = resolve('./tmp-seeders-test');

describe('SeederRunner', () => {
  beforeEach(() => {
    mkdirSync(TMP, { recursive: true });
    writeFileSync(
      `${TMP}/TestSeeder.ts`,
      `export default class TestSeeder { async run() { (global as any).__seederRan = true; } }`
    );
  });

  afterEach(() => rmSync(TMP, { recursive: true, force: true }));

  it('throws when seeder file does not exist', async () => {
    const runner = new SeederRunner(TMP);
    await expect(runner.runOne('NonExistent')).rejects.toThrow('Seeder not found');
  });

  it('runs a single seeder', async () => {
    const runner = new SeederRunner(TMP);
    (global as any).__seederRan = false;
    await runner.runOne('TestSeeder');
    expect((global as any).__seederRan).toBe(true);
  });

  it('runs all seeders in directory', async () => {
    writeFileSync(
      `${TMP}/AnotherSeeder.ts`,
      `export default class AnotherSeeder { async run() { (global as any).__anotherRan = true; } }`
    );
    const runner = new SeederRunner(TMP);
    (global as any).__seederRan = false;
    (global as any).__anotherRan = false;
    await runner.runAll();
    expect((global as any).__seederRan).toBe(true);
    expect((global as any).__anotherRan).toBe(true);
  });

  it('sorts seeders: numbered before alpha', async () => {
    // create files in reverse to ensure sorting matters
    writeFileSync(`${TMP}/ZebraSeeder.ts`, 'export default class ZebraSeeder { async run() { (global as any).__order.push("zebra"); } }');
    writeFileSync(`${TMP}/001_UserSeeder.ts`, 'export default class UserSeeder { async run() { (global as any).__order.push("user"); } }');
    writeFileSync(`${TMP}/002_PostSeeder.ts`, 'export default class PostSeeder { async run() { (global as any).__order.push("post"); } }');
    
    const runner = new SeederRunner(TMP);
    (global as any).__order = [];
    
    // We need to clear out the default seeders created in beforeEach if they interfere
    rmSync(resolve(TMP, 'TestSeeder.ts'));
    
    await runner.runAll();
    
    expect((global as any).__order).toEqual(['user', 'post', 'zebra']);
  });
});


