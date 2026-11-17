import { BottomNav } from "@/components/bottom-nav";
import { SiteHeader } from "@/components/site-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-enter mx-auto w-full max-w-[500px] pb-[90px]">
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 pb-8 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
