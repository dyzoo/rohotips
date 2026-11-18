"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";

export function ConfirmSubmitButton({
  message,
  className,
  children,
}: {
  message: string;
  className: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function confirmDelete() {
    const form = formRef.current;
    setOpen(false);
    form?.requestSubmit();
  }

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={(event) => {
          formRef.current = event.currentTarget.form;
          setOpen(true);
        }}
      >
        {children}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6">
          <button
            type="button"
            aria-label="Close confirmation"
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="animate-enter relative w-full max-w-sm rounded-2xl border border-red-500/25 bg-[#141013] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-red-500/30 bg-red-500/10 text-red-300">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p id={titleId} className="text-sm font-bold text-white">
                  Delete betslip?
                </p>
                <p id={descriptionId} className="mt-0.5 text-xs leading-relaxed text-white/45">
                  {message}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-white/15 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-white/60 transition hover:border-white/30 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
