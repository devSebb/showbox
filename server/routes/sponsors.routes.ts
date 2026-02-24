import { Router } from "express";
import { storage } from "../storage";
import { insertSponsorSchema } from "@shared/schema";
import { updateSponsorSchema } from "@shared/types";

const router = Router();

// GET /api/sponsors
router.get("/", async (_req, res) => {
  try {
    const sponsors = await storage.getSponsors();
    res.json(sponsors);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// POST /api/sponsors
router.post("/", async (req, res) => {
  try {
    const parsed = insertSponsorSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Datos inválidos", errors: parsed.error.flatten() });
    }
    const sponsor = await storage.createSponsor(parsed.data);
    res.status(201).json(sponsor);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// PUT /api/sponsors/:id
router.put("/:id", async (req, res) => {
  try {
    const parsed = updateSponsorSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Datos inválidos", errors: parsed.error.flatten() });
    }
    const sponsor = await storage.updateSponsor(req.params.id, parsed.data);
    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor no encontrado" });
    }
    res.json(sponsor);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// DELETE /api/sponsors/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await storage.deleteSponsor(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Sponsor no encontrado" });
    }
    res.json({ message: "Sponsor eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// POST /api/events/:eventId/sponsors
router.post("/events/:eventId/sponsors", async (req, res) => {
  try {
    const { sponsorId, tier } = req.body;
    if (!sponsorId) {
      return res.status(400).json({ message: "sponsorId es requerido" });
    }
    const es = await storage.addEventSponsor({
      eventId: req.params.eventId,
      sponsorId,
      tier,
    });
    res.status(201).json(es);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// DELETE /api/events/:eventId/sponsors/:sponsorId
router.delete("/events/:eventId/sponsors/:sponsorId", async (req, res) => {
  try {
    const removed = await storage.removeEventSponsor(
      req.params.eventId,
      req.params.sponsorId,
    );
    if (!removed) {
      return res.status(404).json({ message: "Asignación no encontrada" });
    }
    res.json({ message: "Sponsor removido del evento" });
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

export default router;
