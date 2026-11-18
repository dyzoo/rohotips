export type BetSlipTheme = "dark" | "light";

export const slipTheme = {
  dark: {
    page: "bg-[#24262A] text-white",
    card: "bg-[#17191D] text-white",
    tax: "bg-[#303237] text-white",
    divider: "border-white/10",
    muted: "text-white/45",
    soft: "text-white/65",
    value: "text-white",
    border: "border-white/15",
    button: "bg-[#303237] text-white hover:bg-[#3a3d43]",
    icon: "text-green-400",
    badge: "bg-black/50 text-white/70",
  },
  light: {
    page: "bg-[#F4F5F7] text-[#111318]",
    card: "bg-white text-[#111318]",
    tax: "bg-[#ECEEF1] text-[#111318]",
    divider: "border-black/10",
    muted: "text-black/45",
    soft: "text-black/65",
    value: "text-[#111318]",
    border: "border-black/15",
    button: "bg-[#E4E6EA] text-[#111318] hover:bg-[#D9DCE1]",
    icon: "text-emerald-600",
    badge: "bg-black/10 text-black/60",
  },
} as const;
