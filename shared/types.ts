import { z } from "zod";
import {
  insertFighterSchema,
  insertEventSchema,
  insertMatchupSchema,
  insertSponsorSchema,
  insertMediaSchema,
  type Fighter,
  type Event,
  type Matchup,
  type Sponsor,
  type EventSponsor,
  type Media,
  type Setting,
} from "./schema";

// ─── Validation Schemas ─────────────────────────────────

export const updateFighterSchema = insertFighterSchema.partial();
export type UpdateFighter = z.infer<typeof updateFighterSchema>;

export const updateEventSchema = insertEventSchema.partial();
export type UpdateEvent = z.infer<typeof updateEventSchema>;

export const updateMatchupSchema = insertMatchupSchema.partial();
export type UpdateMatchup = z.infer<typeof updateMatchupSchema>;

export const updateSponsorSchema = insertSponsorSchema.partial();
export type UpdateSponsor = z.infer<typeof updateSponsorSchema>;

export const reorderMatchupsSchema = z.array(
  z.object({
    id: z.string(),
    sortOrder: z.number(),
    cardSection: z.string().optional(),
  }),
);
export type ReorderMatchups = z.infer<typeof reorderMatchupsSchema>;

export const batchSettingsSchema = z.record(z.string(), z.string());
export type BatchSettings = z.infer<typeof batchSettingsSchema>;

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

// ─── Composite API Response Types ───────────────────────

export type MatchupWithFighters = Matchup & {
  redCorner: Fighter | null;
  blueCorner: Fighter | null;
};

export type EventWithMatchups = Event & {
  matchups: MatchupWithFighters[];
  sponsors: (EventSponsor & { sponsor: Sponsor })[];
};

export type FighterWithHistory = Fighter & {
  matchups: (Matchup & {
    event: Pick<Event, "id" | "title" | "slug" | "date">;
    opponent: Fighter | null;
    corner: "red" | "blue";
  })[];
};

// Re-export for convenience
export type {
  Fighter,
  Event,
  Matchup,
  Sponsor,
  EventSponsor,
  Media,
  Setting,
};
