import Link from "next/link";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const settings = await getSettings();

  return (
    <div className="animate-enter">
      <Link
        href="/profile"
        className="mb-6 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-white/45 transition hover:text-gold"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </Link>

      <p className="eyebrow">Legal / Policy</p>
      <h1 className="mb-7 mt-1 text-3xl font-black uppercase tracking-tight text-white">Privacy policy</h1>

      <div className="panel space-y-7 p-6 text-sm leading-relaxed text-white/55">
        <p>
          At <strong className="text-white">{settings.siteName}</strong>, we value your privacy. We collect only
          necessary information (such as your name, email, and phone number) to provide our betting tip services
          securely and effectively.
        </p>

        {[
          {
            code: "01",
            title: "Data usage",
            body: "Your data is used solely for account management, payment processing, and communication regarding your subscription. We strictly do not sell, rent, or share your personal data with any third parties.",
          },
          {
            code: "02",
            title: "Security",
            body: "We implement industry-standard encryption and security measures to protect your data and transactions.",
          },
          {
            code: "03",
            title: "Responsible gaming",
            body: "Betting involves risk. Only play with money you can afford to lose. If you feel you need support, contact our team and we will point you to the right resources.",
          },
        ].map((section) => (
          <div key={section.code} className="border-l border-gold/30 pl-4">
            <h3 className="mb-2 flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-white">
              <span className="num text-[10px] text-gold">{section.code}</span>
              {section.title}
            </h3>
            <p>{section.body}</p>
          </div>
        ))}

        <div className="border-t border-white/[0.07] pt-5">
          <p>
            <strong className="text-white">Contact:</strong> For any privacy concerns, reach us at{" "}
            <a href={`tel:${settings.supportPhone}`} className="font-bold text-gold hover:underline">
              {settings.supportPhone}
            </a>
            .
          </p>
          <p className="eyebrow mt-3 !text-[9px] text-white/30">Last updated: 2026</p>
        </div>
      </div>
    </div>
  );
}
