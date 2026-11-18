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
    <div className={`rounded-2xl px-4 py-3 ${styles.tax}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex min-w-0 items-center gap-2">
          <ChevronDownIcon className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
          <span className={`text-[13px] font-semibold ${styles.value}`}>Withholding Tax 15%:</span>
        </span>
        <span className={`shrink-0 text-[13px] ${styles.muted}`}>TSH {tax}</span>
      </button>
      {open ? (
        <p className={`mt-2 pl-7 text-[11px] leading-relaxed ${styles.muted}`}>
          15% withheld from potential winnings and win bonus before payout.
        </p>
      ) : null}
    </div>
  );
}
