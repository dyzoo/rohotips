import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/format";
import type { Betslip } from "@/lib/types";
import { Countdown } from "./countdown";

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-label="Verified" className="shrink-0 text-gold">
      <path
        d="M12 2l2.3 1.7 2.8-.2 1 2.6 2.3 1.6-.8 2.7.8 2.7-2.3 1.6-1 2.6-2.8-.2L12 22l-2.3-1.7-2.8.2-1-2.6L3.6 16l.8-2.7-.8-2.7 2.3-1.6 1-2.6 2.8.2z"
        fill="currentColor"
      />
      <path d="M8.3 12.2l2.4 2.4 4.9-5" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookmakerChip({ name, logo }: { name: string; logo?: string }) {
  if (logo) {
    return (
      <span className="bookmaker-chip bg-[#e7dfd1] px-2">
        <Image src={logo} width={70} height={24} alt={name} className="h-5 w-auto object-contain" unoptimized />
      </span>
    );
  }
  return <span className="bookmaker-chip">{name}</span>;
}

export function BetslipCard({
  slip,
  siteName,
  logos,
  index = 0,
}: {
  slip: Betslip;
  siteName: string;
  logos: Record<string, string>;
  index?: number;
}) {
  return (
    <article className="ticket animate-enter mb-6 px-4 pb-4 pt-4 sm:px-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="num border border-gold/30 bg-gold/[0.06] px-2 py-1.5 text-xs font-bold text-gold">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <h3 className="flex items-center gap-1.5 text-[15px] font-extrabold uppercase tracking-wide text-white">
              <span className="truncate">{slip.title}</span>
              <VerifiedBadge />
            </h3>
            <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wider text-white/40">
              {siteName} / {slip.matches.length} selections
            </p>
          </div>
        </div>
        <span className="tag">{slip.category}</span>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow !text-[9px]">Combined odds</p>
          <p className="num mt-1 text-[42px] font-bold leading-none text-white">{slip.odds.toFixed(2)}</p>
        </div>
        <div className="border-l border-gold/25 pl-4 text-right">
          <p className="eyebrow !text-[9px]">Entry</p>
          <p className="num mt-1 text-lg font-bold text-gold">{money(slip.price)}</p>
        </div>
      </div>

      <div className="ticket-divider" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
          Closes in <Countdown validity={slip.validity} />
        </span>
        <span className="flex flex-wrap gap-1.5">
          {slip.bookmakers.map((bookmaker) => (
            <BookmakerChip key={bookmaker} name={bookmaker} logo={logos[bookmaker.toLowerCase()]} />
          ))}
        </span>
      </div>

      <Link href={`/betslip/${slip.id}`} className="btn-gold">
        Open slip / {String(index + 1).padStart(2, "0")}
      </Link>
    </article>
  );
}
