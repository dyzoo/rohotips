import Link from "next/link";
import { logoutAction } from "@/app/actions";
import { csrfToken, requireUser } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { dateLabel, initials, money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser("/profile");
  const [csrf, db] = await Promise.all([csrfToken(), readDb()]);
  const orders = db.orders.filter((order) => order.userId === user.id);
  const paid = orders.filter((order) => order.status === "paid");

  const links = [
    { href: "/mybets", label: "My Bets", description: "Unlocked betslips and pending payments" },
    { href: "/support", label: "Help & Support", description: "WhatsApp and phone support 24/7" },
    { href: "/privacy", label: "Privacy Policy", description: "How we handle your data" },
  ];

  return (
    <div className="animate-enter">
      <div className="mb-6 rounded-3xl border border-white/10 bg-[#121212] p-6">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-gold text-xl font-black text-black">
            {initials(user.name)}
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-extrabold text-white">{user.name}</h1>
            <p className="truncate text-xs text-[#888]">{user.email}</p>
            <p className="mt-1 inline-flex rounded-full border border-gold/25 bg-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold">
              {user.role}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/5 pt-5">
          <div>
            <p className="text-lg font-black text-white">{paid.length}</p>
            <p className="text-[10px] uppercase tracking-widest text-[#888]">Bets</p>
          </div>
          <div>
            <p className="text-lg font-black text-white">{orders.length}</p>
            <p className="text-[10px] uppercase tracking-widest text-[#888]">Orders</p>
          </div>
          <div>
            <p className="text-lg font-black text-white">{money(paid.reduce((sum, order) => sum + order.amount, 0))}</p>
            <p className="text-[10px] uppercase tracking-widest text-[#888]">Spent</p>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-[#888]">
        <div className="flex justify-between gap-3 py-1">
          <span>Phone</span>
          <span className="font-semibold text-white">{user.phone}</span>
        </div>
        <div className="flex justify-between gap-3 py-1">
          <span>Member since</span>
          <span className="font-semibold text-white">{dateLabel(user.createdAt)}</span>
        </div>
      </div>

      <div className="space-y-2">
        {user.role === "admin" ? (
          <Link
            href="/admin"
            className="flex items-center justify-between rounded-2xl border border-gold/25 bg-gold/10 px-4 py-4 text-sm font-bold text-gold transition hover:bg-gold/15"
          >
            Admin panel
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ) : null}

        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:border-gold/40"
          >
            <span>
              <span className="block text-sm font-bold text-white">{link.label}</span>
              <span className="block text-[11px] text-[#888]">{link.description}</span>
            </span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/40">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </div>

      <form action={logoutAction} className="mt-6">
        <input type="hidden" name="csrf" value={csrf} />
        <button
          type="submit"
          className="w-full rounded-2xl border border-red-500/25 bg-red-500/5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/10"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
