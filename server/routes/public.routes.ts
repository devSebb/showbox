import { Router } from "express";
import nodemailer from "nodemailer";
import { z } from "zod";
import { storage } from "../storage";
import type { MatchupWithFighters, EventWithMatchups } from "@shared/types";

const router = Router();

const CONTACT_TO = "zalam.showbox@gmail.com";

const contactFormSchema = z.object({
  name: z.string().min(1, "Nombre es requerido").max(200),
  email: z.string().email("Email inválido"),
  message: z.string().min(1, "Mensaje es requerido").max(5000),
});

// POST /api/public/contact — send contact form email (no auth)
router.post("/contact", async (req, res) => {
  try {
    const parsed = contactFormSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { name, email, message } = parsed.data;
    const user = process.env.CONTACT_SMTP_USER;
    const pass = process.env.CONTACT_SMTP_PASS;

    if (!user || !pass) {
      return res.status(503).json({
        message: "Servicio de contacto no configurado. Configure CONTACT_SMTP_USER y CONTACT_SMTP_PASS.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Showbox Contacto" <${user}>`,
      to: CONTACT_TO,
      replyTo: email,
      subject: `Contacto web: ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
      html: `
        <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        <p><strong>Mensaje:</strong></p>
        <pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(message)}</pre>
      `,
    });

    res.status(201).json({ message: "Mensaje enviado correctamente" });
  } catch (err) {
    console.error("Contact form send error:", err);
    res.status(500).json({ message: "Error al enviar el mensaje. Intenta más tarde." });
  }
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// GET /api/public/featured-event
router.get("/featured-event", async (_req, res) => {
  try {
    const event = await storage.getFeaturedEvent();
    if (!event) {
      return res.status(404).json({ message: "No hay evento destacado" });
    }

    const matchups = await storage.getMatchupsByEvent(event.id);
    const matchupsWithFighters: MatchupWithFighters[] = await Promise.all(
      matchups.map(async (m) => ({
        ...m,
        redCorner: m.redCornerId
          ? (await storage.getFighter(m.redCornerId)) ?? null
          : null,
        blueCorner: m.blueCornerId
          ? (await storage.getFighter(m.blueCornerId)) ?? null
          : null,
      })),
    );

    const eventSponsors = await storage.getEventSponsors(event.id);
    const sponsorsWithDetails = await Promise.all(
      eventSponsors.map(async (es) => ({
        ...es,
        sponsor: (await storage.getSponsor(es.sponsorId))!,
      })),
    );

    const result: EventWithMatchups = {
      ...event,
      matchups: matchupsWithFighters,
      sponsors: sponsorsWithDetails.filter((s) => s.sponsor),
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// GET /api/public/events
router.get("/events", async (_req, res) => {
  try {
    const events = await storage.getEvents({ status: "published" });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// GET /api/public/events/:slug
router.get("/events/:slug", async (req, res) => {
  try {
    const event = await storage.getEventBySlug(req.params.slug);
    if (!event || event.status !== "published") {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    const matchups = await storage.getMatchupsByEvent(event.id);
    const matchupsWithFighters: MatchupWithFighters[] = await Promise.all(
      matchups.map(async (m) => ({
        ...m,
        redCorner: m.redCornerId
          ? (await storage.getFighter(m.redCornerId)) ?? null
          : null,
        blueCorner: m.blueCornerId
          ? (await storage.getFighter(m.blueCornerId)) ?? null
          : null,
      })),
    );

    const eventSponsors = await storage.getEventSponsors(event.id);
    const sponsorsWithDetails = await Promise.all(
      eventSponsors.map(async (es) => ({
        ...es,
        sponsor: (await storage.getSponsor(es.sponsorId))!,
      })),
    );

    const result: EventWithMatchups = {
      ...event,
      matchups: matchupsWithFighters,
      sponsors: sponsorsWithDetails.filter((s) => s.sponsor),
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// GET /api/public/fighters
router.get("/fighters", async (req, res) => {
  try {
    const filters: { weightClass?: string; nationality?: string; isActive: boolean; isAmateur?: boolean } = {
      isActive: true,
    };
    if (req.query.weightClass) filters.weightClass = req.query.weightClass as string;
    if (req.query.nationality) filters.nationality = req.query.nationality as string;
    if (req.query.isAmateur !== undefined) filters.isAmateur = req.query.isAmateur === "true";

    const fighters = await storage.getFighters(filters);
    res.json(fighters);
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// GET /api/public/fighters/:id
router.get("/fighters/:id", async (req, res) => {
  try {
    const fighter = await storage.getFighter(req.params.id);
    if (!fighter || !fighter.isActive) {
      return res.status(404).json({ message: "Peleador no encontrado" });
    }

    // Get fighter's matchup history
    const allEvents = await storage.getEvents();
    const matchupHistory = [];
    for (const event of allEvents) {
      const matchups = await storage.getMatchupsByEvent(event.id);
      for (const m of matchups) {
        if (m.redCornerId === fighter.id || m.blueCornerId === fighter.id) {
          const opponentId =
            m.redCornerId === fighter.id ? m.blueCornerId : m.redCornerId;
          matchupHistory.push({
            ...m,
            event: {
              id: event.id,
              title: event.title,
              slug: event.slug,
              date: event.date,
            },
            opponent: opponentId
              ? (await storage.getFighter(opponentId)) ?? null
              : null,
            corner: (m.redCornerId === fighter.id ? "red" : "blue") as "red" | "blue",
          });
        }
      }
    }

    res.json({ ...fighter, matchups: matchupHistory });
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
});

// GET /api/public/settings
router.get("/settings", async (_req, res) => {
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

export default router;
