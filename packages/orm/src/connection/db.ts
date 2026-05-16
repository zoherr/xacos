import knex, { type Knex } from "knex";
import mongoose from "mongoose";
import { buildKnexConfig } from "./drivers";
import { buildMongoUri } from "./mongoUri";

let knexInstance: Knex | null = null;

export type InitDbOptions =
  | { readonly __memorySqlite: true }
  | Knex.Config;

export function isKnexInitialized(): boolean {
  return knexInstance !== null;
}

export function isMongooseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export function initDb(config?: InitDbOptions): Knex {
  if (mongoose.connection.readyState === 1) {
    throw new Error("[XAOCS ORM] Cannot initialize Knex while Mongoose is connected. Call closeDb() first.");
  }

  const driver = process.env["DB_DRIVER"] ?? "sqlite";
  if (!config && driver === "mongodb") {
    throw new Error(
      "[XAOCS ORM] DB_DRIVER is mongodb: use await initMongo() for Mongoose. Knex SQL migrations are not used with MongoDB.",
    );
  }

  if (knexInstance) {
    return knexInstance;
  }

  let knexConfig: Knex.Config;
  if (config && typeof config === "object" && "__memorySqlite" in config && config.__memorySqlite) {
    knexConfig = {
      client: "sqlite3",
      connection: {
        filename: ":memory:",
      },
      useNullAsDefault: true,
    };
  } else if (config && typeof config === "object" && "client" in config) {
    knexConfig = config;
  } else {
    knexConfig = buildKnexConfig();
  }

  knexInstance = knex(knexConfig);
  return knexInstance;
}

export function getKnex(): Knex {
  if (knexInstance) {
    return knexInstance;
  }
  if (mongoose.connection.readyState === 1) {
    throw new Error(
      "[XAOCS ORM] Knex is not initialized; Mongoose is active. SQL helpers and MigrationRunner require Knex — with MongoDB define schemas on XMongoModel subclasses instead of migrations.",
    );
  }
  throw new Error("[XAOCS ORM] DB not initialized. Call initDb() or await initMongo() first.");
}

export type InitMongoOptions = Readonly<{
  uri?: string;
  /** Passed to `mongoose.connect` (pool size, timeouts, TLS, etc.). */
  connectOptions?: mongoose.ConnectOptions;
}>;

/**
 * Connect Mongoose (MongoDB). Does not use Knex; do not run SQL migrations — define schemas on {@link XMongoModel} instead.
 */
export async function initMongo(options?: InitMongoOptions): Promise<typeof mongoose> {
  if (knexInstance) {
    throw new Error("[XAOCS ORM] Cannot connect Mongoose while Knex is active. Call closeDb() first.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  const uri = options?.uri ?? buildMongoUri();
  const defaults: mongoose.ConnectOptions = {
    serverSelectionTimeoutMS: 10_000,
    maxPoolSize: 10,
  };
  await mongoose.connect(uri, { ...defaults, ...options?.connectOptions });
  return mongoose;
}

/**
 * Auto-select Knex vs Mongoose from `DB_DRIVER` (mongodb → Mongoose, otherwise → Knex).
 */
export async function initOrmFromEnv(): Promise<"knex" | "mongoose"> {
  const driver = process.env["DB_DRIVER"] ?? "sqlite";
  if (driver === "mongodb") {
    await initMongo();
    return "mongoose";
  }
  initDb();
  return "knex";
}

export function getMongoose(): typeof mongoose {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("[XAOCS ORM] Mongoose is not connected. Call await initMongo() first.");
  }
  return mongoose;
}

export async function closeDb(): Promise<void> {
  if (knexInstance) {
    await knexInstance.destroy();
    knexInstance = null;
  }
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

