import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { payForSlipAction } from "@/app/actions";
import { VerifiedBadge } from "@/components/betslip-card";
import { CopyButton } from "@/components/copy-button";
import { Countdown } from "@/components/countdown";
import { csrfToken, requireUser } from "@/lib/auth";
import { findSlip, getSettings, isSlipVisibleToUsers } from "@/lib/db";
import { isExpired, money } from "@/lib/format";
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
    requireUser(`/betslip/${id}`),
    getSettings(),
  ]);

  if (!slip || !isSlipVisibleToUsers(slip)) notFound();

  const purchased = await userHasSlip(user.id, slip.id);
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

      <div className="card betslip-detail-card mx-auto w-full max-w-[470px] p-4">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={settings.adminAvatar}
            alt={settings.adminName}
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full border-2 border-gold/35 object-cover"
            unoptimized
          />
          <div className="min-w-0 flex-1">
            <p className="flex min-w-0 items-center gap-1.5">
              <span className="truncate text-sm font-bold text-white">{settings.adminName}</span>
              <VerifiedBadge />
            </p>
            <p className="mt-0.5 truncate text-[11px] text-white/40">{slip.title}</p>
          </div>
          <span className="tag max-w-[40%] truncate">{slip.category}</span>
        </div>

        <div className="mt-5 mb-5 border-t border-white/[0.07]" />

        <div className="text-left">
          <p className="num text-[25px] font-bold leading-none text-white">
            {slip.odds.toFixed(2)}
          </p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Combined odds
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-white/40">
            <span className="shrink-0">Closes in</span>
            <span className="num">
              <Countdown validity={slip.validity} />
            </span>
          </span>
          <span className="num text-[17px] font-bold text-gold">{money(slip.price)}</span>
        </div>

        {slip.logo ? (
          <div className="mt-4 flex h-7 w-[70px] items-center rounded-[4px] bg-white px-1">
            <Image
              src={slip.logo}
              alt=""
              width={70}
              height={28}
              className="h-6 w-full object-contain object-left"
              unoptimized
            />
          </div>
        ) : null}

        {error ? <p className="alert-error mt-4">Payment could not be started. Please try again.</p> : null}

        {purchased ? (
          <div className="mt-5 rounded-[13px] border border-gold/25 bg-gold/[0.06] p-4 text-center">
            <p className="eyebrow">Payment complete</p>
            <h2 className="mt-2 text-lg font-bold text-white">Your booking code</h2>
            <p className="mx-auto mt-2 text-xs text-white/45">
              Use this code on your betting account to place the slip.
            </p>
            <div className="mx-auto mt-4 flex max-w-md flex-wrap items-center justify-center gap-3 rounded-xl border border-gold/25 bg-gold/[0.06] p-4">
              <span className="num text-2xl font-bold tracking-widest text-gold">{slip.code}</span>
              <CopyButton value={slip.code} />
            </div>
            <Link href="/mybets" className="btn-outline mx-auto mt-4 max-w-xs">
              View my bets
            </Link>
          </div>
        ) : expired ? (
          <div className="alert-error mt-5 p-5 text-center">
            <p className="text-sm font-bold">This slip has expired.</p>
            <Link href="/" className="mt-3 inline-block text-xs font-semibold text-gold">
              Browse active slips
            </Link>
          </div>
        ) : (
          <div className="mt-5 rounded-[13px] border border-white/[0.08] bg-black/25 p-2.5">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center gap-2 text-gold">
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="shrink-0"
                  aria-hidden="true"
                >
                  <rect x="5" y="10" width="14" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" />
                </svg>
                <span className="eyebrow !text-[9px]">Booking code locked</span>
              </div>
              <span
                aria-hidden="true"
                className="num mt-1 select-none text-base font-bold tracking-widest text-white/45 blur-[6px]"
              >
                {slip.code.replace(/[A-Za-z0-9]/g, "8")}
              </span>
            </div>

            <form action={payForSlipAction} className="mt-2 space-y-2">
              <input type="hidden" name="csrf" value={csrf} />
              <input type="hidden" name="slipId" value={slip.id} />

              <label htmlFor="phone" className="sr-only">
                Ingiza Namba ya Malipo
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={user.phone}
                placeholder="07XX XXX XXX"
                className="field betslip-phone-field text-center"
                required
              />

              <button type="submit" className="btn-gold betslip-pay-button">
                Pay {money(slip.price)}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
