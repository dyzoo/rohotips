import { RefreshIcon, ShareIcon } from "./icons";
import { slipTheme, type BetSlipTheme } from "./theme";

export function BetActionButtons({
  theme,
  reuseCount,
  onReuse,
  onShare,
}: {
  theme: BetSlipTheme;
  reuseCount: number;
  onReuse: () => void;
  onShare: () => void;
}) {
  const styles = slipTheme[theme];
  const buttonClass = `flex h-[52px] items-center justify-center gap-2 rounded-xl border px-3 text-[11px] font-bold uppercase tracking-wide transition ${styles.border} ${styles.value} ${styles.button}`;

  return (
    <div className="grid grid-cols-2 gap-3">
      <button type="button" onClick={onReuse} className={buttonClass}>
        <RefreshIcon className="h-4 w-4" />
        <span>Re-use</span>
        <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[9px] ${styles.badge}`}>
          {reuseCount}
        </span>
      </button>
      <button type="button" onClick={onShare} className={buttonClass}>
        <ShareIcon className="h-4 w-4" />
        <span>Share</span>
      </button>
    </div>
  );
}
