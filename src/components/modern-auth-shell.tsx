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
      <div className="auth-panel relative w-full max-w-[440px] px-6 py-8 sm:px-9 sm:py-10">
        <div className="mb-8 h-[2px] w-20 bg-gradient-to-r from-gold via-gold-soft to-transparent" />

        <div className="mb-9 flex items-center justify-between gap-3 border-b border-white/[0.08] pb-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-11 place-items-center border border-gold/35 bg-black/50">
              <Image
                src="/roho_logo.jpg"
                width={48}
                height={32}
                alt="Site logo"
                className="h-6 w-9 object-cover"
                unoptimized
              />
            </span>
            <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-white/90">
              The tip desk
            </span>
          </Link>
          <span className="tag">Members only</span>
        </div>

        <p className="eyebrow mb-2">Account / Secure access</p>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-white/45">{subtitle}</p>

        <div className="mt-8">{children}</div>

        <div className="mt-8 border-t border-white/[0.08] pt-6 text-center text-xs leading-relaxed text-white/40">
          {footer}
        </div>
      </div>
    </div>
  );
}
