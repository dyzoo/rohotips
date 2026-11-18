"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function DownloadGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className="shrink-0"
      aria-hidden="true"
    >
      <path d="M12 3v12m0 0 5-5m-5 5-5-5M4 19h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AppDownloadButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined);
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setInstalled(true);
      setShowHelp(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (!showHelp) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowHelp(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showHelp]);

  async function handleInstall() {
    if (installing) return;

    if (!deferredPrompt) {
      setShowHelp(true);
      return;
    }

    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      else setShowHelp(true);
    } catch {
      setShowHelp(true);
    } finally {
      setDeferredPrompt(null);
      setInstalling(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstall}
        disabled={installing || installed}
        aria-label="Pakua app ya ROHO TIPS"
        className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-gold/35 bg-gold/[0.07] px-3 text-[10px] font-bold text-gold transition hover:bg-gold/15 disabled:cursor-default disabled:opacity-70"
      >
        <DownloadGlyph />
        <span className="hidden sm:inline">
          {installed ? "Imewekwa" : installing ? "Inasakinisha…" : "Pakua App"}
        </span>
        <span className="sm:hidden">{installed ? "Imewekwa" : "App"}</span>
      </button>

      {showHelp ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4 sm:items-center"
          role="presentation"
          onClick={() => setShowHelp(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="app-download-title"
            onClick={(event) => event.stopPropagation()}
            className="animate-enter w-full max-w-sm rounded-2xl border border-gold/25 bg-[#141414] p-5 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-14 shrink-0 place-items-center rounded-lg border border-gold/25 bg-black/40">
                <Image src="/roho_logo.jpg" width={52} height={36} alt="Roho Tips" unoptimized />
              </span>
              <div className="min-w-0">
                <h2 id="app-download-title" className="text-sm font-extrabold uppercase tracking-wide text-gold">
                  Pakua ROHO TIPS
                </h2>
                <p className="mt-0.5 text-[10px] text-white/40">Weka app kwenye skrini ya nyumbani.</p>
              </div>
            </div>

            <ol className="mt-4 space-y-2 text-[11px] leading-relaxed text-white/60">
              <li>
                <span className="font-bold text-gold">Android / Chrome:</span> Menu → &quot;Install app&quot; au
                &quot;Add to Home screen&quot;.
              </li>
              <li>
                <span className="font-bold text-gold">iPhone / Safari:</span> Bonyeza Share → &quot;Add to Home
                Screen&quot;.
              </li>
              <li>
                <span className="font-bold text-gold">Kompyuta:</span> Tumia menu ya browser kusakinisha app.
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="mt-5 w-full rounded-xl bg-gold px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-black transition hover:bg-gold/90"
            >
              Nimemaliza
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
