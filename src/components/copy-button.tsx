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
      className="border border-gold/35 bg-gold/[0.07] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-gold transition hover:bg-gold/20"
    >
      {copied ? "Copied" : "Copy code"}
    </button>
  );
}
