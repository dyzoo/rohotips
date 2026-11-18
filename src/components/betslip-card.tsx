import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/format";
import type { Betslip } from "@/lib/types";
import { Countdown } from "./countdown";

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-label="Verified" className="shrink-0">
      <path
        d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
        fill="#1d9bf0"
      />
      <path
        d="M10.7 15.9l-3.6-3.6 1.4-1.4 2.2 2.2 5-5 1.4 1.4-6.4 6.4z"
        fill="#fff"
      />
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
    <article className="card animate-enter flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={adminAvatar}
            alt={adminName}
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-full border-2 border-gold/35 object-cover"
            unoptimized
          />
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35">Tipster</p>
            <p className="flex items-center gap-1 truncate text-sm font-bold text-white">
              <span className="truncate">{adminName}</span>
              <VerifiedBadge />
            </p>
          </div>
        </div>
        <span className="tag">{slip.category}</span>
      </div>

      <h3 className="mt-5 text-lg font-extrabold tracking-tight text-white">{slip.title}</h3>
      <p className="mt-1 text-xs text-white/40">Verified slip · ready to unlock</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35">Combined odds</p>
          <p className="num mt-1.5 text-2xl font-bold text-white">{slip.odds.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-gold/15 bg-gold/[0.05] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gold/60">Entry</p>
          <p className="num mt-1.5 text-2xl font-bold text-gold">{money(slip.price)}</p>
        </div>
      </div>

      <div className="mt-5 flex min-h-6 flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
        <span className="text-[11px] text-white/40">
          Closes in <Countdown validity={slip.validity} />
        </span>
        {slip.logo ? (
          <Image src={slip.logo} alt="" width={84} height={28} className="h-6 w-auto object-contain" unoptimized />
        ) : null}
      </div>

      <Link href={`/betslip/${slip.id}`} className="btn-gold mt-5">
        View slip
      </Link>
    </article>
  );
}
