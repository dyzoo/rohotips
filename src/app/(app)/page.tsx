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

      <h1 className="sr-only">{settings.siteName}</h1>

      <HeroSlider slides={sliders} />

      {settings.announcement ? (
        <div className="mb-3 flex items-start gap-2.5 border-l-2 border-gold bg-gold/[0.05] px-3 py-2 sm:mb-6 sm:gap-3 sm:py-3">
          <span className="live-indicator mt-1" />
          <p className="text-[11px] leading-relaxed text-gold/90 sm:text-[12px]">{settings.announcement}</p>
        </div>
      ) : null}

      <div className="mb-2.5 flex items-center justify-between gap-3 sm:mb-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="live-indicator shrink-0" aria-hidden="true" />
          <h2 className="truncate text-[15px] font-extrabold tracking-tight text-white sm:text-xl">
            Active betslips
          </h2>
        </div>
        <span className="count-badge">{String(slips.length).padStart(2, "0")} live</span>
      </div>

      <div id="tipsContainer" className="stagger grid gap-3 sm:gap-5 md:grid-cols-2">
        {slips.length === 0 ? (
          <div className="panel-plain px-5 py-8 text-center sm:py-14 md:col-span-2">
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

      <p className="mt-3 border-t border-white/[0.07] pt-3 text-center font-mono text-[9px] leading-relaxed tracking-wide text-white/30 sm:mt-8 sm:pt-5 sm:text-[10px]">
        Betting involves risk. Play responsibly.{" "}
        <Link href="/support" className="text-gold/80 hover:text-gold">
          Need help?
        </Link>
      </p>
    </>
  );
}
