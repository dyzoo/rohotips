import { setOrderStatusAction } from "@/app/actions";
import { csrfToken } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { dateLabel, money } from "@/lib/format";

export const dynamic = "force-dynamic";

const statuses = ["pending", "paid", "failed", "cancelled"] as const;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const [db, csrf] = await Promise.all([readDb(), csrfToken()]);
  const orders = [...db.orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const users = new Map(db.users.map((user) => [user.id, user]));
  const slips = new Map(db.slips.map((slip) => [slip.id, slip]));

  return (
    <div>
      <p className="eyebrow">Ledger / Payments</p>
      <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">Orders</h1>
      <p className="mb-6 mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">{orders.length} total orders</p>

      {saved ? <p className="alert-success mb-5">Order updated.</p> : null}

      <div className="panel overflow-x-auto">
        <table className="admin-table min-w-[900px]">
          <thead>
            <tr>
              <th>Reference</th>
              <th>User</th>
              <th>Betslip</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Created</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-white/40">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <p className="font-mono text-xs text-white">{order.reference}</p>
                    <p className="text-[10px] text-white/40">{order.mode}</p>
                  </td>
                  <td>
                    <p className="text-white/80">{users.get(order.userId)?.name ?? order.userId}</p>
                    <p className="text-[10px] text-white/40">{users.get(order.userId)?.email}</p>
                  </td>
                  <td className="text-white/80">{slips.get(order.slipId)?.title ?? order.slipId}</td>
                  <td className="font-bold text-gold">{money(order.amount)}</td>
                  <td className="text-white/70">{order.method}</td>
                  <td className="text-xs text-white/40">{dateLabel(order.createdAt)}</td>
                  <td>
                    <span
                      className={`border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                        order.status === "paid"
                          ? "bg-emerald-500/10 text-emerald-300"
                          : order.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-300"
                            : "bg-red-500/10 text-red-300"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <form action={setOrderStatusAction} className="flex items-center gap-2">
                      <input type="hidden" name="csrf" value={csrf} />
                      <input type="hidden" name="id" value={order.id} />
                      <select
                        name="status"
                        defaultValue={order.status}
                        className="field !w-auto !px-2 !py-1.5 !text-xs"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="border border-gold/35 bg-gold/[0.07] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-gold hover:bg-gold/20"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
