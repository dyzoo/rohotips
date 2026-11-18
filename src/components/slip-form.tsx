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
      <p className="eyebrow">Betslips / {slip ? "Edit" : "Create"}</p>
      <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">
        {slip ? "Edit betslip" : "New betslip"}
      </h1>
      <p className="mb-6 mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">
        Matches format: Home | Away | Market | Odd | Time — one per line.
      </p>

      {error ? <p className="alert-error mb-4">{error}</p> : null}

      <form action={action} className="panel space-y-5 p-5 sm:p-6">
        <input type="hidden" name="csrf" value={csrf} />
        {slip ? <input type="hidden" name="id" value={slip.id} /> : null}

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="field-label">Title</span>
            <input name="title" defaultValue={slip?.title ?? ""} placeholder="Jamvi la Uhakika" className="field" required />
          </label>

          <label className="block">
            <span className="field-label">Category</span>
            <input name="category" defaultValue={slip?.category ?? "Jamvi la Leo"} className="field" required />
          </label>

          <label className="block">
            <span className="field-label">Odds</span>
            <input name="odds" type="number" step="0.01" defaultValue={slip?.odds ?? ""} className="field num" required />
          </label>

          <label className="block">
            <span className="field-label">Price (TZS)</span>
            <input name="price" type="number" defaultValue={slip?.price ?? ""} className="field num" required />
          </label>

          <label className="block">
            <span className="field-label">Validity</span>
            <input name="validity" type="datetime-local" defaultValue={defaultValidity} className="field num" required />
          </label>

          <label className="block">
            <span className="field-label">Status</span>
            <select name="status" defaultValue={slip?.status ?? "active"} className="field">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          <label className="block">
            <span className="field-label">Booking code</span>
            <input name="code" defaultValue={slip?.code ?? ""} placeholder="Auto-generated if empty" className="field num" />
          </label>

          <label className="block">
            <span className="field-label">Bookmakers</span>
            <input name="bookmakers" defaultValue={slip?.bookmakers.join(", ") ?? "BetPawa"} placeholder="BetPawa, SportyBet" className="field" />
          </label>
        </div>

        <label className="block">
          <span className="field-label">Matches</span>
          <textarea
            name="matches"
            rows={6}
            defaultValue={matchesText(slip)}
            placeholder={"Simba SC | Young Africans | 1X2 - Home | 2.15 | 20:00\nArsenal | Chelsea | Over 2.5 | 1.94 | 22:00"}
            className="field num !text-[11px] leading-relaxed"
          />
        </label>

        <div className="flex flex-wrap gap-3 pt-1">
          <button type="submit" className="btn-gold !w-auto min-w-48">
            {slip ? "Save changes" : "Create betslip"}
          </button>
        </div>
      </form>
    </div>
  );
}
