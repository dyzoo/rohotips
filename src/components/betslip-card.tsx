import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/format";
import type { Betslip } from "@/lib/types";
import { Countdown } from "./countdown";

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-label="Verified" className="shrink-0 text-gold">
      <path
        d="M12 2l2.3 1.7 2.8-.2 1 2.6 2.3 1.6-.8 2.7.8 2.7-2.3 1.6-1 2.6-2.8-.2L12 22l-2.3-1.7-2.8.2-1-2.6L3.6 16l.8-2.7-.8-2.7 2.3-1.6 1-2.6 2.8.2z"
        fill="currentColor"
      />
      <path d="M8.5 12.2l2.3 2.3 4.7-4.9" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
