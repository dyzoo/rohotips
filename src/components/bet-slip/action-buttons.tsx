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
  const buttonClass = `flex h-[72px] items-center justify-center gap-3 rounded-2xl border px-3 font-mono text-[12px] font-bold uppercase tracking-widest transition ${styles.border} ${styles.value} ${styles.button}`;

  return (
    <div className="grid grid-cols-2 gap-4">
      <button type="button" onClick={onReuse} className={buttonClass}>
        <RefreshIcon />
        <span>Re-use</span>
        <span className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-[10px] ${styles.badge}`}>
          {reuseCount}
        </span>
      </button>
      <button type="button" onClick={onShare} className={buttonClass}>
        <ShareIcon />
        <span>Share</span>
      </button>
    </div>
  );
}
