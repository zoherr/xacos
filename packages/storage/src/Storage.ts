/**
 * Unified storage interface for local files and cloud object storage (S3).
 */
export interface Storage {
  /**
   * Store a file.
   * @param path Destination path/key.
   * @param contents File contents (string, Buffer, etc.).
   */
  put(path: string, contents: string | Buffer): Promise<void>;

  /**
   * Retrieve file contents as a Buffer.
   */
  get(path: string): Promise<Buffer | null>;

  /**
   * Delete a file.
   */
  delete(path: string): Promise<void>;

  /**
   * Check if a file exists.
   */
  exists(path: string): Promise<boolean>;

  /**
   * Get a public URL for the file.
   */
  url(path: string): string;

  /**
   * Get a temporary signed URL for private files.
   * @param path The file path.
   * @param expiresIn Expiration time in seconds (default: 3600).
   */
  signedUrl(path: string, expiresIn?: number): Promise<string>;
}


