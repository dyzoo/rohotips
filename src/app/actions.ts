"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  getCurrentUser,
  requireAdmin,
  requireUser,
  verifyCsrf,
} from "@/lib/auth";
import { hashPassword, randomId, verifyPassword } from "@/lib/crypto";
import { newId, readDb, withDb } from "@/lib/db";
import { createOrder, markOrderPaid } from "@/lib/payments";
import type { Betslip, OrderStatus, PaymentMethod } from "@/lib/types";

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function safePath(value: string, fallback: string): string {
  return value.startsWith("/") && !/^\/[\\/]/.test(value) ? value : fallback;
}

export async function loginAction(formData: FormData): Promise<void> {
  const identity = text(formData, "login").toLowerCase();
  const password = text(formData, "password");
  const next = safePath(text(formData, "next"), "");
  let target = `/login?error=invalid${next ? `&next=${encodeURIComponent(next)}` : ""}`;

  if (await verifyCsrf(formData)) {
    const db = await readDb();
    const user = db.users.find(
      (entry) => entry.email.toLowerCase() === identity || entry.name.toLowerCase() === identity,
    );
    if (user && verifyPassword(password, user.passwordHash)) {
      await createSession(user.id);
      target = next || (user.role === "admin" ? "/admin" : "/");
    }
  }

  redirect(target);
}

export async function registerAction(formData: FormData): Promise<void> {
  const name = text(formData, "username");
  const email = text(formData, "email").toLowerCase();
  const phone = text(formData, "phone");
  const password = text(formData, "password");
  const confirm = text(formData, "confirm_password");
  let target = "/register?error=invalid";

  if (await verifyCsrf(formData)) {
    const db = await readDb();
    const exists = db.users.some((user) => user.email.toLowerCase() === email);
    if (
      name.length >= 2 &&
      email.includes("@") &&
      phone.replace(/\D/g, "").length >= 9 &&
      password.length >= 6 &&
      password === confirm &&
      !exists
    ) {
      const id = newId();
      await withDb((data) => {
        data.users.push({
          id,
          name,
          email,
          phone,
          passwordHash: hashPassword(password),
          role: "user",
          createdAt: new Date().toISOString(),
          verified: true,
        });
      });
      await createSession(id);
      target = "/";
    } else if (exists) {
      target = "/register?error=exists";
    }
  }

  redirect(target);
}

export async function forgotAction(formData: FormData): Promise<void> {
  const email = text(formData, "email").toLowerCase();
  const captcha = text(formData, "captcha");
  let target = "/forgot?error=invalid";

  if ((await verifyCsrf(formData)) && captcha === "10") {
    const db = await readDb();
    if (db.users.some((user) => user.email.toLowerCase() === email)) {
      const token = randomId(16);
      await withDb((data) => {
        data.resets.push({
          id: token,
          email,
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
        });
      });
      target = `/reset?token=${token}`;
    } else {
      target = "/forgot?sent=1";
    }
  }

  redirect(target);
}

export async function resetPasswordAction(formData: FormData): Promise<void> {
  const token = text(formData, "token");
  const password = text(formData, "password");
  const confirm = text(formData, "confirm_password");
  let target = `/reset?token=${encodeURIComponent(token)}&error=invalid`;

  if ((await verifyCsrf(formData)) && password.length >= 6 && password === confirm) {
    const valid = await withDb((db) => {
      const reset = db.resets.find((entry) => entry.id === token);
      if (!reset || new Date(reset.expiresAt).getTime() <= Date.now()) return false;
      const user = db.users.find((entry) => entry.email.toLowerCase() === reset.email.toLowerCase());
      if (!user) return false;
      user.passwordHash = hashPassword(password);
      db.resets = db.resets.filter((entry) => entry.id !== token);
      return true;
    });
    if (valid) target = "/login?reset=1";
  }

  redirect(target);
}

export async function logoutAction(formData: FormData): Promise<void> {
  if (await verifyCsrf(formData)) await destroySession();
  redirect("/");
}

export async function payForSlipAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const slipId = text(formData, "slipId");
  const method = text(formData, "method") as PaymentMethod;
  const phone = text(formData, "phone");
  let target = `/betslip/${slipId}?error=payment`;

  if ((await verifyCsrf(formData)) && phone.replace(/\D/g, "").length >= 9) {
    try {
      const order = await createOrder(user.id, slipId, method, phone);
      target = `/checkout/${order.id}`;
    } catch {
      target = `/betslip/${slipId}?error=payment`;
    }
  }

  redirect(target);
}

export async function simulatePaymentAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const orderId = text(formData, "orderId");
  const target = `/checkout/${orderId}`;

  if (await verifyCsrf(formData)) {
    const db = await readDb();
    const order = db.orders.find((entry) => entry.id === orderId && entry.userId === user.id);
    if (order && order.mode === "demo" && order.status === "pending") {
      await markOrderPaid(order.reference, order.checkoutRequestId);
      revalidatePath("/mybets");
    }
  }

  redirect(target);
}

