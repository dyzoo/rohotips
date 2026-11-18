import Image from "next/image";
import type { Betslip } from "@/lib/types";
import { defaultValidityInput } from "@/lib/format";
import { ImageCropUpload } from "./image-crop-upload";

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
      <p className="mb-6 mt-1 text-xs text-white/40">Set the slip details and upload the logo shown to customers.</p>

      {error ? <p className="alert-error mb-4">{error}</p> : null}

      <form action={action} encType="multipart/form-data" className="panel space-y-5 p-5 sm:p-6">
        <input type="hidden" name="csrf" value={csrf} />
        {slip ? <input type="hidden" name="id" value={slip.id} /> : null}
        <input type="hidden" name="existingLogo" value={slip?.logo ?? ""} />

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
        </div>

        {slip?.logo ? (
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <span className="flex h-10 w-24 shrink-0 items-center justify-center rounded bg-white px-2">
              <Image src={slip.logo} alt="Current logo" width={80} height={26} className="h-6 w-auto object-contain" unoptimized />
            </span>
            <span className="text-xs text-white/45">
              Current logo. Upload a new one to replace it.
            </span>
          </div>
        ) : null}

        <ImageCropUpload
          name="bookmakerLogo"
          label="Upload bookmaker logo"
          aspect={3}
          defaultWidth={360}
          minWidth={180}
          maxWidth={720}
          hint="Resize and crop the logo before saving it with this betslip."
        />

        <div className="flex flex-wrap gap-3 pt-1">
          <button type="submit" className="btn-gold !w-auto min-w-48">
            {slip ? "Save changes" : "Create betslip"}
          </button>
        </div>
      </form>
    </div>
  );
}
