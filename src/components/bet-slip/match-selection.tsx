import { FootballIcon } from "./icons";
import { slipTheme, type BetSlipTheme } from "./theme";
import type { BetSelection } from "./types";

export function MatchSelection({
  theme,
  match,
}: {
  theme: BetSlipTheme;
  match: BetSelection;
}) {
  const styles = slipTheme[theme];
  const odds = Number(match.odds);
  const displayOdds = Number.isFinite(odds) && odds > 0 ? odds.toFixed(2) : match.odds;

  return (
    <div className="py-2 last:pb-0">
      <div className="flex items-center justify-between gap-2">
        <span className={`truncate text-[11px] leading-tight sm:text-[12px] ${styles.soft}`}>{match.time}</span>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full border ${styles.border} bg-current opacity-30`} />
          <span className={`text-[11px] font-bold sm:text-[12px] ${styles.value}`}>{displayOdds}</span>
        </span>
      </div>

      <div className="mt-1 flex items-start gap-1.5">
        <FootballIcon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${styles.muted}`} />
        <div className="min-w-0">
          <p className={`text-[11px] font-bold leading-tight underline underline-offset-2 sm:text-[12px] ${styles.value}`}>
            {match.home} - {match.away}
          </p>
          <p className={`mt-0.5 text-[9px] ${styles.muted}`}>{match.league}</p>
          <p className={`mt-0.5 text-[10px] font-bold sm:text-[11px] ${styles.value}`}>{match.selection}</p>
        </div>
      </div>

      <div className={`mt-2 border-t ${styles.divider}`} />
    </div>
  );
}
