import Image from "next/image";
import Link from "next/link";
import { logoutAction } from "@/app/actions";
import { AdminNav } from "@/components/admin-nav";
import { csrfToken, requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, csrf, settings] = await Promise.all([
    requireAdmin("/admin"),
    csrfToken(),
    getSettings(),
  ]);

  return (
    <div className="min-h-screen bg-ink">
      <header className="masthead">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="grid h-9 w-11 place-items-center border border-gold/35 bg-black/50">
              <Image src="/roho_logo.jpg" width={44} height={30} alt="Site logo" unoptimized />
            </span>
            <span>
              <span className="page-title block">Control room</span>
              <span className="eyebrow mt-0.5 block !text-[8px] text-white/35">Admin / Operations</span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-widest">
            <Link
              href="/admin/settings#profile"
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1 pr-3 transition hover:border-gold/40 sm:flex"
            >
              <Image
                src={settings.adminAvatar}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 rounded-full border border-gold/25 object-cover"
                unoptimized
              />
              <span className="max-w-32 truncate font-sans text-[11px] font-bold normal-case tracking-normal text-white/80">
                {settings.adminName}
              </span>
            </Link>
            <span className="rounded-full border border-gold/25 bg-gold/[0.07] px-3 py-2 text-gold">{user.role}</span>
            <form action={logoutAction}>
              <input type="hidden" name="csrf" value={csrf} />
              <button
                type="submit"
                className="border border-red-500/25 px-3 py-2 font-bold text-red-300 transition hover:bg-red-500/10"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-3">
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
