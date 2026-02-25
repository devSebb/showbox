import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPgSimple from "connect-pg-simple";
import type { Express } from "express";
import { storage } from "./storage";
import { pgPool } from "./db";
import type { User } from "@shared/schema";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(
  supplied: string,
  stored: string,
): Promise<boolean> {
  const [hashedPassword, salt] = stored.split(".");
  const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
  const suppliedPasswordBuf = (await scryptAsync(
    supplied,
    salt,
    64,
  )) as Buffer;
  return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      password: string;
      role: string;
      createdAt: Date;
    }
  }
}

export function setupAuth(app: Express) {
  if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is required in production");
  }

  const secret =
    process.env.SESSION_SECRET || "dev-only-secret-change-in-production";

  let store: session.Store;
  if (pgPool) {
    const PgStore = connectPgSimple(session);
    store = new PgStore({ pool: pgPool, createTableIfNotExists: true });
  } else {
    const MemoryStore = createMemoryStore(session);
    store = new MemoryStore({ checkPeriod: 86400000 });
  }

  const sessionSettings: session.SessionOptions = {
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // "strict" can block cookies on redirects; lax works with proxy
    },
    store,
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Credenciales incorrectas" });
        }
        const isMatch = await comparePasswords(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Credenciales incorrectas" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || undefined);
    } catch (err) {
      done(err);
    }
  });
}
