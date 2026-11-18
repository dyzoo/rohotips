import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { payForSlipAction } from "@/app/actions";
import { CopyButton } from "@/components/copy-button";
import { Countdown } from "@/components/countdown";
import { csrfToken, getCurrentUser } from "@/lib/auth";
import { findSlip, getSettings, isSlipVisibleToUsers } from "@/lib/db";
import { dateLabel, isExpired, money } from "@/lib/format";
import { userHasSlip } from "@/lib/payments";

export const dynamic = "force-dynamic";

export default async function BetslipPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const [slip, user, settings] = await Promise.all([
    findSlip(id),
    getCurrentUser(),
    getSettings(),
  ]);

  if (!slip || !isSlipVisibleToUsers(slip)) notFound();

  const purchased = user ? await userHasSlip(user.id, slip.id) : false;
  const expired = isExpired(slip.validity);
  const csrf = await csrfToken();

  return (
    <div className="animate-enter">
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-white/45 transition hover:text-gold"
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.3">
          <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to slips
      </Link>

      <div className="card p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src={settings.adminAvatar}
              alt={settings.adminName}
              width={46}
              height={46}
              className="h-12 w-12 shrink-0 rounded-full border-2 border-gold/35 object-cover"
              unoptimized
            />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35">Verified tipster</p>
              <p className="truncate text-sm font-bold text-white">{settings.adminName}</p>
            </div>
          </div>
          <span className="tag">{slip.category}</span>
        </div>

        <h1 className="mt-6 text-2xl font-black tracking-tight text-white sm:text-3xl">{slip.title}</h1>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35">Combined odds</p>
            <p className="num mt-1.5 text-2xl font-bold text-white">{slip.odds.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-gold/15 bg-gold/[0.05] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gold/60">Entry fee</p>
            <p className="num mt-1.5 text-2xl font-bold text-gold">{money(slip.price)}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35">Validity</p>
            <p className="mt-1.5 text-sm font-semibold text-white"><Countdown validity={slip.validity} /></p>
            <p className="mt-1 text-[10px] text-white/35">{dateLabel(slip.validity)}</p>
          </div>
        </div>

        {slip.logo ? (
          <div className="mt-5 flex justify-end border-t border-white/[0.07] pt-4">
            <Image src={slip.logo} alt="" width={96} height={32} className="h-7 w-auto object-contain" unoptimized />
          </div>
        ) : null}
      </div>

      {error ? <p className="alert-error mt-5">Payment could not be started. Please try again.</p> : null}

      {purchased ? (
        <div className="card mt-5 p-6 text-center">
          <p className="eyebrow">Payment complete</p>
          <h2 className="mt-2 text-xl font-bold text-white">Your booking code</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-white/45">
            Use this code on your betting account to place the slip.
          </p>
          <div className="mx-auto mt-5 flex max-w-md flex-wrap items-center justify-center gap-4 rounded-xl border border-gold/25 bg-gold/[0.06] p-5">
            <span className="num text-2xl font-bold tracking-widest text-gold sm:text-3xl">{slip.code}</span>
            <CopyButton value={slip.code} />
          </div>
          <Link href="/mybets" className="btn-outline mx-auto mt-5 max-w-xs">
            View my bets
          </Link>
        </div>
      ) : expired ? (
        <div className="alert-error mt-5 p-6 text-center">
          <p className="text-sm font-bold">This slip has expired.</p>
          <Link href="/" className="mt-3 inline-block text-xs font-semibold text-gold">
            Browse active slips
          </Link>
        </div>
      ) : (
        <div className="card mt-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Checkout</p>
              <h2 className="mt-1 text-lg font-bold text-white">Unlock this slip</h2>
            </div>
            <span className="num text-xl font-bold text-gold">{money(slip.price)}</span>
          </div>
          {user ? (
            <div className="mt-5 rounded-xl border border-white/[0.08] bg-black/25 p-4 text-center">
              <p className="eyebrow !text-[9px]">Booking code preview</p>
              <div className="mt-2 flex items-center justify-center gap-3">
                <span
                  aria-hidden="true"
                  className="num select-none text-xl font-bold tracking-widest text-white/45 blur-[6px] sm:text-2xl"
                >
                  {slip.code.replace(/[A-Za-z0-9]/g, "8")}
                </span>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-gold" aria-hidden="true">
                  <rect x="5" y="10" width="14" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" />
                </svg>
              </div>
              <p className="mt-2 text-[11px] text-white/35">Pay to reveal the full code.</p>
            </div>
          ) : null}
          <p className="mt-3 text-sm leading-relaxed text-white/45">
            Lipia {money(slip.price)} kupata booking code kamili.
          </p>

          {user ? (
            <form action={payForSlipAction} className="mt-5 space-y-4">
              <input type="hidden" name="csrf" value={csrf} />
              <input type="hidden" name="slipId" value={slip.id} />

              <div>
                <label htmlFor="phone" className="field-label">
                  M-Pesa phone number (HarakaPay)
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
                Pay {money(slip.price)}
              </button>
              <p className="text-center text-[11px] text-white/35">
                Payments processed securely by HarakaPay.
              </p>
            </form>
          ) : (
            <div className="mt-5 space-y-3">
              <Link href={`/login?next=${encodeURIComponent(`/betslip/${slip.id}`)}`} className="btn-gold">
                Ingia kulipia
              </Link>
              <Link href="/register" className="btn-outline">
                Create an account
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
