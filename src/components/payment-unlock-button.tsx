"use client";

import { payForSlipAction } from "@/app/actions";
import { useRef } from "react";

export function PaymentUnlockButton({
  slipId,
  csrf,
  amountLabel,
}: {
  slipId: string;
  csrf: string;
  amountLabel: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className="btn-gold betslip-pay-button"
        onClick={() => dialogRef.current?.showModal()}
      >
        Pay {amountLabel} to Unlock
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="payment-phone-title"
        className="payment-dialog"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
      >
        <div className="rounded-[18px] border border-gold/25 bg-panel-light p-5 shadow-2xl">
    
          <h2 id="payment-phone-title" className="mt-1 text-lg font-extrabold tracking-tight text-white">
            Enter payment number
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-white/45">
            USSD push will be sent to this number.
          </p>

          <form action={payForSlipAction} className="mt-4 space-y-3">
            <input type="hidden" name="csrf" value={csrf} />
            <input type="hidden" name="slipId" value={slipId} />

            <div>
              <label htmlFor="payment-phone" className="field-label">
                Phone number
              </label>
              <input
                id="payment-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                placeholder="07XX XXX XXX"
                className="field text-center"
                required
              />
            </div>

            <button type="submit" className="btn-gold">
              Pay {amountLabel}
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
