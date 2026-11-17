import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomId, sign, verifySigned } from "./crypto";
import { readDb, withDb } from "./db";
import type { User } from "./types";

export const SESSION_COOKIE = "rohotips_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;
  const db = await readDb();
  const session = db.sessions.find((entry) => entry.id === sessionId);
  if (!session || new Date(session.expiresAt).getTime() < Date.now()) return null;
  return db.users.find((user) => user.id === session.userId) ?? null;
}

export async function requireUser(next?: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  return user;
}

export async function requireAdmin(next?: string): Promise<User> {
  const user = await requireUser(next);
  if (user.role !== "admin") redirect("/");
  return user;
}

export async function createSession(userId: string): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = randomId(24);
  await withDb((db) => {
    db.sessions = db.sessions.filter((session) => session.userId !== userId);
    db.sessions.push({
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString(),
    });
  });
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await withDb((db) => {
      db.sessions = db.sessions.filter((session) => session.id !== sessionId);
    });
  }
  cookieStore.delete(SESSION_COOKIE);
}

function csrfBase(sessionId: string | undefined): string {
  return sessionId ?? "anonymous";
}

export async function csrfToken(): Promise<string> {
  const cookieStore = await cookies();
  const base = csrfBase(cookieStore.get(SESSION_COOKIE)?.value);
  return `${base}|${sign(base)}`;
}

export async function verifyCsrf(formData: FormData): Promise<boolean> {
  const cookieStore = await cookies();
  const token = formData.get("csrf");
  if (typeof token !== "string") return false;
  const parts = token.split("|");
  if (parts.length !== 2) return false;
  const [sessionId, signature] = parts;
  const expected = cookieStore.get(SESSION_COOKIE)?.value ?? "anonymous";
  if (sessionId !== expected) return false;
  return verifySigned(csrfBase(expected === "anonymous" ? undefined : expected), signature);
}
