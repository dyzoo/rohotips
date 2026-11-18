import Image from "next/image";
import {
  addSliderAction,
  removeSliderAction,
  updateSettingsAction,
  uploadAdminAvatarAction,
  uploadSliderAction,
} from "@/app/actions";
import { ImageCropUpload } from "@/components/image-crop-upload";
import { csrfToken } from "@/lib/auth";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const [db, csrf] = await Promise.all([readDb(), csrfToken()]);

  return (
    <div>
      <p className="eyebrow">System / Configuration</p>
      <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">Settings</h1>
      <p className="mb-6 mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">Site details, support contacts and hero slides.</p>

      {saved ? <p className="alert-success mb-5">Settings saved.</p> : null}
      {error === "upload" ? (
        <p className="alert-error mb-5">Upload a JPG, PNG or WebP image smaller than 4MB.</p>
      ) : null}

      <form action={updateSettingsAction} className="panel mb-8 space-y-5 p-5">
        <input type="hidden" name="csrf" value={csrf} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="field-label">Admin name on slips</span>
            <input
              name="adminName"
              defaultValue={db.settings.adminName}
              className="field"
              required
            />
          </label>
          <label className="block">
            <span className="field-label">Site name</span>
            <input
              name="siteName"
              defaultValue={db.settings.siteName}
              className="field"
              required
            />
          </label>
          <label className="block">
            <span className="field-label">Support phone</span>
            <input
              name="supportPhone"
              defaultValue={db.settings.supportPhone}
              className="field"
              required
            />
          </label>
          <label className="block">
            <span className="field-label">WhatsApp number</span>
            <input
              name="whatsapp"
              defaultValue={db.settings.whatsapp}
              className="field"
              required
            />
          </label>
          <label className="block">
            <span className="field-label">Support email</span>
            <input
              name="email"
              type="email"
              defaultValue={db.settings.email}
              className="field"
              required
            />
          </label>
        </div>
        <label className="block">
          <span className="field-label">Announcement</span>
          <textarea
            name="announcement"
            rows={3}
            defaultValue={db.settings.announcement}
            className="field"
          />
        </label>
        <button
          type="submit"
          className="btn-gold !w-auto min-w-48"
        >
          Save settings
        </button>
      </form>

      <div className="panel mb-8 p-5">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold">Admin photo</h2>
        <div className="flex flex-wrap items-start gap-5">
          <Image
            src={db.settings.adminAvatar}
            alt="Admin avatar"
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-full border-2 border-gold/35 object-cover"
            unoptimized
          />
          <form
            action={uploadAdminAvatarAction}
            encType="multipart/form-data"
            className="flex flex-1 flex-wrap items-end gap-3"
          >
            <input type="hidden" name="csrf" value={csrf} />
            <div className="min-w-64 flex-1">
              <ImageCropUpload
                name="avatar"
                label="Upload profile photo"
                aspect={1}
                defaultWidth={240}
                minWidth={120}
                maxWidth={480}
              />
            </div>
            <button type="submit" className="btn-outline !w-auto min-w-36">
              Upload photo
            </button>
          </form>
        </div>
      </div>

      <div className="panel p-5">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold">Hero slides</h2>

        <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {db.sliders.map((slider) => (
            <div key={slider.id} className="panel-plain overflow-hidden">
              <div className="relative aspect-video">
                <Image src={slider.image} alt="Slide" fill sizes="300px" className="object-cover" unoptimized />
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <span className="truncate font-mono text-[10px] uppercase tracking-wider text-white/40">{slider.link}</span>
                <form action={removeSliderAction}>
                  <input type="hidden" name="csrf" value={csrf} />
                  <input type="hidden" name="id" value={slider.id} />
                  <button type="submit" className="text-[11px] font-bold text-red-300 hover:text-red-200">
                    Remove
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <form action={addSliderAction} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input type="hidden" name="csrf" value={csrf} />
          <input
            name="image"
            placeholder="/banner-1.svg or https://..."
            className="field"
            required
          />
          <input
            name="link"
            placeholder="/betslip/1001"
            className="field"
          />
          <button
            type="submit"
            className="border border-gold/40 bg-gold/[0.07] px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-gold transition hover:bg-gold/15"
          >
            Add slide
          </button>
        </form>
      </div>

      <div className="panel mt-6 p-5">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold">Upload carousel image</h2>
        <form
          action={uploadSliderAction}
          encType="multipart/form-data"
          className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
        >
          <input type="hidden" name="csrf" value={csrf} />
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp"
            className="field !py-2.5 !text-xs file:mr-3 file:border-0 file:bg-gold/20 file:px-3 file:py-1.5 file:font-mono file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:text-gold"
            required
          />
          <input
            name="link"
            placeholder="/betslip/1001"
            className="field"
          />
          <button
            type="submit"
            className="border border-gold/40 bg-gold/[0.07] px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-gold transition hover:bg-gold/15"
          >
            Upload slide
          </button>
        </form>
      </div>
    </div>
  );
}
