import { Router } from "express";
import { storage } from "../storage";
import { insertMatchupSchema } from "@shared/schema";
import { updateMatchupSchema, reorderMatchupsSchema } from "@shared/types";

const router = Router();

// GET /api/events/:eventId/matchups
router.get("/events/:eventId/matchups", async (req, res) => {
  try {
    const matchups = await storage.getMatchupsByEvent(req.params.eventId);
    res.json(matchups);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// POST /api/events/:eventId/matchups
router.post("/events/:eventId/matchups", async (req, res) => {
  try {
    const data = { ...req.body, eventId: req.params.eventId };
    const parsed = insertMatchupSchema.safeParse(data);
    if (!parsed.success) {
      return res.status(400).json({ message: "Datos inválidos", errors: parsed.error.flatten() });
    }
    const matchup = await storage.createMatchup(parsed.data);
    res.status(201).json(matchup);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// PUT /api/matchups/:id
router.put("/matchups/:id", async (req, res) => {
  try {
    const parsed = updateMatchupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Datos inválidos", errors: parsed.error.flatten() });
    }
    const matchup = await storage.updateMatchup(req.params.id, parsed.data);
    if (!matchup) {
      return res.status(404).json({ message: "Pelea no encontrada" });
    }
    res.json(matchup);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// DELETE /api/matchups/:id
router.delete("/matchups/:id", async (req, res) => {
  try {
    const deleted = await storage.deleteMatchup(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Pelea no encontrada" });
    }
    res.json({ message: "Pelea eliminada" });
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// PUT /api/events/:eventId/matchups/reorder
router.put("/events/:eventId/matchups/reorder", async (req, res) => {
  try {
    const parsed = reorderMatchupsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Datos inválidos", errors: parsed.error.flatten() });
    }
    await storage.reorderMatchups(parsed.data);
    const updated = await storage.getMatchupsByEvent(req.params.eventId);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

export default router;
