import Image from "next/image";
import Link from "next/link";
import { AppDownloadButton } from "@/components/app-download-button";
import { getCurrentUser } from "@/lib/auth";
import { getSettings } from "@/lib/db";
import { initials } from "@/lib/format";

export async function SiteHeader() {
  const [user, settings] = await Promise.all([getCurrentUser(), getSettings()]);

  return (
    <header className="masthead">
      <div className="mx-auto flex max-w-[960px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-11 shrink-0 place-items-center rounded-lg border border-gold/25 bg-black/40">
            <Image src="/roho_logo.jpg" width={44} height={30} alt="Site logo" unoptimized />
          </span>
          <span className="min-w-0">
            <span className="page-title block truncate">{settings.siteName}</span>
            <span className="mt-0.5 block text-[10px] tracking-wide text-white/35">Sure tips / Tanzania</span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <AppDownloadButton />
          <span className="hidden items-center gap-2 sm:flex">
            <span className="live-indicator" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/45">Live desk</span>
          </span>
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1 pr-3 transition hover:border-gold/40"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-[10px] font-extrabold text-black">
                {initials(user.name)}
              </span>
              <span className="max-w-24 truncate text-xs font-bold text-white/85">{user.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-gold/35 bg-gold/[0.07] px-4 py-2 text-xs font-bold text-gold transition hover:bg-gold/15"
            >
              Ingia
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
