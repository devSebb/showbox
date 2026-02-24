import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";
import path from "path";
import fs from "fs";

export const pgPool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

export const db = pgPool ? drizzle(pgPool, { schema }) : null;

export async function closeDb(): Promise<void> {
  if (pgPool) {
    await pgPool.end();
  }
}

export async function runMigrations(): Promise<void> {
  if (!db || !pgPool) {
    console.log("[db] no DATABASE_URL, skipping migrations");
    return;
  }

  const migrationsFolder = path.join(process.cwd(), "migrations");
  if (!fs.existsSync(migrationsFolder)) {
    console.warn(
      "[db] migrations folder not found — run `npm run db:generate` locally and commit the migrations/ folder before deploying",
    );
    return;
  }

  const { migrate } = await import("drizzle-orm/node-postgres/migrator");
  await migrate(db, { migrationsFolder });
  console.log("[db] migrations applied successfully");
}
