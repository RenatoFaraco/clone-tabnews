import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import { ServiceError } from "infra/errors.js";

async function runMigrations({ dryRun }) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      dryRun,
      dbClient,
      dir: resolve("infra", "migrations"),
      direction: "up",
      log: () => {},
      migrationsTable: "pgmigrations",
    });

    return migratedMigrations;
  } catch (error) {
    const operation = dryRun ? "list" : "run";
    throw new ServiceError({
      cause: error,
      message: `Falha durante ${operation} migrations`,
    });
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations: async () => runMigrations({ dryRun: true }),
  runPendingMigrations: async () => runMigrations({ dryRun: false }),
};

export default migrator;
