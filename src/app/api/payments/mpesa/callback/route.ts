import { markOrderFailed, markOrderPaid } from "@/lib/payments";

export const dynamic = "force-dynamic";

interface CallbackBody {
  Body?: {
    stkCallback?: {
      CheckoutRequestID?: string;
      ResultCode?: number;
      ResultDesc?: string;
    };
  };
}

export async function POST(request: Request) {
  const secret = process.env.MPESA_CALLBACK_SECRET;
  if (secret && request.headers.get("x-callback-secret") !== secret) {
    return Response.json({ ResultCode: 1, ResultDesc: "Unauthorized" }, { status: 401 });
  }

  let body: CallbackBody;
  try {
    body = (await request.json()) as CallbackBody;
  } catch {
    return Response.json({ ResultCode: 1, ResultDesc: "Invalid JSON" }, { status: 400 });
  }

  const callback = body.Body?.stkCallback;
  if (!callback?.CheckoutRequestID) {
    return Response.json({ ResultCode: 1, ResultDesc: "Missing checkout request" }, { status: 400 });
  }

  if (callback.ResultCode === 0) {
    await markOrderPaid("", callback.CheckoutRequestID);
    return Response.json({ ResultCode: 0, ResultDesc: "Success" });
  }

  await markOrderFailed(callback.CheckoutRequestID);
  return Response.json({ ResultCode: 0, ResultDesc: callback.ResultDesc ?? "Accepted" });
}
