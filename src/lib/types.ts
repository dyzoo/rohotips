export type Role = "user" | "admin";

export type SlipStatus = "active" | "inactive";
export type OrderStatus = "pending" | "paid" | "failed" | "cancelled";
export type PaymentMethod = "M-Pesa" | "Tigo Pesa" | "Airtel Money" | "HaloPesa";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
  verified: boolean;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
}

export interface ResetToken {
  id: string;
  email: string;
  expiresAt: string;
}

export interface Match {
  home: string;
  away: string;
  market: string;
  odd: number;
  time: string;
}

export interface Betslip {
  id: string;
  code: string;
  title: string;
  category: string;
  odds: number;
  price: number;
  validity: string;
  bookmakers: string[];
  matches: Match[];
  status: SlipStatus;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  slipId: string;
  amount: number;
  method: PaymentMethod;
  phone: string;
  status: OrderStatus;
  reference: string;
  checkoutRequestId: string;
  mode: "demo" | "live";
  createdAt: string;
  paidAt?: string;
}

export interface Slider {
  id: string;
  image: string;
  link: string;
}

export interface Settings {
  siteName: string;
  supportPhone: string;
  whatsapp: string;
  email: string;
  announcement: string;
}

export interface Db {
  users: User[];
  sessions: Session[];
  slips: Betslip[];
  orders: Order[];
  sliders: Slider[];
  resets: ResetToken[];
  settings: Settings;
  brandLogos: Record<string, string>;
  carouselMediaSeeded?: boolean;
}