export async function orderStatusAction(
  orderId: string,
): Promise<{ status: OrderStatus; slipId: string } | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const db = await readDb();
  const order = db.orders.find((entry) => entry.id === orderId && entry.userId === user.id);
  return order ? { status: order.status, slipId: order.slipId } : null;
}

function parseSlip(formData: FormData, id: string): Omit<Betslip, "createdAt"> {
  const bookmakers = text(formData, "bookmakers")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const matches = text(formData, "matches")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((part) => part.trim());
      return {
        home: parts[0] ?? "",
        away: parts[1] ?? "",
        market: parts[2] ?? "",
        odd: Number(parts[3]) || 0,
        time: parts[4] ?? "",
      };
    });
  const rawValidity = text(formData, "validity");
  const parsedValidity = rawValidity ? new Date(rawValidity) : new Date(Number.NaN);
  const validity = Number.isFinite(parsedValidity.getTime()) ? parsedValidity.toISOString() : "";
  return {
    id,
    code: text(formData, "code") || `RT-${id.toUpperCase()}-${randomId(3).toUpperCase()}`,
    title: text(formData, "title"),
    category: text(formData, "category"),
    odds: Number(text(formData, "odds")) || 0,
    price: Number(text(formData, "price")) || 0,
    validity,
    bookmakers,
    matches,
    status: text(formData, "status") === "inactive" ? "inactive" : "active",
  };
}

export async function createSlipAction(formData: FormData): Promise<void> {
  await requireAdmin();
  let target = "/admin/slips/new?error=invalid";
  if (await verifyCsrf(formData)) {
    const id = newId();
    const slip = parseSlip(formData, id);
    if (slip.title && slip.category && slip.odds > 0 && slip.price > 0 && Number.isFinite(new Date(slip.validity).getTime())) {
      await withDb((db) => {
        db.slips.push({ ...slip, createdAt: new Date().toISOString() });
      });
      revalidatePath("/");
      revalidatePath("/admin/slips");
      target = "/admin/slips?saved=created";
    }
  }
  redirect(target);
}

export async function updateSlipAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "id");
  let target = `/admin/slips/${id}/edit?error=invalid`;
  if (await verifyCsrf(formData)) {
    const updated = parseSlip(formData, id);
    if (
      updated.title &&
      updated.category &&
      updated.odds > 0 &&
      updated.price > 0 &&
      Number.isFinite(new Date(updated.validity).getTime())
    ) {
      const found = await withDb((db) => {
        const index = db.slips.findIndex((entry) => entry.id === id);
        if (index < 0) return false;
        db.slips[index] = { ...updated, createdAt: db.slips[index].createdAt };
        return true;
      });
      if (found) {
        revalidatePath("/");
        revalidatePath("/admin/slips");
        target = "/admin/slips?saved=updated";
      }
    }
  }
  redirect(target);
}

export async function deleteSlipAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "id");
  if (await verifyCsrf(formData)) {
    await withDb((db) => {
      db.slips = db.slips.filter((entry) => entry.id !== id);
    });
    revalidatePath("/");
  }
  redirect("/admin/slips?saved=deleted");
}

export async function setOrderStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status") as OrderStatus;
  if ((await verifyCsrf(formData)) && ["paid", "failed", "cancelled", "pending"].includes(status)) {
    await withDb((db) => {
      const order = db.orders.find((entry) => entry.id === id);
      if (order) {
        order.status = status;
        if (status === "paid") order.paidAt = new Date().toISOString();
      }
    });
    revalidatePath("/admin/orders");
    revalidatePath("/mybets");
  }
  redirect("/admin/orders?saved=1");
}

export async function toggleUserRoleAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "id");
  if (await verifyCsrf(formData)) {
    await withDb((db) => {
      const user = db.users.find((entry) => entry.id === id);
      if (user) user.role = user.role === "admin" ? "user" : "admin";
    });
    revalidatePath("/admin/users");
  }
  redirect("/admin/users?saved=1");
}

export async function updateSettingsAction(formData: FormData): Promise<void> {
  await requireAdmin();
  if (await verifyCsrf(formData)) {
    await withDb((db) => {
      db.settings = {
        siteName: text(formData, "siteName"),
        supportPhone: text(formData, "supportPhone"),
        whatsapp: text(formData, "whatsapp"),
        email: text(formData, "email"),
        announcement: text(formData, "announcement"),
      };
    });
    revalidatePath("/", "layout");
  }
  redirect("/admin/settings?saved=1");
}

export async function addSliderAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const image = text(formData, "image");
  if ((await verifyCsrf(formData)) && image) {
    await withDb((db) => {
      db.sliders.push({ id: newId(), image, link: text(formData, "link") || "/" });
    });
    revalidatePath("/");
  }
  redirect("/admin/settings?saved=1");
}

export async function removeSliderAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = text(formData, "id");
  if (await verifyCsrf(formData)) {
    await withDb((db) => {
      db.sliders = db.sliders.filter((entry) => entry.id !== id);
    });
    revalidatePath("/");
  }
  redirect("/admin/settings?saved=1");
}
