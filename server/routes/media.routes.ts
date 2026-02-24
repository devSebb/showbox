import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { storage } from "../storage";
import { isR2Configured, uploadToR2 } from "../services/r2";

const uploadDir = path.join(process.cwd(), "server", "uploads");

// Ensure upload directory exists (still needed for local fallback path)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  return map[mime] ?? ".jpg";
}

function resolveExt(originalname: string, mimetype: string): string {
  const fromName = path.extname(originalname).toLowerCase();
  return fromName || extFromMime(mimetype);
}

const upload = multer({
  storage: multer.memoryStorage(),
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

    const category = (req.body.category as string) || "general";
    let url: string;
    let filename: string;

    if (isR2Configured()) {
      // R2 path: all categories when R2 is configured
      const ext = resolveExt(req.file.originalname, req.file.mimetype);
      const { url: r2Url, key } = await uploadToR2(
        req.file.buffer,
        req.file.mimetype,
        ext,
        category,
      );
      url = r2Url;
      filename = key;
    } else {
      // Local disk fallback — ephemeral on Render, configure R2 for persistent media
      if (process.env.NODE_ENV === "production") {
        console.warn("[media] R2 not configured — uploaded file will be lost on server restart");
      }
      const ext = resolveExt(req.file.originalname, req.file.mimetype);
      filename = `${randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, filename);
      await fs.promises.writeFile(filePath, req.file.buffer);
      url = `/uploads/${filename}`;
    }

    const mediaItem = await storage.createMedia({
      filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url,
      alt: (req.body.alt as string) || null,
      category,
    });

    res.status(201).json(mediaItem);
  } catch (err) {
    console.error("[media/upload] Error:", err);
    res.status(500).json({ message: "Error al subir imagen al almacenamiento" });
  }
});

// DELETE /api/media/:id
router.delete("/:id", async (req, res) => {
  try {
    const mediaItem = await storage.getMedia(req.params.id);
    if (!mediaItem) {
      return res.status(404).json({ message: "Media no encontrada" });
    }

    // Delete file from disk (no-op if filename is an R2 key or file doesn't exist)
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
