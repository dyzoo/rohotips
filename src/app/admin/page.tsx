import Link from "next/link";
import { readDb } from "@/lib/db";
import { dateLabel, isExpired, money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const db = await readDb();
  const activeSlips = db.slips.filter(
    (slip) => slip.status === "active" && !isExpired(slip.validity),
  );
  const paidOrders = db.orders.filter((order) => order.status === "paid");
  const pendingOrders = db.orders.filter((order) => order.status === "pending");
  const revenue = paidOrders.reduce((sum, order) => sum + order.amount, 0);

  const stats = [
    { label: "Users", value: String(db.users.length), href: "/admin/users" },
    { label: "Active betslips", value: String(activeSlips.length), href: "/admin/slips" },
    { label: "Paid orders", value: String(paidOrders.length), href: "/admin/orders" },
    { label: "Revenue", value: money(revenue), href: "/admin/orders" },
  ];

  const recent = [...db.orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);
  const users = new Map(db.users.map((user) => [user.id, user]));
  const slips = new Map(db.slips.map((slip) => [slip.id, slip]));

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-white">Dashboard</h1>
      <p className="mb-6 text-xs text-[#888]">Overview of ChampeeTips performance.</p>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-white/10 bg-[#121212] p-5 transition hover:border-gold/40"
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#888]">{stat.label}</p>
            <p className="mt-2 text-2xl font-black text-gold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gold">Recent orders</h2>
        <div className="flex gap-2">
          <Link
            href="/admin/slips/new"
            className="gold-gradient rounded-full px-4 py-2 text-[11px] font-extrabold uppercase tracking-wide text-black"
          >
            New betslip
          </Link>
          {pendingOrders.length > 0 ? (
            <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-[11px] font-bold text-yellow-300">
              {pendingOrders.length} pending
            </span>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#121212]">
        <table className="admin-table min-w-[720px]">
          <thead>
            <tr>
              <th>Reference</th>
              <th>User</th>
              <th>Betslip</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-[#888]">
                  No orders yet.
                </td>
              </tr>
            ) : (
              recent.map((order) => (
                <tr key={order.id}>
                  <td className="font-mono text-xs text-white">{order.reference}</td>
                  <td className="text-white/80">{users.get(order.userId)?.email ?? order.userId}</td>
                  <td className="text-white/80">{slips.get(order.slipId)?.title ?? order.slipId}</td>
                  <td className="font-bold text-gold">{money(order.amount)}</td>
                  <td className="uppercase text-white/70">{order.status}</td>
                  <td className="text-xs text-[#888]">{dateLabel(order.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
