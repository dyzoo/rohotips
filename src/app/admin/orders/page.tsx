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
      <h1 className="text-2xl font-extrabold text-white">Orders</h1>
      <p className="mb-6 text-xs text-[#888]">{orders.length} total orders</p>

      {saved ? <p className="alert-success mb-5">Order updated.</p> : null}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#121212]">
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
                <td colSpan={8} className="py-10 text-center text-[#888]">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <p className="font-mono text-xs text-white">{order.reference}</p>
                    <p className="text-[10px] text-[#888]">{order.mode}</p>
                  </td>
                  <td>
                    <p className="text-white/80">{users.get(order.userId)?.name ?? order.userId}</p>
                    <p className="text-[10px] text-[#888]">{users.get(order.userId)?.email}</p>
                  </td>
                  <td className="text-white/80">{slips.get(order.slipId)?.title ?? order.slipId}</td>
                  <td className="font-bold text-gold">{money(order.amount)}</td>
                  <td className="text-white/70">{order.method}</td>
                  <td className="text-xs text-[#888]">{dateLabel(order.createdAt)}</td>
                  <td>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
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
                        className="rounded-lg border border-white/10 bg-[#0a0a0a] px-2 py-1.5 text-xs text-white outline-none focus:border-gold"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="rounded-lg border border-gold/30 bg-gold/10 px-3 py-1.5 text-[11px] font-bold text-gold hover:bg-gold/20"
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
