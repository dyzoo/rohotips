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
    <div className="flex items-center justify-between gap-3 py-1">
      <div className="flex min-w-0 items-center gap-3">
        <CashIcon className={`h-5 w-5 shrink-0 ${styles.icon}`} />
        <span className={`truncate text-[15px] font-semibold ${styles.value}`}>Cashout</span>
      </div>
      <button
        type="button"
        onClick={onRequest}
        className={`h-10 w-auto shrink-0 rounded-lg px-5 text-[10px] font-bold uppercase tracking-wide transition ${styles.button}`}
      >
        Request
      </button>
    </div>
  );
}
