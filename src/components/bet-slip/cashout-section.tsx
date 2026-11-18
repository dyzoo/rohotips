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
    <div className="flex flex-wrap items-center justify-between gap-4 py-1">
      <div className="flex items-center gap-3">
        <CashIcon className={styles.icon} />
        <span className={`text-[15px] font-semibold ${styles.value}`}>Cashout</span>
      </div>
      <button
        type="button"
        onClick={onRequest}
        className={`h-[72px] w-full rounded-2xl font-mono text-[12px] font-bold uppercase tracking-widest transition sm:w-[175px] ${styles.button}`}
      >
        Request
      </button>
    </div>
  );
}
