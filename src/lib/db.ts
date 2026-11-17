import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { buildSeed, SEED_MEDIA_SLIDES, SEED_SLIP_HOURS } from "./seed";
import type { Betslip, Db, Order, Settings, Slider, User } from "./types";

const globalForDb = globalThis as unknown as { rohotipsPool?: Pool };
let schemaReady: Promise<void> | null = null;

function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add your Neon connection string to .env.local.");
  }
  if (!globalForDb.rohotipsPool) {
    globalForDb.rohotipsPool = new Pool({
      connectionString,
      max: 5,
      ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
    });
  }
  return globalForDb.rohotipsPool;
}

function normalize(db: Db): Db {
  db.resets ??= [];
  db.sessions ??= [];
  db.orders ??= [];
  db.brandLogos ??= {};

  if (!db.carouselMediaSeeded) {
    for (const slide of SEED_MEDIA_SLIDES) {
      if (!db.sliders.some((entry) => entry.id === slide.id)) db.sliders.push(slide);
    }
    db.carouselMediaSeeded = true;
  }

  if (db.settings.siteName === "ROHOTIPS") db.settings.siteName = "CHAMPEETIPS";
  if (db.settings.email === "support@rohotips.co.tz") db.settings.email = "support@champeetips.com";
  for (const user of db.users) {
    if (user.id === "admin-rohotips") {
      user.name = "Champee Admin";
      user.email = "admin@champeetips.com";
    } else if (user.id === "demo-user" && user.email === "demo@rohotips.co.tz") {
      user.email = "demo@champeetips.com";
    }
  }

  const now = Date.now();
  for (const slip of db.slips) {
    const hours = SEED_SLIP_HOURS[slip.id];
    if (hours && new Date(slip.validity).getTime() <= now) {
      slip.validity = new Date(now + hours * 3600000).toISOString();
    }
  }

  return db;
}

async function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const client = await getPool().connect();
      try {
        await client.query("BEGIN");
        await client.query("SELECT pg_advisory_xact_lock(727271)");
        await client.query(
          `CREATE TABLE IF NOT EXISTS rohotips_state (
            id integer PRIMARY KEY,
            data jsonb NOT NULL,
            updated_at timestamptz NOT NULL DEFAULT now()
          )`,
        );
        const existing = await client.query("SELECT 1 FROM rohotips_state WHERE id = 1");
        if (existing.rowCount === 0) {
          await client.query(
            "INSERT INTO rohotips_state (id, data) VALUES (1, $1::jsonb) ON CONFLICT (id) DO NOTHING",
            [JSON.stringify(buildSeed())],
          );
        }
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw error;
      } finally {
        client.release();
      }
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

export async function readDb(): Promise<Db> {
  await ensureSchema();
  const result = await getPool().query<{ data: Db }>(
    "SELECT data FROM rohotips_state WHERE id = 1",
  );
  const db = result.rows[0]?.data;
  if (!db) throw new Error("ChampeeTips database is not initialized");
  return normalize(db);
}

export async function withDb<T>(mutate: (db: Db) => T | Promise<T>): Promise<T> {
  await ensureSchema();
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await client.query<{ data: Db }>(
      "SELECT data FROM rohotips_state WHERE id = 1 FOR UPDATE",
    );
    const db = result.rows[0]?.data;
    if (!db) throw new Error("ChampeeTips database is not initialized");
    const value = await mutate(normalize(db));
    await client.query(
      "UPDATE rohotips_state SET data = $1::jsonb, updated_at = now() WHERE id = 1",
      [JSON.stringify(db)],
    );
    await client.query("COMMIT");
    return value;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

export const newId = (): string => randomUUID();

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const db = await readDb();
  const normalized = email.trim().toLowerCase();
  return db.users.find((user) => user.email.toLowerCase() === normalized);
}

export async function findUserById(id: string): Promise<User | undefined> {
  const db = await readDb();
  return db.users.find((user) => user.id === id);
}

export async function findActiveSlips(): Promise<Betslip[]> {
  const db = await readDb();
  const now = Date.now();
  return db.slips
    .filter((slip) => slip.status === "active" && new Date(slip.validity).getTime() > now)
    .sort((a, b) => new Date(a.validity).getTime() - new Date(b.validity).getTime());
}

export async function findSlip(id: string): Promise<Betslip | undefined> {
  const db = await readDb();
  return db.slips.find((slip) => slip.id === id);
}

export async function findOrder(id: string): Promise<Order | undefined> {
  const db = await readDb();
  return db.orders.find((order) => order.id === id);
}

export async function getSettings(): Promise<Settings> {
  const db = await readDb();
  return db.settings;
}

export async function getSliders(): Promise<Slider[]> {
  const db = await readDb();
  return db.sliders;
}

export async function getBrandLogos(): Promise<Record<string, string>> {
  const db = await readDb();
  return db.brandLogos;
}
