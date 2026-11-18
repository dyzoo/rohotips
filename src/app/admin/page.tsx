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
      <p className="eyebrow">Overview / Live</p>
      <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">Dashboard</h1>
      <p className="mb-6 mt-1 text-xs text-white/40">Operations at a glance.</p>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Link key={stat.label} href={stat.href} className="panel p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="eyebrow !text-[9px] text-white/40">{stat.label}</p>
              <span className="num text-[10px] text-gold/50">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <p className="num text-2xl font-bold text-gold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="section-head">
        <div>
          <p className="eyebrow">Section 01</p>
          <h2>Recent orders</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/slips/new"
            className="border border-gold/40 bg-gold/[0.07] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-gold transition hover:bg-gold/15"
          >
            New betslip
          </Link>
          {pendingOrders.length > 0 ? (
            <span className="tag !border-yellow-500/35 !bg-yellow-500/[0.08] !text-yellow-300">
              {pendingOrders.length} pending
            </span>
          ) : null}
        </div>
      </div>

      <div className="panel overflow-x-auto">
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
                <td colSpan={6} className="py-10 text-center text-white/40">
                  No orders yet.
                </td>
              </tr>
            ) : (
              recent.map((order) => (
                <tr key={order.id}>
                  <td className="num text-xs text-white">{order.reference}</td>
                  <td className="text-white/70">{users.get(order.userId)?.email ?? order.userId}</td>
                  <td className="text-white/70">{slips.get(order.slipId)?.title ?? order.slipId}</td>
                  <td className="num font-bold text-gold">{money(order.amount)}</td>
                  <td className="font-mono text-[10px] uppercase tracking-widest text-white/60">{order.status}</td>
                  <td className="text-xs text-white/40">{dateLabel(order.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
