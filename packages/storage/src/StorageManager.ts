import type { XacosConfig } from '@xacos/config';
import type { Storage } from './Storage';
import { LocalStorage } from './drivers/LocalStorage';
import { S3Storage } from './drivers/S3Storage';

export class StorageManager {
  private drivers = new Map<string, Storage>();

  constructor(private config: XacosConfig['storage'] = {}) {}

  /**
   * Get a storage driver instance.
   */
  driver(name?: string): Storage {
    const driverName = name ?? this.config?.driver ?? 'local';

    if (this.drivers.has(driverName)) {
      return this.drivers.get(driverName)!;
    }

    const instance = this.createDriver(driverName);
    this.drivers.set(driverName, instance);
    return instance;
  }

  private createDriver(name: string): Storage {
    switch (name) {
      case 'local':
        const root = this.config?.local?.root ?? process.cwd() + '/storage';
        return new LocalStorage({
          root,
          publicUrl: this.config?.local?.publicUrl,
        });
      case 's3':
        if (!this.config?.s3) throw new Error('[XAOCS Storage] S3 config missing');
        return new S3Storage({
          region: this.config.s3.region,
          bucket: this.config.s3.bucket,
          key: this.config.s3.key,
          secret: this.config.s3.secret,
          publicUrl: this.config.s3.publicUrl,
        });
      default:
        throw new Error(`[XAOCS Storage] Unknown driver: ${name}`);
    }
  }

  // Proxy methods for default driver
  async put(filePath: string, contents: string | Buffer): Promise<void> {
    return this.driver().put(filePath, contents);
  }

  async get(filePath: string): Promise<Buffer | null> {
    return this.driver().get(filePath);
  }

  async delete(filePath: string): Promise<void> {
    return this.driver().delete(filePath);
  }

  async exists(filePath: string): Promise<boolean> {
    return this.driver().exists(filePath);
  }

  url(filePath: string): string {
    return this.driver().url(filePath);
  }

  async signedUrl(filePath: string, expiresIn?: number): Promise<string> {
    return this.driver().signedUrl(filePath, expiresIn);
  }
}


