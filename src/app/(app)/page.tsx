import Link from "next/link";
import { connection } from "next/server";
import { BetslipCard } from "@/components/betslip-card";
import { HeroSlider } from "@/components/hero-slider";
import { findActiveSlips, getSettings, getSliders } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await connection();
  const [slips, sliders, settings] = await Promise.all([
    findActiveSlips(),
    getSliders(),
    getSettings(),
  ]);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: settings.siteName,
        description: "Jukwaa la mikeka ya uhakika na tips za ushindi Tanzania",
        inLanguage: "sw",
      },
      {
        "@type": "Organization",
        name: settings.siteName,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: settings.supportPhone,
          contactType: "customer service",
          availableLanguage: ["Swahili", "English"],
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Daily briefing / {new Date().getFullYear()}</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
            The <span className="gold-text">tip desk</span>
          </h1>
          <p className="mt-2 text-sm text-white/45">Curated slips, clear odds, fast payment.</p>
        </div>
        <span className="hidden text-xs text-white/35 sm:block">Tanzania · EAT</span>
      </div>

      <HeroSlider slides={sliders} />

      {settings.announcement ? (
        <div className="mb-6 flex items-start gap-3 border-l-2 border-gold bg-gold/[0.05] px-3 py-3">
          <span className="live-indicator mt-1" />
          <p className="text-[12px] leading-relaxed text-gold/90">{settings.announcement}</p>
        </div>
      ) : null}

      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="live-indicator shrink-0" aria-hidden="true" />
          <h2 className="truncate text-[17px] font-extrabold tracking-tight text-white sm:text-xl">
            Active betslips
          </h2>
        </div>
        <span className="count-badge">{String(slips.length).padStart(2, "0")} live</span>
      </div>

      <div id="tipsContainer" className="stagger grid gap-5 md:grid-cols-2">
        {slips.length === 0 ? (
          <div className="panel-plain px-5 py-14 text-center md:col-span-2">
            <p className="eyebrow mb-3">Desk closed</p>
            <p className="text-[15px] text-white/45">
              No active betslips at the moment.
              <br />
              Check back later!
            </p>
          </div>
        ) : (
          slips.map((slip) => (
            <BetslipCard
              key={slip.id}
              slip={slip}
              adminName={settings.adminName}
              adminAvatar={settings.adminAvatar}
            />
          ))
        )}
      </div>

      <p className="mt-8 border-t border-white/[0.07] pt-5 text-center font-mono text-[10px] leading-relaxed tracking-wide text-white/30">
        Betting involves risk. Play responsibly.{" "}
        <Link href="/support" className="text-gold/80 hover:text-gold">
          Need help?
        </Link>
      </p>
    </>
  );
}
