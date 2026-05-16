import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { Storage } from '../Storage';


export interface S3StorageConfig {
  region: string;
  bucket: string;
  key: string;
  secret: string;
  publicUrl?: string | undefined; // Optional custom domain or CDN URL
}

export class S3Storage implements Storage {
  private client: S3Client;
  private bucket: string;
  private region: string;
  private publicUrl?: string | undefined;

  constructor(config: S3StorageConfig) {
    this.bucket = config.bucket;
    this.region = config.region;
    this.publicUrl = config.publicUrl;
    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.key,
        secretAccessKey: config.secret,
      },
    });
  }


  async put(filePath: string, contents: string | Buffer): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: filePath,
      Body: contents,
    });
    
    await this.client.send(command);
  }

  async get(filePath: string): Promise<Buffer | null> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: filePath,
    });

    try {
      const response = await this.client.send(command);
      if (!response.Body) return null;
      
      const byteArray = await response.Body.transformToByteArray();
      return Buffer.from(byteArray);
    } catch {
      return null;
    }
  }

  async delete(filePath: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: filePath,
    });
    
    try {
      await this.client.send(command);
    } catch {
      // Ignore errors like local storage driver
    }
  }

  async exists(filePath: string): Promise<boolean> {
    const command = new HeadObjectCommand({
      Bucket: this.bucket,
      Key: filePath,
    });

    try {
      await this.client.send(command);
      return true;
    } catch {
      return false;
    }
  }

  url(filePath: string): string {
    if (this.publicUrl) {
      return `${this.publicUrl}/${filePath.replace(/\\/g, '/')}`;
    }
    
    // Default AWS S3 URL format
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${filePath.replace(/\\/g, '/')}`;
  }

  async signedUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: filePath,
    });

    return await getSignedUrl(this.client, command, { expiresIn });
  }
}

