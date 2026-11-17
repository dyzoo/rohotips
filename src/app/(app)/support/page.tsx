import Link from "next/link";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const settings = await getSettings();

  return (
    <div className="animate-enter">
      <Link
        href="/profile"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/70 transition hover:text-gold"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </Link>

      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full border border-gold/30 bg-gold/10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-10 w-10 text-gold">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="gold-text mb-2 text-3xl font-black tracking-tight">Help &amp; Support</h1>
        <p className="text-sm font-light text-[#888]">We are here to help 24/7</p>
      </div>

      <div className="glass-card relative mb-6 overflow-hidden rounded-[32px] p-6">
        <div className="relative z-10 mb-5 flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl border border-[#25D366]/30 bg-[#25D366]/20">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-[#25D366]">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold tracking-wide text-white">WhatsApp Support</h2>
        </div>
        <a
          href={`https://wa.me/${settings.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl bg-[#25D366] py-4 text-center text-sm font-black tracking-wide text-[#0A0A0A] shadow-[0_10px_30px_rgba(37,211,102,0.3)] transition hover:scale-[1.02] active:scale-95"
        >
          Chat on WhatsApp
        </a>
      </div>

      <div className="glass-card rounded-[32px] p-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/5">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-gold">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
            </svg>
          </div>
          <h2 className="font-bold tracking-wide text-white">Call / SMS</h2>
        </div>
        <a href={`tel:${settings.supportPhone}`} className="gold-text mt-2 block text-2xl font-black tracking-wider transition hover:text-white">
          {settings.supportPhone}
        </a>
        <p className="mt-3 text-xs font-bold uppercase tracking-widest text-[#888]">Available 9AM - 9PM EAT</p>
        <p className="mt-3 text-xs text-[#888]">Email: {settings.email}</p>
      </div>
    </div>
  );
}
