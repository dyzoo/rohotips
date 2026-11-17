import Link from "next/link";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const settings = await getSettings();

  return (
    <div className="animate-enter">
      <Link
        href="/profile"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/70 transition hover:text-gold"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </Link>

      <h1 className="gold-text mb-8 text-3xl font-black tracking-tight">Privacy Policy</h1>

      <div className="glass-card space-y-6 rounded-[32px] p-8 text-sm font-light leading-relaxed text-gray-300">
        <p>
          At <strong className="text-white">{settings.siteName}</strong>, we value your privacy. We collect only
          necessary information (such as your name, email, and phone number) to provide our betting tip services
          securely and effectively.
        </p>

        <div>
          <h3 className="mb-2 flex items-center font-bold text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 h-4 w-4 text-gold">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
            Data Usage
          </h3>
          <p>
            Your data is used solely for account management, payment processing, and communication regarding your
            subscription. We strictly do not sell, rent, or share your personal data with any third parties.
          </p>
        </div>

        <div>
          <h3 className="mb-2 flex items-center font-bold text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 h-4 w-4 text-gold">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Security
          </h3>
          <p>We implement industry-standard encryption and security measures to protect your data and transactions.</p>
        </div>

        <div>
          <h3 className="mb-2 flex items-center font-bold text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 h-4 w-4 text-gold">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            Responsible Gaming
          </h3>
          <p>
            Betting involves risk. Only play with money you can afford to lose. If you feel you need support, contact
            our team and we will point you to the right resources.
          </p>
        </div>

        <div className="border-t border-white/5 pt-4">
          <p className="mb-1">
            <strong>Contact:</strong> For any privacy concerns, reach us at{" "}
            <a href={`tel:${settings.supportPhone}`} className="gold-text font-bold hover:underline">
              {settings.supportPhone}
            </a>
            .
          </p>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-gray-500">Last updated: 2026</p>
        </div>
      </div>
    </div>
  );
}
