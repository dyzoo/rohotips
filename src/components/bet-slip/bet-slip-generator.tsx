"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DownloadIcon } from "./icons";
import { SlipPreview } from "./slip-preview";
import type { BetSelection } from "./types";
import type { BetSlipTheme } from "./theme";

const formatter = new Intl.NumberFormat("en-TZ", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function money(value: number): string {
  return formatter.format(Number.isFinite(value) ? value : 0);
}

function selectionOdds(value: string): number {
  const odds = Number(value);
  return Number.isFinite(odds) && odds > 0 ? odds : 1;
}

const initialMatches: BetSelection[] = [
  {
    id: "match-1",
    time: "1:00 pm, Wed 18/11",
    odds: "1.33",
    home: "Suwon WFC Women",
    away: "Gyeongju FC Women",
    league: "WK-League",
    selection: "1X2 1UP | Full Time - 1",
  },
  {
    id: "match-2",
    time: "3:00 pm, Wed 18/11",
    odds: "1.27",
    home: "Besa Kavaje",
    away: "KF Korabi Peshkopi (n)",
    league: "Kupa e Shqiperise",
    selection: "1X2 1UP | Full Time - 1",
  },
];

export function BetSlipGenerator() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<BetSlipTheme>("dark");
  const [stakeInput, setStakeInput] = useState("500");
  const [bonusInput, setBonusInput] = useState("1456.18");
  const [reuseCount, setReuseCount] = useState(11);
  const [matches, setMatches] = useState<BetSelection[]>(initialMatches);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState("");

  const values = useMemo(() => {
    const odds = matches.reduce((total, match) => total * selectionOdds(match.odds), 1);
    const stake = Math.max(0, Number(stakeInput) || 0);
    const bonus = Math.max(0, Number(bonusInput) || 0);
    const winnings = stake * Math.max(odds - 1, 0);
    const tax = (winnings + bonus) * 0.15;
    const payout = stake + winnings + bonus - tax;
    return { odds, stake, bonus, winnings, tax, payout };
  }, [matches, stakeInput, bonusInput]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function updateMatch(id: string, patch: Partial<BetSelection>) {
    setMatches((current) =>
      current.map((match) => (match.id === id ? { ...match, ...patch } : match)),
    );
  }

  function addMatch() {
    setMatches((current) => [
      ...current,
      {
        id: `match-${Date.now()}`,
        time: "",
        odds: "1.00",
        home: "",
        away: "",
        league: "",
        selection: "",
      },
    ]);
  }

  function removeMatch(id: string) {
    setMatches((current) => current.filter((match) => match.id !== id));
  }

  async function downloadSlip() {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(previewRef.current, {
        pixelRatio: 2,
        backgroundColor: theme === "dark" ? "#24262A" : "#F4F5F7",
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `betslip-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setToast("Bet slip image downloaded.");
    } catch (error) {
      console.error("Bet slip image export failed", error);
      setToast("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  async function shareSlip() {
    const text = `Odds ${values.odds.toFixed(2)} | Stake TSH ${money(values.stake)} | Payout TSH ${money(values.payout)}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "Bet Slip", text });
        setToast("Bet slip shared.");
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setToast("Bet slip copied to clipboard.");
      } else {
        setToast(text);
      }
    } catch {
      setToast("Share cancelled.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Admin / Bet slip generator</p>
            <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">Bet Slip</h1>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-white/45">
              Enter odds, stake and optional win bonus. Winnings, 15% withholding tax and payout are
              calculated automatically. Edit the selections, choose a theme, then download the slip.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-xl border border-white/10 bg-black/20 p-1">
              {(["dark", "light"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTheme(option)}
                  className={`rounded-lg px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition ${
                    theme === option ? "bg-gold text-black" : "text-white/45 hover:text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={downloadSlip}
              disabled={downloading}
              className="btn-gold !w-auto min-w-48"
            >
              <DownloadIcon />
              {downloading ? "Downloading…" : "Download slip"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="panel space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="block">
              <span className="field-label">Total odds (auto)</span>
              <div className="field num flex items-center justify-between gap-2">
                <span>{values.odds.toFixed(2)}</span>
                <span className="text-[10px] font-normal text-white/40">
                  {matches.length} selection{matches.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>
            <label className="block">
              <span className="field-label">Stake (TSH)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={stakeInput}
                onChange={(event) => setStakeInput(event.target.value)}
                className="field num"
              />
            </label>
            <label className="block">
              <span className="field-label">Win bonus (TSH)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={bonusInput}
                onChange={(event) => setBonusInput(event.target.value)}
                className="field num"
              />
            </label>
            <label className="block">
              <span className="field-label">Re-use count</span>
              <input
                type="number"
                min="0"
                value={reuseCount}
                onChange={(event) => setReuseCount(Math.max(0, Number(event.target.value) || 0))}
                className="field num"
              />
            </label>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
            <p className="field-label">Calculated figures</p>
            <div className="space-y-2 font-mono text-[11px] text-white/50">
              <p>TOTAL ODDS: {values.odds.toFixed(2)}</p>
              <p>POTENTIAL WINNINGS: TSH {money(values.winnings)}</p>
              <p>WITHHOLDING TAX 15%: TSH {money(values.tax)}</p>
              <p>PAYOUT: TSH {money(values.payout)}</p>
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-white/30">
              Total odds = product of all selection odds. Winnings = stake × (odds − 1). Tax = 15%
              of winnings + bonus. Payout = stake + winnings + bonus − tax.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gold">Selections</h2>
              <button
                type="button"
                onClick={addMatch}
                className="border border-gold/35 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-gold hover:bg-gold/10"
              >
                Add selection
              </button>
            </div>

            {matches.map((match, index) => (
              <div key={match.id} className="panel-plain space-y-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/35">
                    Selection {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMatch(match.id)}
                    className="text-[11px] font-bold text-red-300 hover:text-red-200"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <label className="block">
                    <span className="field-label">Time and date</span>
                    <input
                      value={match.time}
                      onChange={(event) => updateMatch(match.id, { time: event.target.value })}
                      className="field"
                    />
                  </label>
                  <label className="block">
                    <span className="field-label">Match odds</span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={match.odds}
                      onChange={(event) => updateMatch(match.id, { odds: event.target.value })}
                      className="field num"
                    />
                  </label>
                  <label className="block">
                    <span className="field-label">Home team</span>
                    <input
                      value={match.home}
                      onChange={(event) => updateMatch(match.id, { home: event.target.value })}
                      className="field"
                    />
                  </label>
                  <label className="block">
                    <span className="field-label">Away team</span>
                    <input
                      value={match.away}
                      onChange={(event) => updateMatch(match.id, { away: event.target.value })}
                      className="field"
                    />
                  </label>
                  <label className="block">
                    <span className="field-label">League</span>
                    <input
                      value={match.league}
                      onChange={(event) => updateMatch(match.id, { league: event.target.value })}
                      className="field"
                    />
                  </label>
                  <label className="block">
                    <span className="field-label">Bet market</span>
                    <input
                      value={match.selection}
                      onChange={(event) => updateMatch(match.id, { selection: event.target.value })}
                      className="field"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel overflow-hidden p-3 sm:p-5">
          <SlipPreview
            containerRef={previewRef}
            theme={theme}
            odds={values.odds.toFixed(2)}
            stake={money(values.stake)}
            winnings={money(values.winnings)}
            bonus={money(values.bonus)}
            tax={money(values.tax)}
            payout={money(values.payout)}
            matches={matches}
            reuseCount={reuseCount}
            onReuse={() => setReuseCount((count) => count + 1)}
            onShare={shareSlip}
            onCashout={() => setToast("Cashout request noted in this preview.")}
          />
        </div>
      </div>

      {toast ? (
        <div
          role="status"
          className="animate-enter fixed bottom-5 right-5 z-50 max-w-sm rounded-xl border border-gold/30 bg-[#151515] px-4 py-3 text-xs font-semibold text-white shadow-2xl"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
