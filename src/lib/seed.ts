import { hashPassword, randomId } from "./crypto";
import type { Betslip, Db } from "./types";

export const SEED_SLIP_HOURS: Record<string, number> = {
  "1001": 4.3,
  "1002": 7.3,
  "1003": 26,
  "1004": 50,
};

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
  bookmakers: string[],
  matches: Betslip["matches"],
): Betslip {
  return {
    id,
    code: `CT-${id.toUpperCase()}-${randomId(3).toUpperCase()}`,
    title,
    category,
    odds,
    price,
    validity: future(SEED_SLIP_HOURS[id] ?? hours),
    bookmakers,
    matches,
    status: "active",
    createdAt: new Date().toISOString(),
  };
}

export function buildSeed(): Db {
  return {
    users: [
      {
        id: "admin-rohotips",
        name: "Champee Admin",
        email: "admin@champeetips.com",
        phone: "+255796184234",
        passwordHash: hashPassword("admin123"),
        role: "admin",
        createdAt: new Date().toISOString(),
        verified: true,
      },
      {
        id: "demo-user",
        name: "Demo User",
        email: "demo@champeetips.com",
        phone: "+255700000000",
        passwordHash: hashPassword("demo123"),
        role: "user",
        createdAt: new Date().toISOString(),
        verified: true,
      },
    ],
    sessions: [],
    slips: [
      slip(
        "1001",
        "Jamvi la Uhakika",
        "Jamvi la Leo",
        10.05,
        6000,
        4.3,
        ["BetPawa"],
        [
          { home: "Simba SC", away: "Young Africans", market: "1X2 - Home", odd: 2.15, time: "20:00" },
          { home: "Arsenal", away: "Chelsea", market: "Over 2.5 Goals", odd: 1.94, time: "22:00" },
          { home: "Barcelona", away: "Real Madrid", market: "Both Teams To Score", odd: 2.4, time: "23:00" },
        ],
      ),
      slip(
        "1002",
        "Kiberenge ya Siku",
        "Kiberenge",
        40.87,
        7000,
        7.3,
        ["BetPawa"],
        [
          { home: "Manchester City", away: "Liverpool", market: "1X2 - Draw", odd: 3.1, time: "19:30" },
          { home: "Inter Milan", away: "Juventus", market: "Over 1.5 Goals", odd: 1.55, time: "21:00" },
          { home: "Al Ahly", away: "Zamalek", market: "Home or Draw", odd: 1.8, time: "20:00" },
        ],
      ),
      slip(
        "1003",
        "Booking Code Special",
        "Booking Code",
        6.5,
        5000,
        26,
        ["SportyBet", "BetPawa"],
        [
          { home: "Dortmund", away: "Bayern", market: "Double Chance", odd: 1.72, time: "21:30" },
          { home: "PSG", away: "Marseille", market: "1X2 - Home", odd: 1.9, time: "22:00" },
        ],
      ),
      slip(
        "1004",
        "Odds Kubwa za Wiki",
        "Odds Kubwa",
        18.2,
        10000,
        50,
        ["BetPawa"],
        [
          { home: "Real Madrid", away: "Atletico", market: "Correct Score 2-1", odd: 7.5, time: "23:00" },
          { home: "Napoli", away: "AC Milan", market: "Over 3.5 Goals", odd: 2.6, time: "21:00" },
        ],
      ),
    ],
    orders: [],
    sliders: [
      { id: "slide-1", image: "/banner-1.svg", link: "/betslip/1001" },
      { id: "slide-2", image: "/banner-2.svg", link: "/betslip/1002" },
      { id: "slide-3", image: "/banner-3.svg", link: "/register" },
    ],
    resets: [],
    settings: {
      siteName: "CHAMPEETIPS",
      supportPhone: "0796184234",
      whatsapp: "255796184234",
      email: "support@champeetips.com",
      announcement: "Mikeka ya uhakika kila siku - lipa kwa M-Pesa, Tigo Pesa, Airtel Money au HaloPesa.",
    },
  };
}
