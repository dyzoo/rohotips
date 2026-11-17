"use client";

import { useState } from "react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          setCopied(false);
        }
      }}
      className="rounded-lg border border-gold/30 bg-gold/10 px-3 py-2 text-xs font-bold uppercase tracking-wide text-gold transition hover:bg-gold/20"
    >
      {copied ? "Copied" : "Copy code"}
    </button>
  );
}
