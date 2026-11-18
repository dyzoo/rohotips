import { markOrderFailed, markOrderPaid } from "@/lib/payments";

export const dynamic = "force-dynamic";

interface HarakaWebhook {
  order_id?: string;
  status?: string;
}

export async function POST(request: Request) {
  const secret = process.env.HARAKAPAY_WEBHOOK_SECRET?.trim();
  if (secret && request.headers.get("x-harakapay-secret") !== secret) {
    return Response.json({ received: false }, { status: 401 });
  }

  let body: HarakaWebhook;
  try {
    body = (await request.json()) as HarakaWebhook;
  } catch {
    return Response.json({ received: false }, { status: 400 });
  }

  const orderId = body.order_id?.trim();
  if (!orderId) return Response.json({ received: false }, { status: 400 });

  const status = body.status?.toLowerCase();
  if (status === "completed") await markOrderPaid("", orderId);
  if (status === "failed" || status === "cancelled") await markOrderFailed(orderId);

  return Response.json({ received: true });
}
