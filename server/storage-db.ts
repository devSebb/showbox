import { eq, and, desc, asc } from "drizzle-orm";
import { db } from "./db";
import * as schema from "@shared/schema";
import type { IStorage } from "./storage";
import type {
  User,
  InsertUser,
  Fighter,
  InsertFighter,
  Event,
  InsertEvent,
  Matchup,
  InsertMatchup,
  Sponsor,
  InsertSponsor,
  EventSponsor,
  InsertEventSponsor,
  Media,
  InsertMedia,
  Setting,
} from "@shared/schema";

function getDb() {
  if (!db) throw new Error("Database not connected — DATABASE_URL is required");
  return db;
}

export class DbStorage implements IStorage {
  // ─── Users ──────────────────────────────────────────
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await getDb()
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await getDb()
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username));
    return user;
  }

  async createUser(data: InsertUser): Promise<User> {
    const [user] = await getDb()
      .insert(schema.users)
      .values(data)
      .returning();
    return user;
  }

  // ─── Fighters ───────────────────────────────────────
  async getFighter(id: string): Promise<Fighter | undefined> {
    const [fighter] = await getDb()
      .select()
      .from(schema.fighters)
      .where(eq(schema.fighters.id, id));
    return fighter;
  }

  async getFighters(filters?: {
    weightClass?: string;
    nationality?: string;
    isActive?: boolean;
  }): Promise<Fighter[]> {
    const conditions = [];
    if (filters?.weightClass !== undefined)
      conditions.push(eq(schema.fighters.weightClass, filters.weightClass));
    if (filters?.nationality !== undefined)
      conditions.push(eq(schema.fighters.nationality, filters.nationality));
    if (filters?.isActive !== undefined)
      conditions.push(eq(schema.fighters.isActive, filters.isActive));

    if (conditions.length === 0) {
      return getDb().select().from(schema.fighters);
    }
    return getDb()
      .select()
      .from(schema.fighters)
      .where(and(...conditions));
  }

  async createFighter(data: InsertFighter): Promise<Fighter> {
    const [fighter] = await getDb()
      .insert(schema.fighters)
      .values(data)
      .returning();
    return fighter;
  }

  async updateFighter(
    id: string,
    data: Partial<InsertFighter>,
  ): Promise<Fighter | undefined> {
    const [updated] = await getDb()
      .update(schema.fighters)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.fighters.id, id))
      .returning();
    return updated;
  }

  async deleteFighter(id: string): Promise<boolean> {
    const [updated] = await getDb()
      .update(schema.fighters)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(schema.fighters.id, id))
      .returning();
    return !!updated;
  }

  // ─── Events ─────────────────────────────────────────
  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await getDb()
      .select()
      .from(schema.events)
      .where(eq(schema.events.id, id));
    return event;
  }

  async getEventBySlug(slug: string): Promise<Event | undefined> {
    const [event] = await getDb()
      .select()
      .from(schema.events)
      .where(eq(schema.events.slug, slug));
    return event;
  }

  async getEvents(filters?: { status?: string }): Promise<Event[]> {
    if (filters?.status) {
      return getDb()
        .select()
        .from(schema.events)
        .where(eq(schema.events.status, filters.status))
        .orderBy(desc(schema.events.date));
    }
    return getDb()
      .select()
      .from(schema.events)
      .orderBy(desc(schema.events.date));
  }

  async getFeaturedEvent(): Promise<Event | undefined> {
    const [event] = await getDb()
      .select()
      .from(schema.events)
      .where(eq(schema.events.isFeatured, true));
    return event;
  }

  async createEvent(data: InsertEvent): Promise<Event> {
    const [event] = await getDb()
      .insert(schema.events)
      .values(data)
      .returning();
    return event;
  }

  async updateEvent(
    id: string,
    data: Partial<InsertEvent>,
  ): Promise<Event | undefined> {
    const [updated] = await getDb()
      .update(schema.events)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.events.id, id))
      .returning();
    return updated;
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await getDb()
      .delete(schema.events)
      .where(eq(schema.events.id, id))
      .returning();
    return result.length > 0;
  }

  async setFeaturedEvent(id: string): Promise<Event | undefined> {
    return getDb().transaction(async (tx) => {
      await tx
        .update(schema.events)
        .set({ isFeatured: false, updatedAt: new Date() });
      const [updated] = await tx
        .update(schema.events)
        .set({ isFeatured: true, updatedAt: new Date() })
        .where(eq(schema.events.id, id))
        .returning();
      return updated;
    });
  }

  // ─── Matchups ───────────────────────────────────────
  async getMatchup(id: string): Promise<Matchup | undefined> {
    const [matchup] = await getDb()
      .select()
      .from(schema.matchups)
      .where(eq(schema.matchups.id, id));
    return matchup;
  }

  async getMatchupsByEvent(eventId: string): Promise<Matchup[]> {
    return getDb()
      .select()
      .from(schema.matchups)
      .where(eq(schema.matchups.eventId, eventId))
      .orderBy(asc(schema.matchups.sortOrder));
  }

  async createMatchup(data: InsertMatchup): Promise<Matchup> {
    const [matchup] = await getDb()
      .insert(schema.matchups)
      .values(data)
      .returning();
    return matchup;
  }

  async updateMatchup(
    id: string,
    data: Partial<InsertMatchup>,
  ): Promise<Matchup | undefined> {
    const [updated] = await getDb()
      .update(schema.matchups)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.matchups.id, id))
      .returning();
    return updated;
  }

  async deleteMatchup(id: string): Promise<boolean> {
    const result = await getDb()
      .delete(schema.matchups)
      .where(eq(schema.matchups.id, id))
      .returning();
    return result.length > 0;
  }

  async reorderMatchups(
    items: { id: string; sortOrder: number; cardSection?: string }[],
  ): Promise<void> {
    await getDb().transaction(async (tx) => {
      for (const item of items) {
        const updateData: { sortOrder: number; updatedAt: Date; cardSection?: string } = {
          sortOrder: item.sortOrder,
          updatedAt: new Date(),
        };
        if (item.cardSection !== undefined) updateData.cardSection = item.cardSection;
        await tx
          .update(schema.matchups)
          .set(updateData)
          .where(eq(schema.matchups.id, item.id));
      }
    });
  }

  // ─── Sponsors ───────────────────────────────────────
  async getSponsor(id: string): Promise<Sponsor | undefined> {
    const [sponsor] = await getDb()
      .select()
      .from(schema.sponsors)
      .where(eq(schema.sponsors.id, id));
    return sponsor;
  }

  async getSponsors(): Promise<Sponsor[]> {
    return getDb()
      .select()
      .from(schema.sponsors)
      .orderBy(asc(schema.sponsors.sortOrder));
  }

  async createSponsor(data: InsertSponsor): Promise<Sponsor> {
    const [sponsor] = await getDb()
      .insert(schema.sponsors)
      .values(data)
      .returning();
    return sponsor;
  }

  async updateSponsor(
    id: string,
    data: Partial<InsertSponsor>,
  ): Promise<Sponsor | undefined> {
    const [updated] = await getDb()
      .update(schema.sponsors)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.sponsors.id, id))
      .returning();
    return updated;
  }

  async deleteSponsor(id: string): Promise<boolean> {
    const result = await getDb()
      .delete(schema.sponsors)
      .where(eq(schema.sponsors.id, id))
      .returning();
    return result.length > 0;
  }

  // ─── Event Sponsors ─────────────────────────────────
  async getEventSponsors(eventId: string): Promise<EventSponsor[]> {
    return getDb()
      .select()
      .from(schema.eventSponsors)
      .where(eq(schema.eventSponsors.eventId, eventId));
  }

  async addEventSponsor(data: InsertEventSponsor): Promise<EventSponsor> {
    const [es] = await getDb()
      .insert(schema.eventSponsors)
      .values(data)
      .onConflictDoNothing()
      .returning();
    if (es) return es;
    // Return existing record if conflict
    const [existing] = await getDb()
      .select()
      .from(schema.eventSponsors)
      .where(
        and(
          eq(schema.eventSponsors.eventId, data.eventId),
          eq(schema.eventSponsors.sponsorId, data.sponsorId),
        ),
      );
    return existing;
  }

  async removeEventSponsor(
    eventId: string,
    sponsorId: string,
  ): Promise<boolean> {
    const result = await getDb()
      .delete(schema.eventSponsors)
      .where(
        and(
          eq(schema.eventSponsors.eventId, eventId),
          eq(schema.eventSponsors.sponsorId, sponsorId),
        ),
      )
      .returning();
    return result.length > 0;
  }

  // ─── Media ──────────────────────────────────────────
  async getMedia(id: string): Promise<Media | undefined> {
    const [item] = await getDb()
      .select()
      .from(schema.media)
      .where(eq(schema.media.id, id));
    return item;
  }

  async getMediaList(category?: string): Promise<Media[]> {
    if (category) {
      return getDb()
        .select()
        .from(schema.media)
        .where(eq(schema.media.category, category))
        .orderBy(desc(schema.media.createdAt));
    }
    return getDb()
      .select()
      .from(schema.media)
      .orderBy(desc(schema.media.createdAt));
  }

  async createMedia(data: InsertMedia): Promise<Media> {
    const [item] = await getDb()
      .insert(schema.media)
      .values(data)
      .returning();
    return item;
  }

  async deleteMedia(id: string): Promise<boolean> {
    const result = await getDb()
      .delete(schema.media)
      .where(eq(schema.media.id, id))
      .returning();
    return result.length > 0;
  }

  // ─── Settings ───────────────────────────────────────
  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await getDb()
      .select()
      .from(schema.settings)
      .where(eq(schema.settings.key, key));
    return setting;
  }

  async getAllSettings(): Promise<Setting[]> {
    return getDb().select().from(schema.settings);
  }

  async upsertSetting(key: string, value: string): Promise<Setting> {
    const [setting] = await getDb()
      .insert(schema.settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: schema.settings.key, set: { value } })
      .returning();
    return setting;
  }

  async batchUpdateSettings(
    settings: Record<string, string>,
  ): Promise<Setting[]> {
    const result: Setting[] = [];
    for (const [key, value] of Object.entries(settings)) {
      result.push(await this.upsertSetting(key, value));
    }
    return result;
  }
}
