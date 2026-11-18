import { BottomNav } from "@/components/bottom-nav";
import { SiteHeader } from "@/components/site-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-enter relative mx-auto w-full max-w-[500px] border-x border-white/[0.05] pb-[84px]">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 pb-8 pt-6">{children}</main>
      <BottomNav />
    </div>
  );
}
