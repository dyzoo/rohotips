import Link from "next/link";
import { deleteSlipAction } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
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
      <div className="section-head">
        <div>
          <p className="eyebrow">Inventory / Slips</p>
          <h2>Betslips</h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">{slips.length} total</p>
        </div>
        <Link
          href="/admin/slips/new"
          className="border border-gold/40 bg-gold/[0.07] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-gold transition hover:bg-gold/15"
        >
          New betslip
        </Link>
      </div>

      {saved ? <p className="alert-success mb-5">Betslip {saved}.</p> : null}

      <div className="panel overflow-x-auto">
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
                <td colSpan={7} className="py-10 text-center text-white/40">
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
                      <p className="font-mono text-[10px] text-white/40">{slip.code}</p>
                    </td>
                    <td className="text-white/70">{slip.category}</td>
                    <td className="font-bold text-gold">{slip.odds.toFixed(2)}</td>
                    <td className="text-white/80">{money(slip.price)}</td>
                    <td className="text-xs text-white/40">{dateLabel(slip.validity)}</td>
                    <td>
                      <span
                        className={`border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
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
                          className="border border-white/15 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white/70 hover:border-gold/40 hover:text-gold"
                        >
                          Edit
                        </Link>
                        <form action={deleteSlipAction}>
                          <input type="hidden" name="csrf" value={csrf} />
                          <input type="hidden" name="id" value={slip.id} />
                          <ConfirmSubmitButton
                            message={`Delete "${slip.title}"? This cannot be undone.`}
                            className="border border-red-500/20 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-red-300 hover:bg-red-500/10"
                          >
                            Delete
                          </ConfirmSubmitButton>
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
