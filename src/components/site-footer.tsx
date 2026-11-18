import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="mt-2 border-t border-white/10 px-4 pb-6 pt-5 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-12 shrink-0 place-items-center rounded-lg border border-gold/25 bg-black/40">
            <Image src="/roho_logo.jpg" width={48} height={34} alt="Roho Tips" unoptimized />
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] font-extrabold uppercase tracking-widest text-gold">Roho Tips</span>
            <span className="mt-0.5 block text-[10px] text-white/35">Sure tips / Tanzania</span>
          </span>
        </div>
        <p className="text-[10px] leading-relaxed text-white/30">
          © {new Date().getFullYear()} ROHO TIPS. Haki zote zimehifadhiwa.
        </p>
      </div>
    </footer>
  );
}
