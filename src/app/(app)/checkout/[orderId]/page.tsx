import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { PaymentPoller } from "@/components/payment-poller";
import { requireUser } from "@/lib/auth";
import { findOrder, findSlip } from "@/lib/db";
import { dateLabel, money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const user = await requireUser(`/checkout/${orderId}`);
  const order = await findOrder(orderId);

  if (!order || order.userId !== user.id) notFound();

  const slip = await findSlip(order.slipId);

  return (
    <div className="animate-enter">
      <Link
        href={`/betslip/${order.slipId}`}
        className="mb-5 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-white/45 transition hover:text-gold"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to slip
      </Link>

      <div className="card p-5 sm:p-6">
        <div className="panel-head">
          <div>
            <p className="eyebrow !text-[9px]">Payment / {order.reference}</p>
            <h1 className="mt-1 text-lg font-extrabold uppercase tracking-wide text-white">Checkout</h1>
          </div>
          <PaymentPoller orderId={order.id} initialStatus={order.status} />
        </div>

        <div className="mb-5 border-y border-white/[0.07] py-2 font-mono text-[11px]">
          {[
            { label: "Betslip", value: slip?.title ?? order.slipId },
            { label: "Amount", value: money(order.amount), gold: true },
            { label: "Phone", value: order.phone },
            { label: "Reference", value: order.reference },
            { label: "Created", value: dateLabel(order.createdAt) },
          ].map((row) => (
            <div key={row.label} className="flex justify-between gap-3 border-b border-white/[0.05] py-2 last:border-b-0">
              <span className="uppercase tracking-widest text-white/35">{row.label}</span>
              <span className={`text-right font-bold ${row.gold ? "text-gold" : "text-white"}`}>{row.value}</span>
            </div>
          ))}
        </div>

        {order.status === "paid" ? (
          <div className="space-y-4">
            <div className="alert-success text-center">
              Payment received. Your betslip is unlocked.
            </div>
            {slip ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/30 bg-gold/[0.06] p-4">
                <div>
                  <p className="eyebrow !text-[9px]">Booking code</p>
                  <p className="num mt-1 text-xl font-bold tracking-widest text-gold">{slip.code}</p>
                </div>
                <CopyButton value={slip.code} />
              </div>
            ) : null}
            <Link href={`/betslip/${order.slipId}`} className="btn-gold">
              View unlocked slip
            </Link>
          </div>
        ) : order.status === "pending" ? (
          <div className="space-y-4">
            <div className="rounded-xl border-l-2 border-gold bg-gold/[0.06] p-4 text-sm leading-relaxed text-gold/90">
              {order.mode === "live"
                ? `A payment request was sent to ${order.phone}. Enter your M-Pesa PIN to complete the payment.`
                : "We are confirming your payment. This page will update automatically once it is received."}
            </div>
            <Link href="/mybets" className="btn-outline">
              Check my bets
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="alert-error text-center">
              This payment was {order.status}. You can try again from the betslip page.
            </div>
            <Link href={`/betslip/${order.slipId}`} className="btn-outline">
              Try again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
