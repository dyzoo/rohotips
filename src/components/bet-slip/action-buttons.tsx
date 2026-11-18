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
  const buttonClass = `flex h-9 items-center justify-center gap-1.5 rounded-lg border px-2 text-[10px] font-bold uppercase tracking-wide transition ${styles.border} ${styles.value} ${styles.button}`;

  return (
    <div className="grid grid-cols-2 gap-2">
      <button type="button" onClick={onReuse} className={buttonClass}>
        <RefreshIcon className="h-3.5 w-3.5" />
        <span>Re-use</span>
        <span className={`grid h-4 min-w-4 place-items-center rounded-full px-0.5 text-[8px] ${styles.badge}`}>
          {reuseCount}
        </span>
      </button>
      <button type="button" onClick={onShare} className={buttonClass}>
        <ShareIcon className="h-3.5 w-3.5" />
        <span>Share</span>
      </button>
    </div>
  );
}
