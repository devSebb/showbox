import { Router } from "express";
import { storage } from "../storage";
import { insertFighterSchema } from "@shared/schema";
import { updateFighterSchema } from "@shared/types";
import { deleteFromR2 } from "../services/r2";

const router = Router();

// GET /api/fighters
router.get("/", async (_req, res) => {
  try {
    const fighters = await storage.getFighters();
    res.json(fighters);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// POST /api/fighters
router.post("/", async (req, res) => {
  try {
    const parsed = insertFighterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Datos inválidos", errors: parsed.error.flatten() });
    }
    const fighter = await storage.createFighter(parsed.data);
    res.status(201).json(fighter);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// PUT /api/fighters/:id
router.put("/:id", async (req, res) => {
  try {
    const parsed = updateFighterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Datos inválidos", errors: parsed.error.flatten() });
    }

    // Fetch existing record before update to capture current image URLs for R2 cleanup
    const existing = await storage.getFighter(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Peleador no encontrado" });
    }

    const fighter = await storage.updateFighter(req.params.id, parsed.data);
    if (!fighter) {
      return res.status(404).json({ message: "Peleador no encontrado" });
    }

    // R2 cleanup: fire-and-forget for changed image fields
    const { photoUrl: newPhoto, photoAction: newAction } = parsed.data;

    if (newPhoto !== undefined && newPhoto !== existing.photoUrl && existing.photoUrl) {
      deleteFromR2(existing.photoUrl).catch((e) =>
        console.error("[R2] photoUrl cleanup error:", e),
      );
    }
    if (newAction !== undefined && newAction !== existing.photoAction && existing.photoAction) {
      deleteFromR2(existing.photoAction).catch((e) =>
        console.error("[R2] photoAction cleanup error:", e),
      );
    }

    res.json(fighter);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// DELETE /api/fighters/:id (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await storage.deleteFighter(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Peleador no encontrado" });
    }
    res.json({ message: "Peleador desactivado" });
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

export default router;
