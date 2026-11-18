import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { payForSlipAction } from "@/app/actions";
import { CopyButton } from "@/components/copy-button";
import { Countdown } from "@/components/countdown";
import { csrfToken, getCurrentUser } from "@/lib/auth";
import { findSlip, getBrandLogos, getSettings } from "@/lib/db";
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
  const [slip, user, settings, logos] = await Promise.all([
    findSlip(id),
    getCurrentUser(),
    getSettings(),
    getBrandLogos(),
  ]);

  if (!slip) notFound();

  const purchased = user ? await userHasSlip(user.id, slip.id) : false;
  const expired = isExpired(slip.validity);
  const csrf = await csrfToken();

  return (
    <div className="animate-enter">
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-white/45 transition hover:text-gold"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to board
      </Link>

      <div className="ticket mb-6 px-4 pb-4 pt-4 sm:px-5">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center border border-gold/35 bg-black/50">
              <Image src="/avatar.svg" alt={settings.siteName} width={30} height={30} className="h-7 w-7 object-contain" unoptimized />
            </span>
            <div className="min-w-0">
              <p className="eyebrow !text-[9px]">Slip / {slip.id}</p>
              <h1 className="truncate text-lg font-extrabold uppercase tracking-wide text-white">{slip.title}</h1>
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                {slip.matches.length} selections
              </p>
            </div>
          </div>
          <span className="tag">{slip.category}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="eyebrow !text-[9px]">Total odds</p>
            <p className="num mt-1 text-3xl font-bold text-white">{slip.odds.toFixed(2)}</p>
          </div>
          <div className="border-l border-gold/25 pl-4 text-right">
            <p className="eyebrow !text-[9px]">Price</p>
            <p className="num mt-1 text-2xl font-bold text-gold">{money(slip.price)}</p>
          </div>
        </div>

        <div className="ticket-divider" />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
            Valid for <Countdown validity={slip.validity} />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
            Expires {dateLabel(slip.validity)}
          </span>
        </div>

        {slip.bookmakers.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {slip.bookmakers.map((bookmaker) => {
              const logo = logos[bookmaker.toLowerCase()];
              return logo ? (
                <span key={bookmaker} className="bookmaker-chip bg-[#e7dfd1] px-2">
                  <Image src={logo} alt={bookmaker} width={70} height={24} className="h-5 w-auto object-contain" unoptimized />
                </span>
              ) : (
                <span key={bookmaker} className="bookmaker-chip">{bookmaker}</span>
              );
            })}
          </div>
        ) : null}
      </div>

      {error ? <p className="alert-error mb-5">Payment could not be started. Please check your details and try again.</p> : null}

      {purchased ? (
        <div className="mb-6">
          <div className="panel mb-4 flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="eyebrow !text-[9px]">Booking code</p>
              <p className="num mt-1 text-xl font-bold tracking-widest text-gold">{slip.code}</p>
            </div>
            <CopyButton value={slip.code} />
          </div>

          <div className="panel-plain overflow-hidden">
            {slip.matches.map((match, index) => (
              <div
                key={`${match.home}-${match.away}`}
                className={`flex items-start justify-between gap-3 px-4 py-4 ${
                  index < slip.matches.length - 1 ? "border-b border-white/[0.06]" : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="font-mono text-[9px] tracking-widest text-gold/60">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    {match.home} <span className="text-white/30">vs</span> {match.away}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">
                    {match.market} / {match.time}
                  </p>
                </div>
                <span className="num border border-gold/30 bg-gold/[0.06] px-2.5 py-1 text-sm font-bold text-gold">
                  {match.odd.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <Link href="/mybets" className="btn-outline mt-4">
            View all my bets
          </Link>
        </div>
      ) : expired ? (
        <div className="alert-error p-6 text-center">
          <p className="text-sm font-bold">This betslip has expired.</p>
          <Link href="/" className="mt-3 inline-block font-mono text-[10px] font-bold uppercase tracking-widest text-gold">
            Browse active betslips
          </Link>
        </div>
      ) : (
        <div className="panel p-5">
          <div className="panel-head">
            <div>
              <p className="eyebrow !text-[9px]">Checkout</p>
              <h2 className="mt-1 text-base font-extrabold uppercase tracking-wide text-white">Unlock this slip</h2>
            </div>
            <span className="num text-lg font-bold text-gold">{money(slip.price)}</span>
          </div>

          <p className="mb-5 text-xs leading-relaxed text-white/45">
            Lipia {money(slip.price)} kupata booking code kamili na uchambuzi wa mechi zote.
          </p>

          {user ? (
            <form action={payForSlipAction} className="space-y-4">
              <input type="hidden" name="csrf" value={csrf} />
              <input type="hidden" name="slipId" value={slip.id} />

              <div>
                <label htmlFor="method" className="field-label">
                  Payment method
                </label>
                <select id="method" name="method" className="field" defaultValue="M-Pesa">
                  {methods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="phone" className="field-label">
                  Phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={user.phone}
                  placeholder="07XX XXX XXX"
                  className="field"
                  required
                />
              </div>

              <button type="submit" className="btn-gold">
                Lipa {money(slip.price)}
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <Link href={`/login?next=${encodeURIComponent(`/betslip/${slip.id}`)}`} className="btn-gold">
                Ingia kulipia
              </Link>
              <Link href="/register" className="btn-outline">
                Create an account
              </Link>
            </div>
          )}

          <div className="mt-6 border-t border-white/[0.07] pt-4">
            <p className="eyebrow mb-3 !text-[9px]">Locked selections</p>
            <ul className="space-y-2">
              {slip.matches.map((match) => (
                <li key={`${match.home}-${match.away}`} className="flex items-center justify-between gap-2 font-mono text-[11px] text-white/30">
                  <span className="truncate">
                    {match.home} vs {match.away}
                  </span>
                  <span className="shrink-0 border border-white/10 px-2 py-0.5">•••</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
