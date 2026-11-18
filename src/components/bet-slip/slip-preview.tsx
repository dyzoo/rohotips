import type { RefObject } from "react";
import { BetActionButtons } from "./action-buttons";
import { CashoutSection } from "./cashout-section";
import { FinancialRow } from "./financial-row";
import { MatchSelection } from "./match-selection";
import { slipTheme, type BetSlipTheme } from "./theme";
import type { BetSelection } from "./types";
import { WithholdingTaxAccordion } from "./withholding-tax-accordion";

export function SlipPreview({
  containerRef,
  theme,
  odds,
  stake,
  winnings,
  bonus,
  tax,
  payout,
  matches,
  reuseCount,
  onReuse,
  onShare,
  onCashout,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  theme: BetSlipTheme;
  odds: string;
  stake: string;
  winnings: string;
  bonus: string;
  tax: string;
  payout: string;
  matches: BetSelection[];
  reuseCount: number;
  onReuse: () => void;
  onShare: () => void;
  onCashout: () => void;
}) {
  const styles = slipTheme[theme];

  return (
    <div ref={containerRef} className={`bet-slip-font w-full rounded-[24px] p-4 sm:p-6 ${styles.page}`}>
      <div className={`rounded-[18px] p-4 sm:p-5 ${styles.card}`}>
        <FinancialRow label="ODDS" value={odds} theme={theme} currency={null} />
        <FinancialRow label="STAKE" value={stake} theme={theme} />
        <FinancialRow label="POTENTIAL WINNINGS" value={winnings} theme={theme} />
        <FinancialRow label="WIN BONUS" value={bonus} theme={theme} />

        <div className="mt-3">
          <WithholdingTaxAccordion theme={theme} tax={tax} />
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <span className={`text-[14px] font-bold uppercase tracking-wide ${styles.value}`}>Payout</span>
          <span className="flex items-baseline gap-1.5">
            <span className={`text-[11px] ${styles.muted}`}>TSH</span>
            <span className={`text-[17px] font-bold ${styles.value}`}>{payout}</span>
          </span>
        </div>

        <div className={`my-4 border-t ${styles.divider}`} />
        <CashoutSection theme={theme} onRequest={onCashout} />
      </div>

      <div className="mt-4">
        <BetActionButtons theme={theme} reuseCount={reuseCount} onReuse={onReuse} onShare={onShare} />
      </div>

      <div className={`mt-5 border-t ${styles.divider}`} />
      <div>
        {matches.map((match) => (
          <MatchSelection key={match.id} theme={theme} match={match} />
        ))}
      </div>
    </div>
  );
}
