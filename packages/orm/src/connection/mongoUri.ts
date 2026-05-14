/**
 * Builds a Mongo connection URI from env.
 * Prefer `MONGODB_URI` or `DATABASE_URL` when set.
 */
export function buildMongoUri(): string {
  const direct = process.env["MONGODB_URI"] ?? process.env["DATABASE_URL"];
  if (direct) {
    return direct;
  }

  const user = process.env["DB_USERNAME"] ?? "";
  const password = process.env["DB_PASSWORD"] ?? "";
  const host = process.env["DB_HOST"] ?? "localhost";
  const port = process.env["DB_PORT"] ?? "27017";
  const database = process.env["DB_DATABASE"] ?? "xaocs";

  if (user) {
    const u = encodeURIComponent(user);
    const p = encodeURIComponent(password);
    return `mongodb://${u}:${p}@${host}:${port}/${database}`;
  }

  return `mongodb://${host}:${port}/${database}`;
}
