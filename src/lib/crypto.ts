import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const secret = process.env.AUTH_SECRET ?? "champeetips-local-development-secret";

export function randomId(bytes = 16): string {
  return randomBytes(bytes).toString("hex");
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expected, "hex");
  if (actual.length !== expectedBuffer.length) return false;
  return timingSafeEqual(actual, expectedBuffer);
}

export function sign(value: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function verifySigned(value: string, signature: string): boolean {
  const expected = Buffer.from(sign(value), "hex");
  const actual = Buffer.from(signature, "hex");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}
