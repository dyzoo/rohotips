import { CashIcon } from "./icons";
import { slipTheme, type BetSlipTheme } from "./theme";

export function CashoutSection({
  theme,
  onRequest,
}: {
  theme: BetSlipTheme;
  onRequest: () => void;
}) {
  const styles = slipTheme[theme];

  return (
    <div className="flex items-center justify-between gap-2 py-0.5">
      <div className="flex min-w-0 items-center gap-2">
        <CashIcon className={`h-4 w-4 shrink-0 ${styles.icon}`} />
        <span className={`truncate text-[12px] font-semibold ${styles.value}`}>Cashout</span>
      </div>
      <button
        type="button"
        onClick={onRequest}
        className={`h-8 w-auto shrink-0 rounded-lg px-4 text-[9px] font-bold uppercase tracking-wide transition ${styles.button}`}
      >
        Request
      </button>
    </div>
  );
}
