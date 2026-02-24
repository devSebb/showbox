import type { Express } from "express";
import type { Server } from "http";
import { requireAdmin } from "./middleware/requireAdmin";
import authRoutes from "./routes/auth.routes";
import publicRoutes from "./routes/public.routes";
import fightersRoutes from "./routes/fighters.routes";
import eventsRoutes from "./routes/events.routes";
import matchupsRoutes from "./routes/matchups.routes";
import sponsorsRoutes from "./routes/sponsors.routes";
import mediaRoutes from "./routes/media.routes";
import settingsRoutes from "./routes/settings.routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // Public routes (no auth required)
  app.use("/api/auth", authRoutes);
  app.use("/api/public", publicRoutes);

  // Admin routes (auth required)
  app.use("/api/fighters", requireAdmin, fightersRoutes);
  app.use("/api/events", requireAdmin, eventsRoutes);
  app.use("/api", requireAdmin, matchupsRoutes);
  app.use("/api/sponsors", requireAdmin, sponsorsRoutes);
  app.use("/api", requireAdmin, sponsorsRoutes); // handles /api/events/:eventId/sponsors
  app.use("/api/media", requireAdmin, mediaRoutes);
  app.use("/api/settings", requireAdmin, settingsRoutes);

  return httpServer;
}
