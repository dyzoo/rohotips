import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/format";
import type { Betslip } from "@/lib/types";
import { Countdown } from "./countdown";

export function VerifiedBadge() {
  return (
    <svg
      aria-label="Verified tipster"
      className="h-3.5 w-3.5 shrink-0"
      viewBox="0 0 24 24"
      fill="#1d9bf0"
    >
      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34Zm-11.71 4.2-4.1-4.1 1.42-1.42 2.68 2.69 5.7-5.7 1.42 1.42-7.12 7.11Z" />
    </svg>
  );
}

export function BetslipCard({
  slip,
  adminName,
  adminAvatar,
}: {
  slip: Betslip;
  adminName: string;
  adminAvatar: string;
}) {
  return (
    <article className="card betslip-card animate-enter flex w-full flex-col overflow-hidden">
      <div className="flex min-w-0 items-center gap-3">
        <Image
          src={adminAvatar}
          alt={adminName}
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 rounded-full border-2 border-gold/35 object-cover"
          unoptimized
        />
        <div className="min-w-0 flex-1">
          <p className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-sm font-bold text-white">{adminName}</span>
            <VerifiedBadge />
          </p>
          <p className="mt-0.5 truncate text-[11px] text-white/40">{slip.title}</p>
        </div>
        <span className="tag max-w-[40%] truncate">{slip.category}</span>
      </div>

      <div className="betslip-divider mt-5 mb-[23px] border-t border-white/[0.07]" />

      <div className="text-left">
        <p className="num text-[25px] font-bold leading-none text-white">
          {slip.odds.toFixed(2)}
        </p>
        <p className="betslip-odds-label mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
          Combined odds
        </p>
      </div>

      <div className="betslip-meta mt-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-white/40">
          <span className="shrink-0">Closes in</span>
          <span className="num">
            <Countdown validity={slip.validity} />
          </span>
        </span>
        <span className="num text-[17px] font-bold text-gold">{money(slip.price)}</span>
      </div>

      {slip.logo ? (
        <div className="betslip-logo mt-4 flex h-7 w-[70px] items-center">
          <Image
            src={slip.logo}
            alt=""
            width={70}
            height={28}
            className="h-7 w-auto max-w-[70px] object-contain object-left"
            unoptimized
          />
        </div>
      ) : null}

      <Link href={`/betslip/${slip.id}`} className="btn-gold betslip-action betslip-view mt-8">
        View slip
      </Link>
    </article>
  );
}
