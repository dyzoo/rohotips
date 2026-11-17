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

      <HeroSlider slides={sliders} />

      {settings.announcement ? (
        <p className="mb-5 rounded-2xl border border-gold/20 bg-gold/5 px-4 py-3 text-xs leading-relaxed text-gold/90">
          {settings.announcement}
        </p>
      ) : null}

      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="live-indicator" />
          <h2 className="text-lg font-bold uppercase tracking-wide text-white">Active Betslips</h2>
        </div>
        <span
          id="liveCount"
          className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold shadow-[0_0_8px_rgba(220,185,127,0.2)]"
        >
          {slips.length} Live
        </span>
      </div>

      <div id="tipsContainer">
        {slips.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#333] bg-[#111] px-5 py-14 text-center text-[#888]">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="#B0B0B0" className="mx-auto mb-4 opacity-60">
              <path d="M22.784 14.447L19.903 8.074C19.618 7.466 18.993 7 18.361 7H11V5H5C3.895 5 3 5.895 3 7v10c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2v-2h3c1.105 0 2-.895 2-2v-2c0-.449-.551-1-.216.447zM19 17H5V7h6v2h7.361l2.882 6.374L19 17z" />
            </svg>
            <p className="text-[15px]">
              No active betslips at the moment.
              <br />
              Check back later!
            </p>
          </div>
        ) : (
          slips.map((slip) => (
            <BetslipCard key={slip.id} slip={slip} siteName={settings.siteName} logos={logos} />
          ))
        )}
      </div>

      <p className="mt-8 text-center text-[11px] leading-relaxed text-white/30">
        Betting involves risk. Play responsibly and only with money you can afford to lose.{" "}
        <Link href="/support" className="text-gold/70 hover:text-gold">
          Need help?
        </Link>
      </p>
    </>
  );
}
