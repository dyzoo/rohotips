"use client";

import { useState } from "react";
import { ChevronDownIcon } from "./icons";
import { slipTheme, type BetSlipTheme } from "./theme";

export function WithholdingTaxAccordion({
  theme,
  tax,
}: {
  theme: BetSlipTheme;
  tax: string;
}) {
  const [open, setOpen] = useState(false);
  const styles = slipTheme[theme];

  return (
    <div className={`rounded-lg px-2.5 py-1.5 ${styles.tax}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <ChevronDownIcon className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
          <span className={`flex min-w-0 items-center gap-1 text-[10px] font-semibold ${styles.value}`}>
            <span className={`rounded px-1 py-0.5 text-[9px] font-bold ${styles.badge}`}>15%</span>
            <span className="truncate">Withholding Tax:</span>
          </span>
        </span>
        <span className={`shrink-0 text-[10px] ${styles.muted}`}>TSH {tax}</span>
      </button>
      {open ? (
        <p className={`mt-1 pl-5 text-[9px] leading-snug ${styles.muted}`}>
          15% withheld from potential winnings and win bonus before payout.
        </p>
      ) : null}
    </div>
  );
}
