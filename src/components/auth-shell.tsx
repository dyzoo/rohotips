import Image from "next/image";
import Link from "next/link";

export function AuthShell({
  title,
  backHref,
  children,
}: {
  title: string;
  backHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="auth-glow flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        {backHref ? (
          <Link
            href={backHref}
            className="mb-5 inline-flex h-9 w-9 items-center justify-center border border-gold/30 text-gold transition hover:bg-gold/10"
            aria-label="Back"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ) : null}

        <div className="auth-panel px-6 py-8 sm:px-8">
          <div className="mb-8 flex items-center gap-3 border-b border-white/[0.08] pb-6">
            <Image src="/roho_logo.jpg" height={30} width={46} alt="Site logo" unoptimized />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              Account recovery
            </span>
          </div>
          <p className="eyebrow mb-2">Secure / {title}</p>
          <h1 className="text-3xl font-black tracking-tight text-white">{title}</h1>

          <div className="mt-7">{children}</div>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
          Encrypted session
        </p>
      </div>
    </div>
  );
}
