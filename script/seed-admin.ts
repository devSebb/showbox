/**
 * Create or reset the admin user.
 *
 * Create (if missing):
 *   ADMIN_INITIAL_PASSWORD=yourpassword npx tsx script/seed-admin.ts
 *
 * Reset password (if admin exists, e.g. you're locked out):
 *   ADMIN_INITIAL_PASSWORD=newpassword npx tsx script/seed-admin.ts --reset
 *
 * On Render: Dashboard → Your Service → Shell → run with env vars set.
 */

import { eq } from "drizzle-orm";
import { runMigrations, closeDb } from "../server/db";
import { db } from "../server/db";
import * as schema from "../shared/schema";
import { storage } from "../server/storage";
import { hashPassword } from "../server/auth";

async function main() {
  await runMigrations();

  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!password) {
    console.error("Set ADMIN_INITIAL_PASSWORD and run again.");
    process.exit(1);
  }

  const reset = process.argv.includes("--reset");
  const existing = await storage.getUserByUsername("admin");

  if (existing) {
    if (reset) {
      const hashed = await hashPassword(password);
      if (!db) throw new Error("Database not connected");
      await db
        .update(schema.users)
        .set({ password: hashed })
        .where(eq(schema.users.username, "admin"));
      console.log("Admin password reset. Username: admin. Login at /admin/login");
    } else {
      console.log("Admin user already exists. Use --reset to change the password.");
    }
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
