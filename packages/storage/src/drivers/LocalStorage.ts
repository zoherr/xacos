import { promises as fs } from 'fs';
import path from 'path';
import type { Storage } from '../Storage';

export interface LocalStorageConfig {
  root: string; // Absolute path to storage root
  publicUrl?: string | undefined; // Base URL for public access
}

export class LocalStorage implements Storage {
  private root: string;
  private publicUrl: string;

  constructor(config: LocalStorageConfig) {
    this.root = config.root;
    this.publicUrl = config.publicUrl ?? '/storage';
  }

  private fullPath(filePath: string): string {
    return path.join(this.root, filePath);
  }

  async put(filePath: string, contents: string | Buffer): Promise<void> {
    const fullPath = this.fullPath(filePath);
    const dir = path.dirname(fullPath);
    
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, contents);
  }

  async get(filePath: string): Promise<Buffer | null> {
    try {
      return await fs.readFile(this.fullPath(filePath));
    } catch {
      return null;
    }
  }

  async delete(filePath: string): Promise<void> {
    try {
      await fs.unlink(this.fullPath(filePath));
    } catch {
      // Ignore if file doesn't exist
    }
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(this.fullPath(filePath));
      return true;
    } catch {
      return false;
    }
  }

  url(filePath: string): string {
    return `${this.publicUrl}/${filePath.replace(/\\/g, '/')}`;
  }

  async signedUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
    // Local driver doesn't support real signed URLs. We return the public URL.
    return this.url(filePath);
  }
}


