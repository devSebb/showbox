import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { storage } from "../storage";

const uploadDir = path.join(process.cwd(), "server", "uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const uploadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes"));
    }
  },
});

const router = Router();

// GET /api/media
router.get("/", async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    const mediaList = await storage.getMediaList(category);
    res.json(mediaList);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// POST /api/media/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se envió ningún archivo" });
    }

    const mediaItem = await storage.createMedia({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      alt: (req.body.alt as string) || null,
      category: (req.body.category as string) || "general",
    });

    res.status(201).json(mediaItem);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// DELETE /api/media/:id
router.delete("/:id", async (req, res) => {
  try {
    const mediaItem = await storage.getMedia(req.params.id);
    if (!mediaItem) {
      return res.status(404).json({ message: "Media no encontrada" });
    }

    // Delete file from disk
    const filePath = path.join(uploadDir, mediaItem.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await storage.deleteMedia(req.params.id);
    res.json({ message: "Media eliminada" });
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

export default router;
