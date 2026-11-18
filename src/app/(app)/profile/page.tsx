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
    { href: "/mybets", label: "My Bets", description: "Unlocked betslips and pending payments", code: "01" },
    { href: "/support", label: "Help & Support", description: "WhatsApp and phone support 24/7", code: "02" },
    { href: "/privacy", label: "Privacy Policy", description: "How we handle your data", code: "03" },
  ];

  return (
    <div className="animate-enter">
      <p className="eyebrow">Account / Profile</p>
      <h1 className="mt-1 mb-6 text-2xl font-black uppercase tracking-tight text-white">Member card</h1>

      <div className="ticket mb-6 px-5 pb-5 pt-5">
        <div className="flex items-center gap-4">
          <span className="num grid h-14 w-14 shrink-0 place-items-center border border-gold/50 bg-gold text-xl font-bold text-black">
            {initials(user.name)}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-extrabold uppercase tracking-wide text-white">{user.name}</h2>
            <p className="truncate font-mono text-[10px] uppercase tracking-wider text-white/40">{user.email}</p>
            <span className="tag mt-2">{user.role}</span>
          </div>
        </div>

        <div className="ticket-divider" />

        <div className="grid grid-cols-3">
          <div className="border-r border-white/[0.07] pr-2">
            <p className="num text-lg font-bold text-white">{String(paid.length).padStart(2, "0")}</p>
            <p className="eyebrow mt-1 !text-[8px] text-white/35">Bets</p>
          </div>
          <div className="border-r border-white/[0.07] px-2">
            <p className="num text-lg font-bold text-white">{String(orders.length).padStart(2, "0")}</p>
            <p className="eyebrow mt-1 !text-[8px] text-white/35">Orders</p>
          </div>
          <div className="pl-2">
            <p className="num text-lg font-bold text-gold">{money(paid.reduce((sum, order) => sum + order.amount, 0))}</p>
            <p className="eyebrow mt-1 !text-[8px] text-white/35">Spent</p>
          </div>
        </div>
      </div>

      <div className="panel-plain mb-6 px-4 py-3 font-mono text-[11px]">
        <div className="flex justify-between gap-3 border-b border-white/[0.06] py-2">
          <span className="uppercase tracking-widest text-white/35">Phone</span>
          <span className="font-bold text-white">{user.phone}</span>
        </div>
        <div className="flex justify-between gap-3 py-2">
          <span className="uppercase tracking-widest text-white/35">Member since</span>
          <span className="font-bold text-white">{dateLabel(user.createdAt)}</span>
        </div>
      </div>

      <div className="section-head">
        <div>
          <p className="eyebrow">Section 01</p>
          <h2>Menu</h2>
        </div>
      </div>

      <div className="space-y-2">
        {user.role === "admin" ? (
          <Link
            href="/admin"
            className="flex items-center justify-between border border-gold/35 bg-gold/[0.07] px-4 py-4 text-sm font-bold text-gold transition hover:bg-gold/[0.12]"
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
            className="group flex items-center gap-4 border border-white/[0.08] bg-white/[0.02] px-4 py-4 transition hover:border-gold/40"
          >
            <span className="num text-[10px] text-gold/60">{link.code}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-white">{link.label}</span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-white/35">{link.description}</span>
            </span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/30 transition group-hover:text-gold">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </div>

      <form action={logoutAction} className="mt-6">
        <input type="hidden" name="csrf" value={csrf} />
        <button
          type="submit"
          className="btn-outline !border-red-500/25 !text-red-300 hover:!border-red-500/50 hover:!bg-red-500/5"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
