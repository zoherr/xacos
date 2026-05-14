import type { Knex } from "knex";

function mysqlConnection(): Knex.MySql2ConnectionConfig {
  const database = process.env["DB_DATABASE"];
  const user = process.env["DB_USERNAME"];
  const password = process.env["DB_PASSWORD"];
  if (!database || !user) {
    throw new Error("[XAOCS ORM] DB_DATABASE and DB_USERNAME are required for mysql driver");
  }
  return {
    host: process.env["DB_HOST"] ?? "localhost",
    port: Number(process.env["DB_PORT"] ?? 3306),
    database,
    user,
    password: password ?? "",
  };
}

function postgresConnection(): Knex.PgConnectionConfig {
  const database = process.env["DB_DATABASE"];
  const user = process.env["DB_USERNAME"];
  const password = process.env["DB_PASSWORD"];
  if (!database || !user) {
    throw new Error("[XAOCS ORM] DB_DATABASE and DB_USERNAME are required for postgres driver");
  }
  return {
    host: process.env["DB_HOST"] ?? "localhost",
    port: Number(process.env["DB_PORT"] ?? 5432),
    database,
    user,
    password: password ?? "",
  };
}

export function buildKnexConfig(): Knex.Config {
  const driver = process.env["DB_DRIVER"] ?? "sqlite";

  switch (driver) {
    case "mysql":
      return {
        client: "mysql2",
        connection: mysqlConnection(),
      };
    case "postgres":
      return {
        client: "pg",
        connection: postgresConnection(),
      };
    case "sqlite":
      return {
        client: "sqlite3",
        connection: {
          filename: process.env["DB_PATH"] ?? "./database/db.sqlite",
        },
        useNullAsDefault: true,
      };
    case "mongodb":
      throw new Error(
        "[XAOCS ORM] MongoDB does not use Knex. Set DB_DRIVER=mongodb and call await initMongo() (or initOrmFromEnv()). Define Mongoose schemas on XMongoModel subclasses — SQL migrations do not apply.",
      );
    default:
      throw new Error(`[XAOCS ORM] Unsupported driver: ${driver}`);
  }
}
