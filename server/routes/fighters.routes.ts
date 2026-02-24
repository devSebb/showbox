import { Router } from "express";
import { storage } from "../storage";
import { insertFighterSchema } from "@shared/schema";
import { updateFighterSchema } from "@shared/types";

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
    const fighter = await storage.updateFighter(req.params.id, parsed.data);
    if (!fighter) {
      return res.status(404).json({ message: "Peleador no encontrado" });
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
