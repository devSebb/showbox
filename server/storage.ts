import {
  type User,
  type InsertUser,
  type Fighter,
  type InsertFighter,
  type Event,
  type InsertEvent,
  type Matchup,
  type InsertMatchup,
  type Sponsor,
  type InsertSponsor,
  type EventSponsor,
  type InsertEventSponsor,
  type Media,
  type InsertMedia,
  type Setting,
  type InsertSetting,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Fighters
  getFighter(id: string): Promise<Fighter | undefined>;
  getFighters(filters?: {
    weightClass?: string;
    nationality?: string;
    isActive?: boolean;
  }): Promise<Fighter[]>;
  createFighter(fighter: InsertFighter): Promise<Fighter>;
  updateFighter(
    id: string,
    data: Partial<InsertFighter>,
  ): Promise<Fighter | undefined>;
  deleteFighter(id: string): Promise<boolean>;

  // Events
  getEvent(id: string): Promise<Event | undefined>;
  getEventBySlug(slug: string): Promise<Event | undefined>;
  getEvents(filters?: { status?: string }): Promise<Event[]>;
  getFeaturedEvent(): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(
    id: string,
    data: Partial<InsertEvent>,
  ): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;
  setFeaturedEvent(id: string): Promise<Event | undefined>;

  // Matchups
  getMatchup(id: string): Promise<Matchup | undefined>;
  getMatchupsByEvent(eventId: string): Promise<Matchup[]>;
  createMatchup(matchup: InsertMatchup): Promise<Matchup>;
  updateMatchup(
    id: string,
    data: Partial<InsertMatchup>,
  ): Promise<Matchup | undefined>;
  deleteMatchup(id: string): Promise<boolean>;
  reorderMatchups(
    items: { id: string; sortOrder: number; cardSection?: string }[],
  ): Promise<void>;

  // Sponsors
  getSponsor(id: string): Promise<Sponsor | undefined>;
  getSponsors(): Promise<Sponsor[]>;
  createSponsor(sponsor: InsertSponsor): Promise<Sponsor>;
  updateSponsor(
    id: string,
    data: Partial<InsertSponsor>,
  ): Promise<Sponsor | undefined>;
  deleteSponsor(id: string): Promise<boolean>;

  // Event Sponsors
  getEventSponsors(eventId: string): Promise<EventSponsor[]>;
  addEventSponsor(es: InsertEventSponsor): Promise<EventSponsor>;
  removeEventSponsor(eventId: string, sponsorId: string): Promise<boolean>;

  // Media
  getMedia(id: string): Promise<Media | undefined>;
  getMediaList(category?: string): Promise<Media[]>;
  createMedia(media: InsertMedia): Promise<Media>;
  deleteMedia(id: string): Promise<boolean>;

  // Settings
  getSetting(key: string): Promise<Setting | undefined>;
  getAllSettings(): Promise<Setting[]>;
  upsertSetting(key: string, value: string): Promise<Setting>;
  batchUpdateSettings(settings: Record<string, string>): Promise<Setting[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private fightersMap: Map<string, Fighter>;
  private eventsMap: Map<string, Event>;
  private matchupsMap: Map<string, Matchup>;
  private sponsorsMap: Map<string, Sponsor>;
  private eventSponsorsMap: Map<string, EventSponsor>;
  private mediaMap: Map<string, Media>;
  private settingsMap: Map<string, Setting>;

  constructor() {
    this.users = new Map();
    this.fightersMap = new Map();
    this.eventsMap = new Map();
    this.matchupsMap = new Map();
    this.sponsorsMap = new Map();
    this.eventSponsorsMap = new Map();
    this.mediaMap = new Map();
    this.settingsMap = new Map();
  }

  // ─── Users ──────────────────────────────────────────
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      role: "admin",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // ─── Fighters ───────────────────────────────────────
  async getFighter(id: string): Promise<Fighter | undefined> {
    return this.fightersMap.get(id);
  }

  async getFighters(filters?: {
    weightClass?: string;
    nationality?: string;
    isActive?: boolean;
  }): Promise<Fighter[]> {
    let result = Array.from(this.fightersMap.values());
    if (filters) {
      if (filters.weightClass) {
        result = result.filter((f) => f.weightClass === filters.weightClass);
      }
      if (filters.nationality) {
        result = result.filter((f) => f.nationality === filters.nationality);
      }
      if (filters.isActive !== undefined) {
        result = result.filter((f) => f.isActive === filters.isActive);
      }
    }
    return result;
  }

  async createFighter(data: InsertFighter): Promise<Fighter> {
    const id = randomUUID();
    const now = new Date();
    const fighter: Fighter = {
      id,
      firstName: data.firstName,
      lastName: data.lastName,
      nickname: data.nickname ?? null,
      nationality: data.nationality ?? null,
      city: data.city ?? null,
      dateOfBirth: data.dateOfBirth ?? null,
      gender: data.gender ?? "male",
      weightClass: data.weightClass ?? null,
      weightLbs: data.weightLbs ?? null,
      heightCm: data.heightCm ?? null,
      reachCm: data.reachCm ?? null,
      stance: data.stance ?? null,
      wins: data.wins ?? 0,
      losses: data.losses ?? 0,
      draws: data.draws ?? 0,
      kos: data.kos ?? 0,
      bio: data.bio ?? null,
      photoUrl: data.photoUrl ?? null,
      photoAction: data.photoAction ?? null,
      instagram: data.instagram ?? null,
      facebook: data.facebook ?? null,
      tiktok: data.tiktok ?? null,
      isActive: data.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.fightersMap.set(id, fighter);
    return fighter;
  }

  async updateFighter(
    id: string,
    data: Partial<InsertFighter>,
  ): Promise<Fighter | undefined> {
    const existing = this.fightersMap.get(id);
    if (!existing) return undefined;
    const updated: Fighter = { ...existing, ...data, updatedAt: new Date() };
    this.fightersMap.set(id, updated);
    return updated;
  }

  async deleteFighter(id: string): Promise<boolean> {
    const existing = this.fightersMap.get(id);
    if (!existing) return false;
    this.fightersMap.set(id, { ...existing, isActive: false, updatedAt: new Date() });
    return true;
  }

  // ─── Events ─────────────────────────────────────────
  async getEvent(id: string): Promise<Event | undefined> {
    return this.eventsMap.get(id);
  }

  async getEventBySlug(slug: string): Promise<Event | undefined> {
    return Array.from(this.eventsMap.values()).find((e) => e.slug === slug);
  }

  async getEvents(filters?: { status?: string }): Promise<Event[]> {
    let result = Array.from(this.eventsMap.values());
    if (filters?.status) {
      result = result.filter((e) => e.status === filters.status);
    }
    return result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  async getFeaturedEvent(): Promise<Event | undefined> {
    return Array.from(this.eventsMap.values()).find((e) => e.isFeatured);
  }

  async createEvent(data: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const now = new Date();
    const event: Event = {
      id,
      title: data.title,
      subtitle: data.subtitle ?? null,
      slug: data.slug,
      date: data.date instanceof Date ? data.date : new Date(data.date),
      venue: data.venue ?? null,
      city: data.city ?? null,
      country: data.country ?? null,
      address: data.address ?? null,
      mapEmbedUrl: data.mapEmbedUrl ?? null,
      posterUrl: data.posterUrl ?? null,
      heroImageUrl: data.heroImageUrl ?? null,
      ticketUrl: data.ticketUrl ?? null,
      ticketCtaText: data.ticketCtaText ?? null,
      description: data.description ?? null,
      status: data.status ?? "draft",
      isFeatured: data.isFeatured ?? false,
      createdAt: now,
      updatedAt: now,
    };
    this.eventsMap.set(id, event);
    return event;
  }

  async updateEvent(
    id: string,
    data: Partial<InsertEvent>,
  ): Promise<Event | undefined> {
    const existing = this.eventsMap.get(id);
    if (!existing) return undefined;
    const updated: Event = {
      ...existing,
      ...data,
      date: data.date
        ? data.date instanceof Date
          ? data.date
          : new Date(data.date)
        : existing.date,
      updatedAt: new Date(),
    };
    this.eventsMap.set(id, updated);
    return updated;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.eventsMap.delete(id);
  }

  async setFeaturedEvent(id: string): Promise<Event | undefined> {
    // Unflag all
    Array.from(this.eventsMap.entries()).forEach(([eid, event]) => {
      if (event.isFeatured) {
        this.eventsMap.set(eid, { ...event, isFeatured: false });
      }
    });
    const event = this.eventsMap.get(id);
    if (!event) return undefined;
    const updated = { ...event, isFeatured: true, updatedAt: new Date() };
    this.eventsMap.set(id, updated);
    return updated;
  }

  // ─── Matchups ───────────────────────────────────────
  async getMatchup(id: string): Promise<Matchup | undefined> {
    return this.matchupsMap.get(id);
  }

  async getMatchupsByEvent(eventId: string): Promise<Matchup[]> {
    return Array.from(this.matchupsMap.values())
      .filter((m) => m.eventId === eventId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async createMatchup(data: InsertMatchup): Promise<Matchup> {
    const id = randomUUID();
    const now = new Date();
    const matchup: Matchup = {
      id,
      eventId: data.eventId,
      redCornerId: data.redCornerId ?? null,
      blueCornerId: data.blueCornerId ?? null,
      weightClass: data.weightClass ?? null,
      weightLbs: data.weightLbs ?? null,
      rounds: data.rounds ?? null,
      cardSection: data.cardSection ?? "main",
      sortOrder: data.sortOrder ?? 0,
      label: data.label ?? null,
      result: data.result ?? null,
      resultMethod: data.resultMethod ?? null,
      resultRound: data.resultRound ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.matchupsMap.set(id, matchup);
    return matchup;
  }

  async updateMatchup(
    id: string,
    data: Partial<InsertMatchup>,
  ): Promise<Matchup | undefined> {
    const existing = this.matchupsMap.get(id);
    if (!existing) return undefined;
    const updated: Matchup = { ...existing, ...data, updatedAt: new Date() };
    this.matchupsMap.set(id, updated);
    return updated;
  }

  async deleteMatchup(id: string): Promise<boolean> {
    return this.matchupsMap.delete(id);
  }

  async reorderMatchups(
    items: { id: string; sortOrder: number; cardSection?: string }[],
  ): Promise<void> {
    for (const item of items) {
      const existing = this.matchupsMap.get(item.id);
      if (existing) {
        this.matchupsMap.set(item.id, {
          ...existing,
          sortOrder: item.sortOrder,
          cardSection: item.cardSection ?? existing.cardSection,
          updatedAt: new Date(),
        });
      }
    }
  }

  // ─── Sponsors ───────────────────────────────────────
  async getSponsor(id: string): Promise<Sponsor | undefined> {
    return this.sponsorsMap.get(id);
  }

  async getSponsors(): Promise<Sponsor[]> {
    return Array.from(this.sponsorsMap.values()).sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
  }

  async createSponsor(data: InsertSponsor): Promise<Sponsor> {
    const id = randomUUID();
    const now = new Date();
    const sponsor: Sponsor = {
      id,
      name: data.name,
      logoUrl: data.logoUrl ?? null,
      websiteUrl: data.websiteUrl ?? null,
      tier: data.tier ?? "bronze",
      brandColor: data.brandColor ?? null,
      tagline: data.tagline ?? null,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
      createdAt: now,
      updatedAt: now,
    };
    this.sponsorsMap.set(id, sponsor);
    return sponsor;
  }

  async updateSponsor(
    id: string,
    data: Partial<InsertSponsor>,
  ): Promise<Sponsor | undefined> {
    const existing = this.sponsorsMap.get(id);
    if (!existing) return undefined;
    const updated: Sponsor = { ...existing, ...data, updatedAt: new Date() };
    this.sponsorsMap.set(id, updated);
    return updated;
  }

  async deleteSponsor(id: string): Promise<boolean> {
    return this.sponsorsMap.delete(id);
  }

  // ─── Event Sponsors ─────────────────────────────────
  async getEventSponsors(eventId: string): Promise<EventSponsor[]> {
    return Array.from(this.eventSponsorsMap.values()).filter(
      (es) => es.eventId === eventId,
    );
  }

  async addEventSponsor(data: InsertEventSponsor): Promise<EventSponsor> {
    // Check for existing
    const existing = Array.from(this.eventSponsorsMap.values()).find(
      (es) => es.eventId === data.eventId && es.sponsorId === data.sponsorId,
    );
    if (existing) return existing;

    const id = randomUUID();
    const es: EventSponsor = {
      id,
      eventId: data.eventId,
      sponsorId: data.sponsorId,
      tier: data.tier ?? null,
    };
    this.eventSponsorsMap.set(id, es);
    return es;
  }

  async removeEventSponsor(
    eventId: string,
    sponsorId: string,
  ): Promise<boolean> {
    const entry = Array.from(this.eventSponsorsMap.entries()).find(
      ([, es]) => es.eventId === eventId && es.sponsorId === sponsorId,
    );
    if (entry) {
      this.eventSponsorsMap.delete(entry[0]);
      return true;
    }
    return false;
  }

  // ─── Media ──────────────────────────────────────────
  async getMedia(id: string): Promise<Media | undefined> {
    return this.mediaMap.get(id);
  }

  async getMediaList(category?: string): Promise<Media[]> {
    let result = Array.from(this.mediaMap.values());
    if (category) {
      result = result.filter((m) => m.category === category);
    }
    return result.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async createMedia(data: InsertMedia): Promise<Media> {
    const id = randomUUID();
    const mediaItem: Media = {
      id,
      filename: data.filename,
      originalName: data.originalName,
      mimeType: data.mimeType,
      size: data.size,
      url: data.url,
      alt: data.alt ?? null,
      category: data.category ?? "general",
      createdAt: new Date(),
    };
    this.mediaMap.set(id, mediaItem);
    return mediaItem;
  }

  async deleteMedia(id: string): Promise<boolean> {
    return this.mediaMap.delete(id);
  }

  // ─── Settings ───────────────────────────────────────
  async getSetting(key: string): Promise<Setting | undefined> {
    return this.settingsMap.get(key);
  }

  async getAllSettings(): Promise<Setting[]> {
    return Array.from(this.settingsMap.values());
  }

  async upsertSetting(key: string, value: string): Promise<Setting> {
    const setting: Setting = { key, value };
    this.settingsMap.set(key, setting);
    return setting;
  }

  async batchUpdateSettings(
    settings: Record<string, string>,
  ): Promise<Setting[]> {
    const result: Setting[] = [];
    for (const [key, value] of Object.entries(settings)) {
      const s = await this.upsertSetting(key, value);
      result.push(s);
    }
    return result;
  }
}

export const storage = new MemStorage();
