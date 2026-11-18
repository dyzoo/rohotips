import { readDb, withDb } from "./db";
import { randomId } from "./crypto";
import type { Order, OrderStatus, PaymentMethod } from "./types";

const HARAKAPAY_BASE_URL = "https://harakapay.net";
const harakaConfigured = Boolean(process.env.HARAKAPAY_API_KEY);

type HarakaResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

type CollectResponse = HarakaResponse & {
  order_id?: string;
};

type StatusResponse = HarakaResponse & {
  payment?: {
    status?: string;
  };
};

function phoneForHarakapay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("255")) return `0${digits.slice(3)}`;
  if (digits.startsWith("254")) return `0${digits.slice(3)}`;
  if (digits.startsWith("0")) return digits;
  return `0${digits}`;
}

function webhookUrl(): string | undefined {
  const configured = process.env.HARAKAPAY_WEBHOOK_URL?.trim();
  if (configured) return configured;
  const base = process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  return base ? `${base.replace(/\/$/, "")}/api/payments/harakapay` : undefined;
}

async function harakapayRequest<T extends HarakaResponse>(path: string, init: RequestInit = {}): Promise<T> {
  const apiKey = process.env.HARAKAPAY_API_KEY;
  if (!apiKey) throw new Error("HarakaPay is not configured");
  const response = await fetch(`${HARAKAPAY_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      ...(init.headers as Record<string, string> | undefined),
    },
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as T;
  if (!response.ok || data.success === false) {
    throw new Error(data.message ?? data.error ?? "HarakaPay request failed");
  }
  return data;
}

async function harakapayCollect(order: Order, description: string): Promise<string> {
  const hook = webhookUrl();
  const data = await harakapayRequest<CollectResponse>("/api/v1/collect", {
    method: "POST",
    body: JSON.stringify({
      phone: phoneForHarakapay(order.phone),
      amount: Math.round(order.amount),
      description: description.slice(0, 120),
      ...(hook ? { webhook_url: hook } : {}),
    }),
  });
  if (!data.order_id) throw new Error(data.message ?? "HarakaPay did not return an order id");
  return data.order_id;
}

export function paymentMode(): "demo" | "live" {
  return harakaConfigured ? "live" : "demo";
}

export async function createOrder(
  userId: string,
  slipId: string,
  method: PaymentMethod,
  phone: string,
): Promise<Order> {
  const snapshot = await readDb();
  const slip = snapshot.slips.find((entry) => entry.id === slipId);
  if (!slip || slip.status !== "active") throw new Error("This betslip is not available");
  if (new Date(slip.validity).getTime() <= Date.now()) throw new Error("This betslip has expired");

  const previous = snapshot.orders.find(
    (entry) => entry.userId === userId && entry.slipId === slipId && entry.status === "pending",
  );
  if (previous) return previous;

  const order = await withDb((db) => {
    const existing = db.orders.find(
      (entry) => entry.userId === userId && entry.slipId === slipId && entry.status === "paid",
    );
    if (existing) throw new Error("You already purchased this betslip");
    const created: Order = {
      id: randomId(12),
      userId,
      slipId,
      amount: slip.price,
      method,
      phone: phone.trim(),
      status: "pending",
      reference: `CT-${randomId(5).toUpperCase()}`,
      checkoutRequestId: "",
      mode: harakaConfigured && method === "M-Pesa" ? "live" : "demo",
      createdAt: new Date().toISOString(),
    };
    db.orders.push(created);
    return created;
  });

  if (order.mode === "live") {
    try {
      if (order.amount < 100) throw new Error("The minimum payment is TZS 100");
      const harakaOrderId = await harakapayCollect(
        order,
        `${snapshot.settings.siteName} - ${slip.title}`,
      );
      await withDb((db) => {
        const target = db.orders.find((entry) => entry.id === order.id);
        if (target) target.checkoutRequestId = harakaOrderId;
      });
      order.checkoutRequestId = harakaOrderId;
    } catch (error) {
      await markOrderFailed(order.id);
      throw error;
    }
  } else {
    const demoId = `DEMO-${randomId(8).toUpperCase()}`;
    await withDb((db) => {
      const target = db.orders.find((entry) => entry.id === order.id);
      if (target) target.checkoutRequestId = demoId;
    });
    order.checkoutRequestId = demoId;
  }

  return order;
}

export async function syncOrderFromHarakapay(orderId: string): Promise<OrderStatus | null> {
  if (!harakaConfigured) return null;
  const order = (await readDb()).orders.find((entry) => entry.id === orderId);
  if (
    !order ||
    order.status !== "pending" ||
    order.mode !== "live" ||
    !order.checkoutRequestId
  ) {
    return null;
  }

  const data = await harakapayRequest<StatusResponse>(
    `/api/v1/status/${encodeURIComponent(order.checkoutRequestId)}`,
  );
  const status = data.payment?.status?.toLowerCase();
  if (status === "completed") {
    await markOrderPaid("", order.checkoutRequestId);
    return "paid";
  }
  if (status === "failed" || status === "cancelled") {
    await markOrderFailed(order.id);
    return "failed";
  }
  return order.status;
}

export async function markOrderPaid(reference: string, checkoutRequestId = ""): Promise<Order | null> {
  return withDb((db) => {
    const order = db.orders.find(
      (entry) =>
        entry.reference.toLowerCase() === reference.toLowerCase() ||
        (checkoutRequestId !== "" && entry.checkoutRequestId === checkoutRequestId),
    );
    if (!order || order.status === "paid") return order ?? null;
    order.status = "paid";
    order.paidAt = new Date().toISOString();
    return order;
  });
}

export async function markOrderFailed(id: string): Promise<void> {
  await withDb((db) => {
    const order = db.orders.find(
      (entry) => entry.id === id || entry.checkoutRequestId === id,
    );
    if (order && order.status === "pending") order.status = "failed";
  });
}

export async function userHasSlip(userId: string, slipId: string): Promise<boolean> {
  const db = await readDb();
  return db.orders.some(
    (order) => order.userId === userId && order.slipId === slipId && order.status === "paid",
  );
}
