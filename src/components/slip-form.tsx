import type { Betslip } from "@/lib/types";
import { defaultValidityInput } from "@/lib/format";

function toLocalInput(iso: string): string {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`;
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
      <h1 className="mt-1 text-2xl font-black tracking-tight text-white">
        {slip ? "Edit betslip" : "New betslip"}
      </h1>
      <p className="mb-6 mt-1 text-xs text-white/40">Set the slip details and the logo shown to customers.</p>

      {error ? <p className="alert-error mb-4">{error}</p> : null}

      <form action={action} encType="multipart/form-data" className="panel space-y-5 p-5 sm:p-6">
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

        <div className="grid gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Bookmaker logo name</span>
            <input name="bookmakerName" placeholder="BetPawa" className="field" />
            <span className="mt-2 block text-[11px] text-white/35">Use the same name as in Bookmakers.</span>
          </label>
          <label className="block">
            <span className="field-label">Upload small logo</span>
            <input
              type="file"
              name="bookmakerLogo"
              accept="image/jpeg,image/png,image/webp"
              className="field !py-2.5 !text-xs file:mr-3 file:rounded-md file:border-0 file:bg-gold/20 file:px-3 file:py-1.5 file:text-[11px] file:font-bold file:text-gold"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <button type="submit" className="btn-gold !w-auto min-w-48">
            {slip ? "Save changes" : "Create betslip"}
          </button>
        </div>
      </form>
    </div>
  );
}
