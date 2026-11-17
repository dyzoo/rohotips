import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getSettings } from "@/lib/db";
import { initials } from "@/lib/format";

export async function SiteHeader() {
  const [user, settings] = await Promise.all([getCurrentUser(), getSettings()]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/roho_logo.jpg" width={48} height={32} alt="ChampeeTips logo" unoptimized />
          <span className="page-title">{settings.siteName}</span>
        </Link>
        {user ? (
          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 transition hover:bg-white/10"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-[11px] font-extrabold text-black">
              {initials(user.name)}
            </span>
            <span className="max-w-24 truncate text-xs font-bold">{user.name.split(" ")[0]}</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="rounded-full border border-gold/20 bg-white/5 px-4 py-1.5 text-sm transition hover:border-gold/60"
          >
            Ingia
          </Link>
        )}
      </div>
    </header>
  );
}
