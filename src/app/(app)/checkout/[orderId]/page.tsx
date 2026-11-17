import Link from "next/link";
import { notFound } from "next/navigation";
import { simulatePaymentAction } from "@/app/actions";
import { CopyButton } from "@/components/copy-button";
import { PaymentPoller } from "@/components/payment-poller";
import { csrfToken, requireUser } from "@/lib/auth";
import { findOrder, findSlip } from "@/lib/db";
import { dateLabel, money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const user = await requireUser(`/checkout/${orderId}`);
  const order = await findOrder(orderId);

  if (!order || order.userId !== user.id) notFound();

  const slip = await findSlip(order.slipId);
  const csrf = await csrfToken();

  return (
    <div className="animate-enter">
      <Link
        href={`/betslip/${order.slipId}`}
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/70 transition hover:text-gold"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </Link>

      <div className="rounded-3xl border border-white/10 bg-[#121212] p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h1 className="text-xl font-extrabold text-white">Payment</h1>
          <PaymentPoller orderId={order.id} initialStatus={order.status} />
        </div>

        <div className="mb-5 space-y-3 rounded-2xl border border-white/5 bg-black/30 p-4 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-[#888]">Betslip</span>
            <span className="text-right font-semibold text-white">{slip?.title ?? order.slipId}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-[#888]">Amount</span>
            <span className="font-black text-gold">{money(order.amount)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-[#888]">Method</span>
            <span className="font-semibold text-white">{order.method}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-[#888]">Phone</span>
            <span className="font-semibold text-white">{order.phone}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-[#888]">Reference</span>
            <span className="font-mono text-xs font-semibold text-white">{order.reference}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-[#888]">Created</span>
            <span className="text-right text-xs font-semibold text-white">{dateLabel(order.createdAt)}</span>
          </div>
        </div>

        {order.status === "paid" ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4 text-center">
              <p className="text-sm font-bold text-emerald-300">Payment received. Your betslip is unlocked.</p>
            </div>
            {slip ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/25 bg-gold/5 p-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gold/70">Booking code</p>
                  <p className="mt-1 font-mono text-xl font-black tracking-widest text-gold">{slip.code}</p>
                </div>
                <CopyButton value={slip.code} />
              </div>
            ) : null}
            <Link
              href={`/betslip/${order.slipId}`}
              className="gold-gradient block rounded-xl py-4 text-center text-sm font-extrabold uppercase tracking-wide text-[#0a0a0a]"
            >
              View unlocked betslip
            </Link>
          </div>
        ) : order.status === "pending" ? (
          <div className="space-y-4">
            {order.mode === "live" ? (
              <div className="rounded-2xl border border-gold/20 bg-gold/5 p-4 text-center text-sm text-gold">
                A payment request was sent to {order.phone}. Enter your M-Pesa PIN to complete the payment.
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-xs leading-relaxed text-white/60">
                Demo mode is active. Use the button below to simulate a successful payment. Configure the M-Pesa
                environment variables to switch to live STK push.
              </div>
            )}

            {order.mode === "demo" ? (
              <form action={simulatePaymentAction}>
                <input type="hidden" name="csrf" value={csrf} />
                <input type="hidden" name="orderId" value={order.id} />
                <button
                  type="submit"
                  className="gold-gradient w-full rounded-xl py-4 text-sm font-extrabold uppercase tracking-wide text-[#0a0a0a]"
                >
                  Simulate successful payment
                </button>
              </form>
            ) : null}

            <Link
              href="/mybets"
              className="block rounded-xl border border-white/10 py-3 text-center text-xs font-bold uppercase tracking-wide text-white/70"
            >
              Check my bets
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-4 text-center text-sm text-red-300">
              This payment was {order.status}. You can try again from the betslip page.
            </div>
            <Link
              href={`/betslip/${order.slipId}`}
              className="block rounded-xl border border-white/10 py-3 text-center text-xs font-bold uppercase tracking-wide text-white/70"
            >
              Try again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
