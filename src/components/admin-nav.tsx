"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links: { href: string; label: string; match?: string }[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/slips", label: "Betslips" },
  { href: "/admin/betslip", label: "Bet Slip" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/settings#profile", label: "Profile", match: "/admin/settings" },
  { href: "/admin/settings", label: "Settings", match: "/admin/settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-nav -mb-4">
      {links.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.match ?? link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={active ? "active" : undefined}
            aria-current={active ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
