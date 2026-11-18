import { slipTheme, type BetSlipTheme } from "./theme";

export function FinancialRow({
  label,
  value,
  theme,
  currency = "TSH",
}: {
  label: string;
  value: string;
  theme: BetSlipTheme;
  currency?: string | null;
}) {
  const styles = slipTheme[theme];

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className={`text-[13px] font-medium ${styles.soft}`}>{label}</span>
      <span className="flex items-baseline justify-end gap-1.5 text-right">
        {currency ? <span className={`text-[11px] ${styles.muted}`}>{currency}</span> : null}
        <span className={`text-[15px] font-bold ${styles.value}`}>{value}</span>
      </span>
    </div>
  );
}
