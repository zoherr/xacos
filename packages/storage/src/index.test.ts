import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { promises as fs } from "fs";
import path from "path";
import { LocalStorage } from "./drivers/LocalStorage";

const TEST_DIR = path.join(process.cwd(), "test-storage-tmp");

describe("LocalStorage", () => {
  let storage: LocalStorage;

  beforeEach(async () => {
    await fs.mkdir(TEST_DIR, { recursive: true });
    storage = new LocalStorage({ root: TEST_DIR });
  });

  afterEach(async () => {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  });

  it("puts and gets files", async () => {
    await storage.put("hello.txt", "world");
    const buf = await storage.get("hello.txt");
    expect(buf?.toString()).toBe("world");
  });

  it("checks existence", async () => {
    expect(await storage.exists("none.txt")).toBe(false);
    await storage.put("exist.txt", "yes");
    expect(await storage.exists("exist.txt")).toBe(true);
  });

  it("deletes files", async () => {
    await storage.put("del.txt", "gone");
    await storage.delete("del.txt");
    expect(await storage.exists("del.txt")).toBe(false);
  });

  it("generates urls", () => {
    expect(storage.url("foo/bar.jpg")).toBe("/storage/foo/bar.jpg");
  });

  it("generates signed urls", async () => {
    const url = await storage.signedUrl("foo/bar.jpg");
    expect(url).toBe("/storage/foo/bar.jpg");
  });
});


import { StorageManager } from "./StorageManager";

describe("StorageManager", () => {
  it("resolves default local driver", () => {
    const manager = new StorageManager();
    const driver = manager.driver();
    expect(driver).toBeInstanceOf(LocalStorage);
  });
});


