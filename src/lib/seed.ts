import { hashPassword, randomId } from "./crypto";
import type { Betslip, Db, Slider } from "./types";

export const SEED_SLIP_HOURS: Record<string, number> = {
  "1001": 4.3,
  "1002": 7.3,
  "1003": 26,
  "1004": 50,
};

export const SEED_MEDIA_SLIDES: Slider[] = [
  { id: "slide-ronaldo", image: "/ronaldo.jpg", link: "/betslip/1001" },
  { id: "slide-uefa", image: "/uefa.jpg", link: "/betslip/1002" },
  { id: "slide-messi", image: "/Messi.png", link: "/betslip/1003" },
];

function future(hours: number): string {
  return new Date(Date.now() + hours * 3600000).toISOString();
}

function slip(
  id: string,
  title: string,
  category: string,
  odds: number,
  price: number,
  hours: number,
): Betslip {
  return {
    id,
    code: `CT-${id.toUpperCase()}-${randomId(3).toUpperCase()}`,
    title,
    category,
    odds,
    price,
    validity: future(SEED_SLIP_HOURS[id] ?? hours),
    status: "active",
    createdAt: new Date().toISOString(),
  };
}

export function buildSeed(): Db {
  return {
    users: [
      {
        id: "admin-rohotips",
        name: "Roho Admin",
        email: "admin@rohotips.co.tz",
        phone: "+255796184234",
        passwordHash: hashPassword("admin123"),
        role: "admin",
        createdAt: new Date().toISOString(),
        verified: true,
      },
      {
        id: "demo-user",
        name: "Demo User",
        email: "demo@rohotips.co.tz",
        phone: "+255700000000",
        passwordHash: hashPassword("demo123"),
        role: "user",
        createdAt: new Date().toISOString(),
        verified: true,
      },
    ],
    sessions: [],
    slips: [
      slip("1001", "Jamvi la Uhakika", "Jamvi la Leo", 10.05, 6000, 4.3),
      slip("1002", "Kiberenge ya Siku", "Kiberenge", 40.87, 7000, 7.3),
      slip("1003", "Booking Code Special", "Booking Code", 6.5, 5000, 26),
      slip("1004", "Odds Kubwa za Wiki", "Odds Kubwa", 18.2, 10000, 50),
    ],
    orders: [],
    sliders: [
      { id: "slide-1", image: "/banner-1.svg", link: "/betslip/1001" },
      { id: "slide-2", image: "/banner-2.svg", link: "/betslip/1002" },
      { id: "slide-3", image: "/banner-3.svg", link: "/register" },
      ...SEED_MEDIA_SLIDES,
    ],
    resets: [],
    media: [],
    brandLogos: {},
    settings: {
      siteName: "ROHO TIPS",
      supportPhone: "0796184234",
      whatsapp: "255796184234",
      email: "support@rohotips.co.tz",
      announcement: "Mikeka ya uhakika kila siku - lipa kwa M-Pesa.",
      adminName: "Roho Admin",
      adminAvatar: "/avatar.svg",
    },
  };
}
