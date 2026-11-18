import Link from "next/link";
import { connection } from "next/server";
import { BetslipCard } from "@/components/betslip-card";
import { HeroSlider } from "@/components/hero-slider";
import { findActiveSlips, getBrandLogos, getSettings, getSliders } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await connection();
  const [slips, sliders, settings, logos] = await Promise.all([
    findActiveSlips(),
    getSliders(),
    getSettings(),
    getBrandLogos(),
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

      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Daily briefing / {new Date().getFullYear()}</p>
          <h1 className="mt-1 text-[26px] font-black uppercase leading-none tracking-tight text-white">
            The <span className="gold-text">tip desk</span>
          </h1>
        </div>
        <span className="num hidden text-[10px] tracking-widest text-white/30 sm:block">TZ / EAT</span>
      </div>

      <HeroSlider slides={sliders} />

      {settings.announcement ? (
        <div className="mb-6 flex items-start gap-3 border-l-2 border-gold bg-gold/[0.05] px-3 py-3">
          <span className="live-indicator mt-1" />
          <p className="text-[12px] leading-relaxed text-gold/90">{settings.announcement}</p>
        </div>
      ) : null}

      <div className="section-head">
        <div>
          <p className="eyebrow">Section 01 / Open now</p>
          <h2>Active betslips</h2>
        </div>
        <span className="count-badge">{String(slips.length).padStart(2, "0")} live</span>
      </div>

      <div id="tipsContainer">
        {slips.length === 0 ? (
          <div className="panel-plain px-5 py-14 text-center">
            <p className="eyebrow mb-3">Desk closed</p>
            <p className="text-[15px] text-white/45">
              No active betslips at the moment.
              <br />
              Check back later!
            </p>
          </div>
        ) : (
          slips.map((slip, index) => (
            <BetslipCard key={slip.id} slip={slip} siteName={settings.siteName} logos={logos} index={index} />
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
