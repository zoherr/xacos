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

  return value;
}

