import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getSettings } from "@/lib/db";
import { initials } from "@/lib/format";

export async function SiteHeader() {
  const [user, settings] = await Promise.all([getCurrentUser(), getSettings()]);

  return (
    <header className="masthead">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-11 shrink-0 place-items-center border border-gold/35 bg-black/60">
            <Image src="/roho_logo.jpg" width={44} height={30} alt="Site logo" unoptimized />
          </span>
          <span className="min-w-0">
            <span className="page-title block truncate">{settings.siteName}</span>
            <span className="eyebrow mt-0.5 block !text-[8px] !tracking-[0.28em] text-white/35">
              Sure tips / Tanzania
            </span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden items-center gap-1.5 sm:flex">
            <span className="live-indicator" />
            <span className="eyebrow !text-[9px]">Live desk</span>
          </span>
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 border border-white/10 bg-white/[0.03] py-1 pl-1 pr-2.5 transition hover:border-gold/45"
            >
              <span className="grid h-7 w-7 place-items-center bg-gold text-[10px] font-extrabold text-black">
                {initials(user.name)}
              </span>
              <span className="max-w-20 truncate font-mono text-[11px] font-bold uppercase tracking-wide text-white/85">
                {user.name.split(" ")[0]}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="border border-gold/40 bg-gold/[0.06] px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-gold transition hover:bg-gold/15"
            >
              Ingia
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
