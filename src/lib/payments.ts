import { readDb, withDb } from "./db";
import { randomId } from "./crypto";
import type { Order, PaymentMethod } from "./types";

const mpesaConfigured = Boolean(
  process.env.MPESA_CONSUMER_KEY &&
    process.env.MPESA_CONSUMER_SECRET &&
    process.env.MPESA_SHORTCODE &&
    process.env.MPESA_PASSKEY &&
    process.env.MPESA_CALLBACK_URL,
);

function phoneForDaraja(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.startsWith("255")) return digits;
  return digits;
}

async function mpesaToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`,
  ).toString("base64");
  const response = await fetch(
    "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` }, cache: "no-store" },
  );
  if (!response.ok) throw new Error("M-Pesa authentication failed");
  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

async function mpesaStkPush(order: Order): Promise<{ checkoutRequestId: string; reference: string }> {
  const token = await mpesaToken();
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`,
  ).toString("base64");
  const reference = `CT${order.id.slice(0, 8).toUpperCase()}`;
  const response = await fetch(
    "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(order.amount),
        PartyA: phoneForDaraja(order.phone),
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phoneForDaraja(order.phone),
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: reference,
        TransactionDesc: `ChampeeTips slip ${order.slipId}`,
      }),
      cache: "no-store",
    },
  );
  const data = (await response.json()) as {
    CheckoutRequestID?: string;
    ResponseCode?: string;
    ResponseDescription?: string;
  };
  if (!response.ok || !data.CheckoutRequestID) {
    throw new Error(data.ResponseDescription ?? "M-Pesa STK push failed");
  }
  return { checkoutRequestId: data.CheckoutRequestID, reference };
}

export function paymentMode(): "demo" | "live" {
  return mpesaConfigured ? "live" : "demo";
}

export async function createOrder(
  userId: string,
  slipId: string,
  method: PaymentMethod,
  phone: string,
): Promise<Order> {
  const slip = await withDb((db) => db.slips.find((entry) => entry.id === slipId) ?? null);
  if (!slip || slip.status !== "active") throw new Error("This betslip is not available");
  if (new Date(slip.validity).getTime() <= Date.now()) throw new Error("This betslip has expired");

  const previous = (await readDb()).orders.find(
    (entry) => entry.userId === userId && entry.slipId === slipId && entry.status === "pending",
  );
  if (previous) return previous;

  const order = await withDb((db) => {
    const existing = db.orders.find(
      (entry) =>
        entry.userId === userId && entry.slipId === slipId && entry.status === "paid",
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
      mode: mpesaConfigured && method === "M-Pesa" ? "live" : "demo",
      createdAt: new Date().toISOString(),
    };
    db.orders.push(created);
    return created;
  });

  if (order.mode === "live") {
    try {
      const result = await mpesaStkPush(order);
      await withDb((db) => {
        const target = db.orders.find((entry) => entry.id === order.id);
        if (target) {
          target.checkoutRequestId = result.checkoutRequestId;
          target.reference = result.reference;
        }
      });
      order.checkoutRequestId = result.checkoutRequestId;
      order.reference = result.reference;
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
