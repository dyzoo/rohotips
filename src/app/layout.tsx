import type { Metadata, Viewport } from "next";
import { Outfit, Roboto } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://rohotips.co.tz"),
  title: {
    default: "ROHO TIPS - Mikeka ya Uhakika & Betting Tips Tanzania",
    template: "%s | ROHO TIPS",
  },
  description:
    "Pata mikeka ya uhakika, odds kubwa na tips za ushindi kila siku kutoka ROHO TIPS. Uchambuzi wa kina na malipo ya haraka kupitia M-Pesa.",
  keywords: [
    "betting tips tanzania",
    "mikeka ya uhakika",
    "jamvi la leo",
    "sportybet booking code",
    "betpawa code",
    "odds kubwa",
    "kiberenge",
    "mkeka wa uhakika",
    "ROHO TIPS",
  ],
  applicationName: "ROHO TIPS",
  authors: [{ name: "ROHO TIPS" }],
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/icon-192.png",
  },
  openGraph: {
    type: "website",
    locale: "sw_TZ",
    siteName: "ROHO TIPS",
    title: "ROHO TIPS - Nyumbani kwa Mikeka ya Uhakika",
    description: "Pata mikeka ya uhakika na tips za ushindi kila siku kutoka ROHO TIPS.",
    images: ["/banner-1.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ROHO TIPS - Nyumbani",
    description: "Pata mikeka ya uhakika na tips za ushindi kila siku kutoka ROHO TIPS.",
    images: ["/banner-1.svg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sw" className={`${outfit.variable} ${roboto.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
