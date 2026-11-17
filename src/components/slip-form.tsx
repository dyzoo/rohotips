import type { Betslip } from "@/lib/types";
import { defaultValidityInput } from "@/lib/format";

function toLocalInput(iso: string): string {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`;
}

function matchesText(slip?: Betslip): string {
  if (!slip) return "";
  return slip.matches
    .map((match) => `${match.home} | ${match.away} | ${match.market} | ${match.odd} | ${match.time}`)
    .join("\n");
}

export function SlipForm({
  action,
  csrf,
  slip,
  error,
}: {
  action: (formData: FormData) => void | Promise<void>;
  csrf: string;
  slip?: Betslip;
  error?: string;
}) {
  const defaultValidity = slip ? toLocalInput(slip.validity) : defaultValidityInput();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-white">{slip ? "Edit betslip" : "New betslip"}</h1>
      <p className="mb-6 text-xs text-[#888]">
        Matches format: <code className="text-gold">Home | Away | Market | Odd | Time</code> one per line.
      </p>

      {error ? <p className="alert-error mb-4">{error}</p> : null}

      <form action={action} className="space-y-4 rounded-2xl border border-white/10 bg-[#121212] p-5">
        <input type="hidden" name="csrf" value={csrf} />
        {slip ? <input type="hidden" name="id" value={slip.id} /> : null}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#888]">Title</span>
            <input
              name="title"
              defaultValue={slip?.title ?? ""}
              placeholder="Jamvi la Uhakika"
              className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-gold"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#888]">Category</span>
            <input
              name="category"
              defaultValue={slip?.category ?? "Jamvi la Leo"}
              className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-gold"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#888]">Odds</span>
            <input
              name="odds"
              type="number"
              step="0.01"
              defaultValue={slip?.odds ?? ""}
              className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-gold"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#888]">Price (TZS)</span>
            <input
              name="price"
              type="number"
              defaultValue={slip?.price ?? ""}
              className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-gold"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#888]">Validity</span>
            <input
              name="validity"
              type="datetime-local"
              defaultValue={defaultValidity}
              className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-gold"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#888]">Status</span>
            <select
              name="status"
              defaultValue={slip?.status ?? "active"}
              className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-gold"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#888]">Booking code</span>
            <input
              name="code"
              defaultValue={slip?.code ?? ""}
              placeholder="Auto-generated if empty"
              className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 font-mono text-sm text-white outline-none focus:border-gold"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#888]">Bookmakers</span>
            <input
              name="bookmakers"
              defaultValue={slip?.bookmakers.join(", ") ?? "BetPawa"}
              placeholder="BetPawa, SportyBet"
              className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-gold"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#888]">Matches</span>
          <textarea
            name="matches"
            rows={6}
            defaultValue={matchesText(slip)}
            placeholder={"Simba SC | Young Africans | 1X2 - Home | 2.15 | 20:00\nArsenal | Chelsea | Over 2.5 | 1.94 | 22:00"}
            className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 font-mono text-xs text-white outline-none focus:border-gold"
          />
        </label>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="gold-gradient rounded-xl px-6 py-3 text-xs font-extrabold uppercase tracking-wide text-black"
          >
            {slip ? "Save changes" : "Create betslip"}
          </button>
        </div>
      </form>
    </div>
  );
}
