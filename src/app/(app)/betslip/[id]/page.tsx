import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { payForSlipAction } from "@/app/actions";
import { CopyButton } from "@/components/copy-button";
import { Countdown } from "@/components/countdown";
import { csrfToken, getCurrentUser } from "@/lib/auth";
import { findSlip, getSettings } from "@/lib/db";
import { dateLabel, isExpired, money } from "@/lib/format";
import { userHasSlip } from "@/lib/payments";

export const dynamic = "force-dynamic";

const methods = ["M-Pesa", "Tigo Pesa", "Airtel Money", "HaloPesa"] as const;

export default async function BetslipPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const [slip, user, settings] = await Promise.all([findSlip(id), getCurrentUser(), getSettings()]);

  if (!slip) notFound();

  const purchased = user ? await userHasSlip(user.id, slip.id) : false;
  const expired = isExpired(slip.validity);
  const csrf = await csrfToken();

  return (
    <div className="animate-enter">
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/70 transition hover:text-gold"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </Link>

      <div className="betslip-card mb-6">
        <div className="mb-5 flex items-start justify-between gap-3 border-b border-[#222] pb-4">
          <div className="flex items-center gap-3">
            <div className="ig-story-ring">
              <Image src="/avatar.svg" alt={settings.siteName} width={42} height={42} className="avatar" unoptimized />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white">{slip.title}</h1>
              <p className="text-xs text-[#888]">{settings.siteName} &bull; {slip.matches.length} matches</p>
            </div>
          </div>
          <span className="category-pill">{slip.category}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-3xl font-black text-white">{slip.odds.toFixed(2)}</div>
            <div className="text-xs uppercase tracking-wide text-[#888]">Total odds</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-gold">{money(slip.price)}</div>
            <div className="text-xs uppercase tracking-wide text-[#888]">Price</div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/5 bg-black/30 px-3 py-3 text-[13px] text-[#888]">
          <span>
            Validity &bull; <Countdown validity={slip.validity} />
          </span>
          <span className="text-[11px] uppercase tracking-wide">
            Expires {dateLabel(slip.validity)}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {slip.bookmakers.map((bookmaker) => (
            <span
              key={bookmaker}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white/80"
            >
              {bookmaker}
            </span>
          ))}
        </div>
      </div>

      {error ? <p className="alert-error mb-5">Payment could not be started. Please check your details and try again.</p> : null}

      {purchased ? (
        <div className="mb-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/25 bg-gold/5 p-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gold/70">Booking code</p>
              <p className="mt-1 font-mono text-xl font-black tracking-widest text-gold">{slip.code}</p>
            </div>
            <CopyButton value={slip.code} />
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121212]">
            {slip.matches.map((match, index) => (
              <div
                key={`${match.home}-${match.away}`}
                className={`flex items-start justify-between gap-3 px-4 py-4 ${
                  index < slip.matches.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-white">
                    {match.home} <span className="text-white/40">vs</span> {match.away}
                  </p>
                  <p className="mt-1 text-xs text-[#888]">
                    {match.market} &bull; {match.time}
                  </p>
                </div>
                <span className="rounded-lg bg-white/5 px-3 py-1 text-sm font-black text-gold">
                  {match.odd.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/mybets"
            className="mt-4 block rounded-xl border border-white/10 bg-white/5 py-3 text-center text-sm font-bold text-white/80 transition hover:border-gold/40 hover:text-gold"
          >
            View all my bets
          </Link>
        </div>
      ) : expired ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
          <p className="text-sm font-bold text-red-300">This betslip has expired.</p>
          <Link href="/" className="mt-3 inline-block text-xs font-bold uppercase tracking-wide text-gold">
            Browse active betslips
          </Link>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-[#121212] p-5">
          <h2 className="mb-1 text-base font-extrabold text-white">Unlock this betslip</h2>
          <p className="mb-5 text-xs leading-relaxed text-[#888]">
            Lipia {money(slip.price)} kupata booking code kamili na uchambuzi wa mechi zote.
          </p>

          {user ? (
            <form action={payForSlipAction} className="space-y-4">
              <input type="hidden" name="csrf" value={csrf} />
              <input type="hidden" name="slipId" value={slip.id} />

              <div>
                <label htmlFor="method" className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#888]">
                  Payment method
                </label>
                <select
                  id="method"
                  name="method"
                  className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm font-semibold text-white outline-none focus:border-gold"
                  defaultValue="M-Pesa"
                >
                  {methods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="phone" className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#888]">
                  Phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={user.phone}
                  placeholder="07XX XXX XXX"
                  className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm font-semibold text-white outline-none focus:border-gold"
                  required
                />
              </div>

              <button
                type="submit"
                className="gold-gradient w-full rounded-xl py-4 text-sm font-extrabold uppercase tracking-wide text-[#0a0a0a] transition hover:scale-[1.01]"
              >
                Lipa {money(slip.price)}
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <Link
                href={`/login?next=${encodeURIComponent(`/betslip/${slip.id}`)}`}
                className="gold-gradient block rounded-xl py-4 text-center text-sm font-extrabold uppercase tracking-wide text-[#0a0a0a]"
              >
                Ingia kulipia
              </Link>
              <Link
                href="/register"
                className="block rounded-xl border border-white/10 py-3 text-center text-xs font-bold uppercase tracking-wide text-white/70"
              >
                Create an account
              </Link>
            </div>
          )}

          <div className="mt-5 border-t border-white/5 pt-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#888]">Locked matches</p>
            <ul className="space-y-2">
              {slip.matches.map((match) => (
                <li key={`${match.home}-${match.away}`} className="flex items-center justify-between gap-2 text-xs text-white/40">
                  <span className="truncate">
                    {match.home} vs {match.away}
                  </span>
                  <span className="shrink-0 rounded bg-white/5 px-2 py-0.5 font-mono">•••</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
