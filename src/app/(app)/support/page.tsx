import Link from "next/link";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const settings = await getSettings();

  return (
    <div className="animate-enter">
      <Link
        href="/profile"
        className="mb-6 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-white/45 transition hover:text-gold"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </Link>

      <p className="eyebrow">Desk / Contact</p>
      <h1 className="mt-1 text-3xl font-black uppercase tracking-tight text-white">Help &amp; support</h1>
      <p className="mb-7 mt-2 text-sm text-white/40">We are here to help, 24/7.</p>

      <div className="panel mb-5 p-5">
        <div className="panel-head">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center border border-[#25D366]/30 bg-[#25D366]/10">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#25D366]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </span>
            <div>
              <p className="eyebrow !text-[9px]">Channel 01</p>
              <h2 className="text-base font-extrabold uppercase tracking-wide text-white">WhatsApp</h2>
            </div>
          </div>
        </div>
        <a
          href={`https://wa.me/${settings.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold"
        >
          Chat on WhatsApp
        </a>
      </div>

      <div className="panel p-5">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border border-gold/30 bg-gold/[0.06]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-gold">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
            </svg>
          </span>
          <div>
            <p className="eyebrow !text-[9px]">Channel 02</p>
            <h2 className="text-base font-extrabold uppercase tracking-wide text-white">Call / SMS</h2>
          </div>
        </div>
        <a href={`tel:${settings.supportPhone}`} className="num block text-2xl font-bold tracking-wider text-gold transition hover:text-white">
          {settings.supportPhone}
        </a>
        <p className="eyebrow mt-3 !text-[9px] text-white/35">9AM - 9PM EAT</p>
        <p className="mt-3 font-mono text-[11px] text-white/40">Email: {settings.email}</p>
      </div>
    </div>
  );
}
