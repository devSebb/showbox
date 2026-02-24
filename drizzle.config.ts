import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    // Required for push/migrate commands; not used by generate
    url: process.env.DATABASE_URL ?? "",
  },
});
