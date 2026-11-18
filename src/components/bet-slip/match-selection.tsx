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

  return (
    <div className="py-5 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <span className={`text-[17px] leading-snug sm:text-[19px] ${styles.soft}`}>{match.time}</span>
        <span className="flex shrink-0 items-center gap-2">
          <span className={`h-3 w-3 rounded-full border ${styles.border} bg-current opacity-30`} />
          <span className={`text-[15px] font-bold sm:text-[17px] ${styles.value}`}>{match.odds}</span>
        </span>
      </div>

      <div className="mt-2 flex items-start gap-2">
        <FootballIcon className={`mt-1 shrink-0 ${styles.muted}`} />
        <div className="min-w-0">
          <p className={`text-[15px] font-bold leading-snug underline underline-offset-4 sm:text-[17px] ${styles.value}`}>
            {match.home} - {match.away}
          </p>
          <p className={`mt-1 text-[12px] ${styles.muted}`}>{match.league}</p>
          <p className={`mt-2 text-[14px] font-bold sm:text-[16px] ${styles.value}`}>{match.selection}</p>
        </div>
      </div>

      <div className={`mt-5 border-t ${styles.divider}`} />
    </div>
  );
}
