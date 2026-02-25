/**
 * One-off script to create the admin user if missing.
 * Use when the initial seed skipped admin creation (e.g. ADMIN_INITIAL_PASSWORD
 * wasn't set on first deploy).
 *
 * Run: ADMIN_INITIAL_PASSWORD=yourpassword npx tsx script/seed-admin.ts
 *
 * On Render: Dashboard → Your Service → Shell → run the command with env vars set.
 */

import { runMigrations, closeDb } from "../server/db";
import { storage } from "../server/storage";
import { hashPassword } from "../server/auth";

async function main() {
  await runMigrations();
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!password) {
    console.error("Set ADMIN_INITIAL_PASSWORD and run again.");
    process.exit(1);
  }

  const existing = await storage.getUserByUsername("admin");
  if (existing) {
    console.log("Admin user already exists. Nothing to do.");
    await closeDb();
    process.exit(0);
  }

  const hashed = await hashPassword(password);
  await storage.createUser({ username: "admin", password: hashed });
  console.log("Admin user created. Username: admin. Login at /admin/login");
  await closeDb();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
