import Image from "next/image";
import { addSliderAction, removeSliderAction, updateSettingsAction } from "@/app/actions";
import { csrfToken } from "@/lib/auth";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const [db, csrf] = await Promise.all([readDb(), csrfToken()]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white">Settings</h1>
      <p className="mb-6 text-xs text-[#888]">Site details, support contacts and hero slides.</p>

      {saved ? <p className="alert-success mb-5">Settings saved.</p> : null}

      <form action={updateSettingsAction} className="mb-8 space-y-4 rounded-2xl border border-white/10 bg-[#121212] p-5">
        <input type="hidden" name="csrf" value={csrf} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#888]">Site name</span>
            <input
              name="siteName"
              defaultValue={db.settings.siteName}
              className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-gold"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#888]">Support phone</span>
            <input
              name="supportPhone"
              defaultValue={db.settings.supportPhone}
              className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-gold"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#888]">WhatsApp number</span>
            <input
              name="whatsapp"
              defaultValue={db.settings.whatsapp}
              className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-gold"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#888]">Support email</span>
            <input
              name="email"
              type="email"
              defaultValue={db.settings.email}
              className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-gold"
              required
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-[#888]">Announcement</span>
          <textarea
            name="announcement"
            rows={3}
            defaultValue={db.settings.announcement}
            className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-gold"
          />
        </label>
        <button
          type="submit"
          className="gold-gradient rounded-xl px-6 py-3 text-xs font-extrabold uppercase tracking-wide text-black"
        >
          Save settings
        </button>
      </form>

      <div className="rounded-2xl border border-white/10 bg-[#121212] p-5">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold">Hero slides</h2>

        <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {db.sliders.map((slider) => (
            <div key={slider.id} className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
              <div className="relative aspect-video">
                <Image src={slider.image} alt="Slide" fill sizes="300px" className="object-cover" unoptimized />
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <span className="truncate text-[11px] text-[#888]">{slider.link}</span>
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
            className="rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-gold"
            required
          />
          <input
            name="link"
            placeholder="/betslip/1001"
            className="rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-gold"
          />
          <button
            type="submit"
            className="rounded-xl border border-gold/30 bg-gold/10 px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-gold"
          >
            Add slide
          </button>
        </form>
      </div>
    </div>
  );
}
