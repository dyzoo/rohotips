import { toggleUserRoleAction } from "@/app/actions";
import { csrfToken } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { dateLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const [db, csrf] = await Promise.all([readDb(), csrfToken()]);
  const users = [...db.users].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const orders = db.orders;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white">Users</h1>
      <p className="mb-6 text-xs text-[#888]">{users.length} registered accounts</p>

      {saved ? <p className="alert-success mb-5">User role updated.</p> : null}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#121212]">
        <table className="admin-table min-w-[760px]">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Orders</th>
              <th>Joined</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="font-bold text-white">{user.name}</td>
                <td className="text-white/70">{user.email}</td>
                <td className="text-white/70">{user.phone}</td>
                <td className="text-white/70">{orders.filter((order) => order.userId === user.id).length}</td>
                <td className="text-xs text-[#888]">{dateLabel(user.createdAt)}</td>
                <td>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      user.role === "admin" ? "bg-gold/15 text-gold" : "bg-white/10 text-white/60"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>
                  <form action={toggleUserRoleAction}>
                    <input type="hidden" name="csrf" value={csrf} />
                    <input type="hidden" name="id" value={user.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-[11px] font-bold text-white/70 hover:border-gold/40 hover:text-gold"
                    >
                      Make {user.role === "admin" ? "user" : "admin"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
