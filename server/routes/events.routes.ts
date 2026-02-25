import { Router } from "express";
import { storage } from "../storage";
import { insertEventSchema } from "@shared/schema";
import { updateEventSchema } from "@shared/types";

const router = Router();

// GET /api/events
router.get("/", async (_req, res) => {
  try {
    const events = await storage.getEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// POST /api/events
router.post("/", async (req, res) => {
  try {
    const parsed = insertEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Datos inválidos", errors: parsed.error.flatten() });
    }
    const event = await storage.createEvent(parsed.data);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// PUT /api/events/:id
router.put("/:id", async (req, res) => {
  try {
    const parsed = updateEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Datos inválidos", errors: parsed.error.flatten() });
    }
    const event = await storage.updateEvent(req.params.id, parsed.data);
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// DELETE /api/events/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await storage.deleteEvent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    res.json({ message: "Evento eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// GET /api/events/:id/sponsors
router.get("/:id/sponsors", async (req, res) => {
  try {
    const eventSponsors = await storage.getEventSponsors(req.params.id);
    const withDetails = await Promise.all(
      eventSponsors.map(async (es) => ({
        ...es,
        sponsor: await storage.getSponsor(es.sponsorId),
      })),
    );
    res.json(withDetails.filter((es) => es.sponsor));
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// PUT /api/events/:id/feature
router.put("/:id/feature", async (req, res) => {
  try {
    const event = await storage.setFeaturedEvent(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

export default router;
