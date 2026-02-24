/**
 * Seed patch: Updates fighters and matchups from parsed fight card.
 * Non-destructive. Upserts fighters by name, creates matchups if not existing.
 * Run on server startup after seed.
 */

import { storage } from "../server/storage";
import type { Fighter } from "@shared/schema";

const COUNTRY_TO_NATIONALITY: Record<string, string> = {
  ECU: "Ecuador",
  COL: "Colombia",
  VEN: "Venezuela",
  MEX: "Mexico",
};

type FightCardRow = {
  a: { name: string; country?: string; w: number; l: number; d: number };
  b: { name: string; country?: string; w: number; l: number; d: number };
  weight: number;
};

const FIGHT_CARD: FightCardRow[] = [
  { a: { name: "Erick Mendez", country: "ECU", w: 0, l: 0, d: 0 }, b: { name: "Jonathan Carrera", country: "ECU", w: 0, l: 8, d: 0 }, weight: 118 },
  { a: { name: "Preston Montiria", w: 3, l: 0, d: 0 }, b: { name: "Ivan Macias", w: 3, l: 1, d: 0 }, weight: 118 },
  { a: { name: "Jhancarlo Anchico", country: "ECU", w: 2, l: 0, d: 0 }, b: { name: "David Betancourt", country: "ECU", w: 3, l: 6, d: 1 }, weight: 140 },
  { a: { name: "Cristobal Carrillo", country: "ECU", w: 3, l: 0, d: 1 }, b: { name: "Luis Castillo", country: "ECU", w: 1, l: 7, d: 0 }, weight: 172 },
  { a: { name: "Will Cardeño", country: "COL", w: 2, l: 1, d: 0 }, b: { name: "Miguel Riascos", country: "ECU", w: 0, l: 4, d: 0 }, weight: 147 },
  { a: { name: "Jhon Wampash Jr", country: "ECU", w: 12, l: 0, d: 1 }, b: { name: "Jason Crooks Mejia", w: 5, l: 0, d: 1 }, weight: 132 },
  { a: { name: "Fernando Gudiño", country: "ECU", w: 7, l: 2, d: 0 }, b: { name: "Pablo Chuchuca", country: "ECU", w: 2, l: 0, d: 1 }, weight: 140 },
  { a: { name: "Kevin Inga", country: "ECU", w: 6, l: 0, d: 0 }, b: { name: "Christian Pulupa", country: "ECU", w: 2, l: 0, d: 1 }, weight: 126 },
  { a: { name: "Mauricio Sanchez", country: "VEN", w: 8, l: 0, d: 0 }, b: { name: "Edwin Laje", country: "ECU", w: 4, l: 3, d: 1 }, weight: 130 },
  { a: { name: "Carlos Vera", country: "ECU", w: 6, l: 7, d: 0 }, b: { name: "Alexander Espinoza", country: "ECU", w: 20, l: 4, d: 1 }, weight: 138 },
  { a: { name: "Erick Bone", country: "ECU", w: 30, l: 8, d: 0 }, b: { name: "Eduardo Rangel", country: "MEX", w: 9, l: 3, d: 0 }, weight: 147 },
];

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  const firstSpace = trimmed.indexOf(" ");
  if (firstSpace === -1) {
    return { firstName: trimmed, lastName: trimmed };
  }
  return {
    firstName: trimmed.slice(0, firstSpace),
    lastName: trimmed.slice(firstSpace + 1),
  };
}

function fullNameKey(fighter: Fighter): string {
  return `${fighter.firstName} ${fighter.lastName}`.toLowerCase().trim();
}

function normalizeNameForMatch(name: string): string {
  return name.toLowerCase().trim();
}

function findFighterByName(
  name: string,
  fighterMap: Map<string, Fighter>
): Fighter | undefined {
  const key = normalizeNameForMatch(name);
  const byFull = fighterMap.get(key);
  if (byFull) return byFull;
  const { lastName } = splitFullName(name);
  const lastLower = lastName.toLowerCase();
  return Array.from(fighterMap.values()).find(
    (f) => f.lastName.toLowerCase() === lastLower
  );
}

export async function patchFightCard(): Promise<void> {
  const log = (msg: string) => console.log(`[patch-fightcard] ${msg}`);

  const event = await storage.getFeaturedEvent();
  if (!event) {
    log("No featured event found, skipping patch");
    return;
  }

  const allFighters = await storage.getFighters();
  const fighterByName = new Map<string, Fighter>();
  for (const f of allFighters) {
    fighterByName.set(fullNameKey(f), f);
  }

  const createdFighters: string[] = [];
  const updatedFighters: string[] = [];

  async function upsertFighter(
    data: { name: string; country?: string; w: number; l: number; d: number },
    weightLbs: number
  ): Promise<Fighter> {
    const { firstName, lastName } = splitFullName(data.name);
    const key = normalizeNameForMatch(data.name);
    const existing = findFighterByName(data.name, fighterByName);

    const nationality = data.country ? (COUNTRY_TO_NATIONALITY[data.country] ?? data.country) : null;
    const payload = {
      firstName,
      lastName,
      nationality,
      wins: data.w,
      losses: data.l,
      draws: data.d,
      weightLbs,
      gender: "male" as const,
      isActive: true,
    };

    if (existing) {
      const oldKey = fullNameKey(existing);
      const updated = await storage.updateFighter(existing.id, payload);
      if (updated) {
        fighterByName.delete(oldKey);
        fighterByName.set(key, updated);
        updatedFighters.push(`${firstName} ${lastName}`);
        return updated;
      }
    }

    const created = await storage.createFighter(payload);
    fighterByName.set(key, created);
    createdFighters.push(`${firstName} ${lastName}`);
    return created;
  }

  const existingMatchups = await storage.getMatchupsByEvent(event.id);
  const matchupKey = (redId: string | null, blueId: string | null) =>
    [redId ?? "", blueId ?? ""].sort().join("|");
  const existingMatchupKeys = new Set(
    existingMatchups.map((m) => matchupKey(m.redCornerId, m.blueCornerId))
  );

  const createdMatchups: string[] = [];
  let sortOrder = existingMatchups.length > 0
    ? Math.max(...existingMatchups.map((m) => m.sortOrder)) + 1
    : 1;

  for (const row of FIGHT_CARD) {
    const fighterA = await upsertFighter(row.a, row.weight);
    const fighterB = await upsertFighter(row.b, row.weight);

    const key = matchupKey(fighterA.id, fighterB.id);
    if (existingMatchupKeys.has(key)) {
      continue;
    }

    await storage.createMatchup({
      eventId: event.id,
      redCornerId: fighterA.id,
      blueCornerId: fighterB.id,
      weightLbs: row.weight,
      cardSection: "main",
      sortOrder: sortOrder++,
    });
    existingMatchupKeys.add(key);
    createdMatchups.push(`${fighterA.firstName} ${fighterA.lastName} vs ${fighterB.firstName} ${fighterB.lastName}`);
  }

  if (createdFighters.length > 0) {
    log(`Created fighters: ${createdFighters.join(", ")}`);
  }
  if (updatedFighters.length > 0) {
    log(`Updated fighters: ${[...new Set(updatedFighters)].join(", ")}`);
  }
  if (createdMatchups.length > 0) {
    log(`Created matchups: ${createdMatchups.length}`);
    createdMatchups.forEach((m) => log(`  - ${m}`));
  }
  if (createdFighters.length === 0 && updatedFighters.length === 0 && createdMatchups.length === 0) {
    log("No changes (fighters and matchups already up to date)");
  }
}
