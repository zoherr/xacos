export function loadEnv(path = ".env"): void {
  if (typeof (process as typeof process & { loadEnvFile?: (p: string) => void }).loadEnvFile === "function") {
    (process as typeof process & { loadEnvFile?: (p: string) => void }).loadEnvFile?.(path);
  }
}

export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`[XAOCS Config] Missing env var: ${key}`);
  }

  if (key === "JWT_SECRET" && value.length < 32) {
    throw new Error(
      `[XAOCS Config] JWT_SECRET must be at least 32 characters long. ` +
        `Current length: ${value.length}. ` +
        `Generate one with: openssl rand -base64 32`
    );
  }

  return value;
}

