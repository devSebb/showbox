import { storage } from "./storage";
import { hashPassword } from "./auth";
import { log } from "./index";
import { patchFightCard } from "../seeds/patch-fightcard";

export async function seed() {
  // Check if already seeded
  const existingAdmin = await storage.getUserByUsername("admin");
  if (existingAdmin) {
    log("Database already seeded, skipping", "seed");
    await patchFightCard();
    return;
  }

  log("Seeding database...", "seed");

  // ─── Admin User ──────────────────────────────────
  let adminPassword = process.env.ADMIN_INITIAL_PASSWORD;
  if (!adminPassword) {
    if (process.env.NODE_ENV === "production") {
      log("ADMIN_INITIAL_PASSWORD not set — skipping admin creation. Set it in Render env vars and redeploy.", "seed");
      return;
    }
    adminPassword = "showbox2026";
    log("Using dev default password (showbox2026)", "seed");
  }
  const hashedPassword = await hashPassword(adminPassword);
  await storage.createUser({
    username: "admin",
    password: hashedPassword,
  });
  log("Admin user created. Username: admin. Login at /admin/login", "seed");

  // ─── Fighters ────────────────────────────────────
  const fighterData = [
    { firstName: "Erick", lastName: "Mendez", nickname: null, weightClass: "bantamweight", weightLbs: 118, nationality: "Ecuador" },
    { firstName: "Jonathan", lastName: "Carrera", nickname: null, weightClass: "bantamweight", weightLbs: 118, nationality: "Ecuador" },
    { firstName: "Preston", lastName: "Montiria", nickname: null, weightClass: "bantamweight", weightLbs: 118, nationality: null },
    { firstName: "Ivan", lastName: "Macias", nickname: null, weightClass: "bantamweight", weightLbs: 118, nationality: null },
    { firstName: "Jhancarlo", lastName: "Anchico", nickname: null, weightClass: "super lightweight", weightLbs: 140, nationality: "Ecuador" },
    { firstName: "David", lastName: "Betancourt", nickname: null, weightClass: "super lightweight", weightLbs: 140, nationality: "Ecuador" },
    { firstName: "Cristobal", lastName: "Carrillo", nickname: null, weightClass: "light heavyweight", weightLbs: 172, nationality: "Ecuador" },
    { firstName: "Luis", lastName: "Castillo", nickname: null, weightClass: "light heavyweight", weightLbs: 172, nationality: "Ecuador" },
    { firstName: "Will", lastName: "Cardeño", nickname: null, weightClass: "welterweight", weightLbs: 147, nationality: "Colombia" },
    { firstName: "Miguel", lastName: "Riascos", nickname: null, weightClass: "welterweight", weightLbs: 147, nationality: "Ecuador" },
    { firstName: "Jhon", lastName: "Wampash Jr", nickname: null, weightClass: "super featherweight", weightLbs: 132, nationality: "Ecuador" },
    { firstName: "Jason", lastName: "Crooks Mejia", nickname: null, weightClass: "super featherweight", weightLbs: 132, nationality: null },
    { firstName: "Fernando", lastName: "Gudiño", nickname: null, weightClass: "super lightweight", weightLbs: 140, nationality: "Ecuador" },
    { firstName: "Pablo", lastName: "Chuchuca", nickname: null, weightClass: "super lightweight", weightLbs: 140, nationality: "Ecuador" },
    { firstName: "Kevin", lastName: "Inga", nickname: null, weightClass: "featherweight", weightLbs: 126, nationality: "Ecuador" },
    { firstName: "Christian", lastName: "Pulupa", nickname: null, weightClass: "featherweight", weightLbs: 126, nationality: "Ecuador" },
    { firstName: "Mauricio", lastName: "Sanchez", nickname: null, weightClass: "super featherweight", weightLbs: 130, nationality: "Venezuela" },
    { firstName: "Edwin", lastName: "Laje", nickname: null, weightClass: "super featherweight", weightLbs: 130, nationality: "Ecuador" },
    { firstName: "Carlos", lastName: "Vera", nickname: null, weightClass: "super lightweight", weightLbs: 138, nationality: "Ecuador" },
    { firstName: "Alexander", lastName: "Espinoza", nickname: null, weightClass: "super lightweight", weightLbs: 138, nationality: "Ecuador" },
    { firstName: "Erick", lastName: "Bone", nickname: null, weightClass: "welterweight", weightLbs: 147, nationality: "Ecuador" },
    { firstName: "Eduardo", lastName: "Rangel", nickname: null, weightClass: "welterweight", weightLbs: 147, nationality: "Mexico" },
  ];

  const fighters: Record<string, any> = {};
  for (const f of fighterData) {
    const fighter = await storage.createFighter({
      firstName: f.firstName,
      lastName: f.lastName,
      nickname: f.nickname,
      weightClass: f.weightClass,
      weightLbs: f.weightLbs,
      nationality: f.nationality,
      gender: "male",
      isActive: true,
    });
    fighters[f.lastName.toUpperCase()] = fighter;
  }

  // ─── Event ───────────────────────────────────────
  const event = await storage.createEvent({
    title: "Quorum Quito Fight Night XIII",
    subtitle: "By Forbet — Pronostica y Gana",
    slug: "quorum-quito-fight-night-xiii",
    date: new Date("2026-03-21T19:00:00"),
    venue: "Quorum Paseo San Francisco",
    city: "Quito",
    country: "Ecuador",
    address: "Paseo San Francisco, Quito, Ecuador",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7997931343714!2d-78.4371991!3d-0.1906233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d591322abdf837%3A0xe545cdd62f90141a!2sQuorum%20Quito!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",
    posterUrl: "/attached_assets/main-card.jpeg",
    heroImageUrl: "/attached_assets/Screenshot_2026-02-23_at_9.09.33_PM_1771898976524.png",
    ticketUrl: "https://www.buenplan.com.ec/event/quorum-figth-xiii-2025-quito",
    ticketCtaText: "Comprar Boletos",
    description:
      "La decimotercera edición de la noche de boxeo profesional más esperada de Ecuador.",
    status: "published",
    isFeatured: true,
  });

  // ─── Matchups ────────────────────────────────────
  const matchupData = [
    // Main Card
    { red: "BONE", blue: "RANGEL", weightLbs: 147, rounds: 8, section: "main", order: 1, label: "EVENTO ESTELAR" },
    { red: "VERA", blue: "ESPINOZA", weightLbs: 138, rounds: 8, section: "main", order: 2, label: "CO-ESTELAR" },
    { red: "SANCHEZ", blue: "LAJE", weightLbs: 130, rounds: 8, section: "main", order: 3, label: null },
    { red: "INGA", blue: "PULUPA", weightLbs: 126, rounds: 6, section: "main", order: 4, label: null },
    // Prelims
    { red: "GUDIÑO", blue: "CHUCHUCA", weightLbs: 140, rounds: 8, section: "prelim", order: 5, label: null },
    { red: "WAMPASH JR", blue: "CROOKS MEJIA", weightLbs: 132, rounds: 8, section: "prelim", order: 6, label: null },
    { red: "CARDEÑO", blue: "RIASCOS", weightLbs: 147, rounds: 4, section: "prelim", order: 7, label: null },
    { red: "CARRILLO", blue: "CASTILLO", weightLbs: 172, rounds: 4, section: "prelim", order: 8, label: null },
    // Undercard
    { red: "ANCHICO", blue: "BETANCOURT", weightLbs: 140, rounds: 6, section: "undercard", order: 9, label: null },
    { red: "MONTIRIA", blue: "MACIAS", weightLbs: 118, rounds: 4, section: "undercard", order: 10, label: null },
    { red: "MENDEZ", blue: "CARRERA", weightLbs: 118, rounds: 4, section: "undercard", order: 11, label: null },
  ];

  for (const m of matchupData) {
    await storage.createMatchup({
      eventId: event.id,
      redCornerId: fighters[m.red]?.id ?? null,
      blueCornerId: fighters[m.blue]?.id ?? null,
      weightLbs: m.weightLbs,
      rounds: m.rounds,
      cardSection: m.section,
      sortOrder: m.order,
      label: m.label,
    });
  }

  // ─── Sponsors ────────────────────────────────────
  const sponsorData = [
    { name: "Forbet", tier: "title", brandColor: "#00FF00", tagline: "Pronostica y Gana", sortOrder: 1 },
    { name: "Induvallas", tier: "gold", sortOrder: 2 },
    { name: "Grupo", tier: "gold", sortOrder: 3 },
    { name: "Deepal by Changan", tier: "gold", sortOrder: 4 },
    { name: "Oriental", tier: "gold", sortOrder: 5 },
    { name: "Dann Carlton", tier: "silver", sortOrder: 6 },
    { name: "El Universo", tier: "silver", sortOrder: 7 },
    { name: "Snap Shot", tier: "silver", sortOrder: 8 },
    { name: "Social Magazine", tier: "silver", sortOrder: 9 },
    { name: "CCQ", tier: "silver", sortOrder: 10 },
    { name: "IMD", tier: "silver", sortOrder: 11 },
    { name: "Chango", tier: "silver", sortOrder: 12 },
  ];

  for (const s of sponsorData) {
    const sponsor = await storage.createSponsor({
      name: s.name,
      tier: s.tier,
      brandColor: s.brandColor ?? null,
      tagline: s.tagline ?? null,
      sortOrder: s.sortOrder,
      isActive: true,
    });

    // Assign all sponsors to the event
    await storage.addEventSponsor({
      eventId: event.id,
      sponsorId: sponsor.id,
      tier: s.tier,
    });
  }

  // ─── Settings ────────────────────────────────────
  const defaultSettings: Record<string, string> = {
    instagram: "https://www.instagram.com/showboxec/",
    facebook: "https://www.facebook.com/showboxpromotionsec",
    youtube: "https://www.youtube.com/@ShowBoxPromotionsEC",
    tiktok: "https://www.tiktok.com/@showboxpromotionsec",
    contactEmail: "info@showboxpromotions.ec",
    contactPhone: "+593999999999",
    aboutText:
      "Somos la promotora de boxeo profesional líder en Ecuador. Desde nuestros inicios, hemos llevado el deporte de combate al más alto nivel, organizando eventos de clase mundial que combinan talento local con estándares internacionales. Showbox Promotions EC es sinónimo de adrenalina, espectáculo y boxeo de élite.",
  };

  await storage.batchUpdateSettings(defaultSettings);

  log("Seeding complete!", "seed");
  await patchFightCard();
}

