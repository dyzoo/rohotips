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
    <div className="w-full max-w-md">
      {backHref ? (
        <Link
          href={backHref}
          className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-800 text-gray-400 transition hover:bg-gray-900"
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
          </svg>
        </Link>
      ) : null}
      <div className="mb-8">
        <div className="mb-6 flex items-center gap-3">
          <Image src="/logo.svg" height={32} width={32} alt="ChampeeTips logo" unoptimized />
          <span className="text-xl font-light tracking-wide text-white/90">CHAMPEETIPS</span>
        </div>
        <h1 className="gold-text mb-2 text-4xl font-light tracking-wide">{title}</h1>
      </div>
      {children}
      <div className="mt-12 text-center text-xs uppercase tracking-widest text-white/30">Secure Login</div>
    </div>
  );
}
