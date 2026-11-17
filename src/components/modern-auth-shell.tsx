import Image from "next/image";
import Link from "next/link";

export function ModernAuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="auth-glow flex min-h-screen w-full items-center justify-center p-5 sm:p-8">
      <div className="auth-panel relative w-full max-w-[440px] overflow-hidden rounded-[28px] px-6 py-8 sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-24 -top-28 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative">
          <div className="mb-9 flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-white/10 bg-black/40">
                <Image
                  src="/roho_logo.jpg"
                  width={48}
                  height={32}
                  alt="ChampeeTips logo"
                  className="h-6 w-9 object-cover"
                  unoptimized
                />
              </span>
              <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-white/90">
                ChampeeTips
              </span>
            </Link>
            <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold">
              VIP Tips
            </span>
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/45">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-7 border-t border-white/10 pt-6 text-center text-xs leading-relaxed text-white/45">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
