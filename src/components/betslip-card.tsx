import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/format";
import type { Betslip } from "@/lib/types";
import { Countdown } from "./countdown";

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-label="Verified" className="shrink-0">
      <path
        fill="#0095F6"
        d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.92-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.92 1.788-3.92 3.998 0 .493.086.963.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 3.998 3.92 3.998.47 0 .92-.086 1.335-.253C9.182 21.585 10.49 22.5 12 22.5s2.816-.915 3.337-2.253c.416.167.866.253 1.336.253 2.21 0 3.92-1.788 3.92-3.998 0-.174-.012-.344-.033-.513 1.158-.687 1.94-1.99 1.94-3.485z"
      />
      <path d="M10.038 16.516l-3.535-3.535 1.414-1.414 2.12 2.12 5.658-5.657 1.415 1.414-7.072 7.07z" fill="#fff" />
    </svg>
  );
}

const logos: Record<string, string> = {
  BetPawa: "/betpawa.svg",
  SportyBet: "/sportybet.svg",
};

function BookmakerChip({ name }: { name: string }) {
  const logo = logos[name];
  if (logo) {
    return (
      <span className="flex h-7 items-center rounded bg-white px-2">
        <Image src={logo} width={70} height={24} alt={name} className="h-5 w-auto object-contain" unoptimized />
      </span>
    );
  }
  return (
    <span className="flex h-7 items-center rounded border border-white/10 bg-white/5 px-3 text-[11px] font-bold uppercase tracking-wide text-white/80">
      {name}
    </span>
  );
}

export function BetslipCard({ slip, siteName }: { slip: Betslip; siteName: string }) {
  return (
    <article className="betslip-card animate-enter mb-6">
      <div className="mb-6 flex items-start justify-between gap-3 border-b border-[#222] pb-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="ig-story-ring">
            <Image src="/avatar.svg" alt={siteName} width={42} height={42} className="avatar" unoptimized />
          </div>
          <div className="min-w-0">
            <h3 className="flex items-center gap-1 text-[15px] font-bold text-white">
              <span className="truncate">{siteName}</span>
              <VerifiedBadge />
            </h3>
            <p className="mt-0.5 text-[13px] text-[#888]">
              {slip.matches.length} matches &bull; {slip.title}
            </p>
          </div>
        </div>
        <span className="category-pill">{slip.category}</span>
      </div>

      <div className="mb-6">
        <div className="text-2xl font-black leading-none text-white">{slip.odds.toFixed(2)}</div>
        <div className="mt-1 text-sm font-medium text-[#888]">Odds</div>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[13px] text-[#888]">
          Validity Time &bull; <Countdown validity={slip.validity} />
        </div>
        <div className="text-base font-extrabold text-white">{money(slip.price)}</div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {slip.bookmakers.map((bookmaker) => (
          <BookmakerChip key={bookmaker} name={bookmaker} />
        ))}
      </div>

      <Link
        href={`/betslip/${slip.id}`}
        className="gold-gradient block w-full rounded-xl px-4 py-4 text-center text-base font-extrabold text-[#0a0a0a] shadow-[0_4px_15px_rgba(220,185,127,0.2)] transition hover:scale-[1.02] hover:opacity-90"
      >
        View betslips
      </Link>
    </article>
  );
}
