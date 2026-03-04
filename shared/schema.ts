import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  date,
  unique,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ─── USERS ──────────────────────────────────────────────
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ─── FIGHTERS ───────────────────────────────────────────
export const fighters = pgTable("fighters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  nickname: text("nickname"),
  nationality: text("nationality"),
  city: text("city"),
  dateOfBirth: date("date_of_birth"),
  gender: text("gender").notNull().default("male"),
  weightClass: text("weight_class"),
  weightLbs: integer("weight_lbs"),
  heightCm: integer("height_cm"),
  reachCm: integer("reach_cm"),
  stance: text("stance"),
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  draws: integer("draws").notNull().default(0),
  kos: integer("kos").notNull().default(0),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  photoAction: text("photo_action"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  tiktok: text("tiktok"),
  isActive: boolean("is_active").notNull().default(true),
  isAmateur: boolean("is_amateur").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertFighterSchema = createInsertSchema(fighters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertFighter = z.infer<typeof insertFighterSchema>;
export type Fighter = typeof fighters.$inferSelect;

// ─── EVENTS ─────────────────────────────────────────────
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  slug: text("slug").notNull().unique(),
  date: timestamp("date").notNull(),
  venue: text("venue"),
  city: text("city"),
  country: text("country"),
  address: text("address"),
  mapEmbedUrl: text("map_embed_url"),
  posterUrl: text("poster_url"),
  heroImageUrl: text("hero_image_url"),
  ticketUrl: text("ticket_url"),
  ticketCtaText: text("ticket_cta_text"),
  description: text("description"),
  status: text("status").notNull().default("draft"),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// ─── MATCHUPS ───────────────────────────────────────────
export const matchups = pgTable("matchups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  redCornerId: varchar("red_corner_id").references(() => fighters.id),
  blueCornerId: varchar("blue_corner_id").references(() => fighters.id),
  weightClass: text("weight_class"),
  weightLbs: integer("weight_lbs"),
  rounds: integer("rounds"),
  cardSection: text("card_section").notNull().default("main"),
  sortOrder: integer("sort_order").notNull().default(0),
  label: text("label"),
  result: text("result"),
  resultMethod: text("result_method"),
  resultRound: integer("result_round"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMatchupSchema = createInsertSchema(matchups).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertMatchup = z.infer<typeof insertMatchupSchema>;
export type Matchup = typeof matchups.$inferSelect;

// ─── SPONSORS ───────────────────────────────────────────
export const sponsors = pgTable("sponsors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  tier: text("tier").notNull().default("bronze"),
  brandColor: text("brand_color"),
  tagline: text("tagline"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSponsorSchema = createInsertSchema(sponsors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertSponsor = z.infer<typeof insertSponsorSchema>;
export type Sponsor = typeof sponsors.$inferSelect;

// ─── EVENT_SPONSORS (junction) ──────────────────────────
export const eventSponsors = pgTable(
  "event_sponsors",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    eventId: varchar("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    sponsorId: varchar("sponsor_id")
      .notNull()
      .references(() => sponsors.id, { onDelete: "cascade" }),
    tier: text("tier"),
  },
  (t) => [unique().on(t.eventId, t.sponsorId)],
);

export const insertEventSponsorSchema = createInsertSchema(eventSponsors).omit({
  id: true,
});
export type InsertEventSponsor = z.infer<typeof insertEventSponsorSchema>;
export type EventSponsor = typeof eventSponsors.$inferSelect;

// ─── MEDIA ──────────────────────────────────────────────
export const media = pgTable("media", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  alt: text("alt"),
  category: text("category").default("general"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
});
export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Media = typeof media.$inferSelect;

// ─── SETTINGS (key-value) ───────────────────────────────
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const insertSettingSchema = createInsertSchema(settings);
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Setting = typeof settings.$inferSelect;
