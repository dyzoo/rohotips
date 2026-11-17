import Image from "next/image";
import Link from "next/link";
import { logoutAction } from "@/app/actions";
import { AdminNav } from "@/components/admin-nav";
import { csrfToken, requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin("/admin");
  const csrf = await csrfToken();

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-white/10 bg-black/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/logo.svg" width={30} height={30} alt="ChampeeTips logo" unoptimized />
            <span className="page-title">CHAMPEETIPS ADMIN</span>
          </Link>
          <div className="flex items-center gap-3 text-xs">
            <span className="hidden text-[#888] sm:inline">{user.email}</span>
            <Link href="/" className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-bold text-white/70 transition hover:text-gold">
              View site
            </Link>
            <form action={logoutAction}>
              <input type="hidden" name="csrf" value={csrf} />
              <button
                type="submit"
                className="rounded-full border border-red-500/25 bg-red-500/5 px-3 py-1.5 font-bold text-red-300 transition hover:bg-red-500/10"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-4">
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
