import { Router } from "express";
import { storage } from "../storage";
import { batchSettingsSchema } from "@shared/types";

const router = Router();

// GET /api/settings
router.get("/", async (_req, res) => {
  try {
    const settings = await storage.getAllSettings();
    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// PUT /api/settings
router.put("/", async (req, res) => {
  try {
    const parsed = batchSettingsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Datos inválidos", errors: parsed.error.flatten() });
    }
    const updated = await storage.batchUpdateSettings(parsed.data);
    const result: Record<string, string> = {};
    for (const s of updated) {
      result[s.key] = s.value;
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

export default router;
