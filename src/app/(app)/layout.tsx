import { redirect } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (user?.role === "admin") redirect("/admin");

  return (
    <div className="animate-enter relative mx-auto flex min-h-screen w-full max-w-[960px] flex-col pb-[90px]">
      <SiteHeader />
      <main className="flex-1 px-4 pb-10 pt-7 sm:px-6 lg:px-8">{children}</main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
