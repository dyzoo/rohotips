import Link from "next/link";
import { Countdown } from "@/components/countdown";
import { requireUser } from "@/lib/auth";
import { readDb } from "@/lib/db";
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

  return (
    <div className="animate-enter">
      <h1 className="mb-1 text-2xl font-extrabold text-white">My Bets</h1>
      <p className="mb-6 text-xs text-[#888]">Betslips you have unlocked and pending payments.</p>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
          <p className="text-xl font-black text-gold">{paid.length}</p>
          <p className="text-[10px] uppercase tracking-widest text-[#888]">Unlocked</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
          <p className="text-xl font-black text-gold">{pending.length}</p>
          <p className="text-[10px] uppercase tracking-widest text-[#888]">Pending</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
          <p className="text-xl font-black text-gold">{money(paid.reduce((sum, order) => sum + order.amount, 0))}</p>
          <p className="text-[10px] uppercase tracking-widest text-[#888]">Spent</p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-gold">Unlocked betslips</h2>
        {paid.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center text-sm text-[#888]">
            You have not unlocked any betslip yet.{" "}
            <Link href="/" className="font-bold text-gold">
              Browse tips
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {paid.map((order) => {
              const slip = slips.get(order.slipId);
              return (
                <Link
                  key={order.id}
                  href={`/betslip/${order.slipId}`}
                  className="block rounded-2xl border border-white/10 bg-[#121212] p-4 transition hover:border-gold/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-white">{slip?.title ?? order.slipId}</p>
                      <p className="mt-1 text-[11px] text-[#888]">
                        {order.method} &bull; {dateLabel(order.paidAt ?? order.createdAt)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                      Paid
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                    <span className="text-[#888]">
                      {slip ? <Countdown validity={slip.validity} /> : "Expired"}
                    </span>
                    <span className="font-mono font-bold tracking-widest text-gold">{slip?.code ?? "—"}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-gold">Pending payments</h2>
        {pending.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center text-sm text-[#888]">
            No pending payments.
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((order) => (
              <Link
                key={order.id}
                href={`/checkout/${order.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#121212] p-4 transition hover:border-gold/40"
              >
                <div>
                  <p className="text-sm font-extrabold text-white">{money(order.amount)}</p>
                  <p className="mt-1 text-[11px] text-[#888]">
                    {order.method} &bull; {order.reference}
                  </p>
                </div>
                <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-yellow-300">
                  Pending
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
