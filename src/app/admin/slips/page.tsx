import Link from "next/link";
import { deleteSlipAction } from "@/app/actions";
import { csrfToken } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { dateLabel, isExpired, money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminSlipsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const [db, csrf] = await Promise.all([readDb(), csrfToken()]);
  const slips = [...db.slips].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Betslips</h1>
          <p className="text-xs text-[#888]">{slips.length} total</p>
        </div>
        <Link
          href="/admin/slips/new"
          className="gold-gradient rounded-full px-4 py-2 text-[11px] font-extrabold uppercase tracking-wide text-black"
        >
          New betslip
        </Link>
      </div>

      {saved ? <p className="alert-success mb-5">Betslip {saved}.</p> : null}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#121212]">
        <table className="admin-table min-w-[820px]">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Odds</th>
              <th>Price</th>
              <th>Validity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slips.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-[#888]">
                  No betslips yet.
                </td>
              </tr>
            ) : (
              slips.map((slip) => {
                const expired = isExpired(slip.validity);
                return (
                  <tr key={slip.id}>
                    <td>
                      <p className="font-bold text-white">{slip.title}</p>
                      <p className="font-mono text-[10px] text-[#888]">{slip.code}</p>
                    </td>
                    <td className="text-white/70">{slip.category}</td>
                    <td className="font-bold text-gold">{slip.odds.toFixed(2)}</td>
                    <td className="text-white/80">{money(slip.price)}</td>
                    <td className="text-xs text-[#888]">{dateLabel(slip.validity)}</td>
                    <td>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          slip.status === "inactive"
                            ? "bg-white/10 text-white/50"
                            : expired
                              ? "bg-red-500/10 text-red-300"
                              : "bg-emerald-500/10 text-emerald-300"
                        }`}
                      >
                        {slip.status === "inactive" ? "inactive" : expired ? "expired" : "live"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/slips/${slip.id}/edit`}
                          className="rounded-lg border border-white/10 px-3 py-1.5 text-[11px] font-bold text-white/70 hover:border-gold/40 hover:text-gold"
                        >
                          Edit
                        </Link>
                        <form action={deleteSlipAction}>
                          <input type="hidden" name="csrf" value={csrf} />
                          <input type="hidden" name="id" value={slip.id} />
                          <button
                            type="submit"
                            className="rounded-lg border border-red-500/20 px-3 py-1.5 text-[11px] font-bold text-red-300 hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
