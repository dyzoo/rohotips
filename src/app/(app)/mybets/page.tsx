import Link from "next/link";
import { Countdown } from "@/components/countdown";
import { requireUser } from "@/lib/auth";
import { isSlipVisibleToUsers, readDb } from "@/lib/db";
import { dateLabel, money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MyBetsPage() {
  const user = await requireUser("/mybets");
  const db = await readDb();

  const orders = db.orders
    .filter((order) => order.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const slips = new Map(db.slips.map((slip) => [slip.id, slip]));
  const paid = orders.filter((order) => order.status === "paid");
  const pending = orders.filter((order) => order.status === "pending");
  const now = Date.now();
  const visiblePaid = paid.filter((order) => {
    const slip = slips.get(order.slipId);
    return slip ? isSlipVisibleToUsers(slip, now) : false;
  });

  return (
    <div className="animate-enter">
      <p className="eyebrow">Account / Ledger</p>
      <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">My bets</h1>
      <p className="mb-6 mt-1 text-xs text-white/40">Betslips you have unlocked and pending payments.</p>

      <div className="mb-8 grid grid-cols-3 border-y border-gold/20">
        <div className="border-r border-white/[0.07] px-2 py-4 text-center">
          <p className="num text-xl font-bold text-gold">{String(paid.length).padStart(2, "0")}</p>
          <p className="eyebrow mt-1 !text-[8px] text-white/35">Unlocked</p>
        </div>
        <div className="border-r border-white/[0.07] px-2 py-4 text-center">
          <p className="num text-xl font-bold text-gold">{String(pending.length).padStart(2, "0")}</p>
          <p className="eyebrow mt-1 !text-[8px] text-white/35">Pending</p>
        </div>
        <div className="px-2 py-4 text-center">
          <p className="num text-lg font-bold text-gold">{money(paid.reduce((sum, order) => sum + order.amount, 0))}</p>
          <p className="eyebrow mt-1 !text-[8px] text-white/35">Spent</p>
        </div>
      </div>

      <section className="mb-8">
        <div className="section-head">
          <div>
            <p className="eyebrow">Section 01</p>
            <h2>Unlocked slips</h2>
          </div>
          <span className="count-badge">{String(visiblePaid.length).padStart(2, "0")}</span>
        </div>
        {visiblePaid.length === 0 ? (
          <div className="panel-plain p-6 text-center text-sm text-white/40">
            You have no active unlocked betslip yet.{" "}
            <Link href="/" className="font-bold text-gold">
              Browse tips
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {visiblePaid.map((order) => {
              const slip = slips.get(order.slipId);
              return (
                <Link key={order.id} href={`/betslip/${order.slipId}`} className="card block p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold uppercase tracking-wide text-white">
                        {slip?.title ?? order.slipId}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">
                        {dateLabel(order.paidAt ?? order.createdAt)}
                      </p>
                    </div>
                    <span className="tag !border-emerald-500/35 !bg-emerald-500/[0.08] !text-emerald-300">
                      Paid
                    </span>
                  </div>
                  <div className="my-4 border-t border-white/[0.07]" />
                  <div className="flex items-center justify-between gap-3 font-mono text-[11px]">
                    <span className="text-white/40">
                      {slip ? <Countdown validity={slip.validity} /> : "Expired"}
                    </span>
                    <span className="font-bold tracking-widest text-gold">{slip?.code ?? "—"}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <div className="section-head">
          <div>
            <p className="eyebrow">Section 02</p>
            <h2>Pending payments</h2>
          </div>
          <span className="count-badge">{String(pending.length).padStart(2, "0")}</span>
        </div>
        {pending.length === 0 ? (
          <div className="panel-plain p-6 text-center text-sm text-white/40">No pending payments.</div>
        ) : (
          <div className="space-y-3">
            {pending.map((order) => (
              <Link key={order.id} href={`/checkout/${order.id}`} className="card block p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="num text-lg font-bold text-white">{money(order.amount)}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">
                      Ref {order.reference}
                    </p>
                  </div>
                  <span className="tag !border-yellow-500/35 !bg-yellow-500/[0.08] !text-yellow-300">
                    Pending
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
