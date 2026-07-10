import type { Role } from "./data";

export type NavKey = "dashboard" | "coins" | "payouts" | "agencies" | "users" | "security";

export const NAV_ITEMS: { key: NavKey; label: string; href: string }[] = [
  { key: "dashboard", label: "Genel Bakış", href: "/dashboard" },
  { key: "coins", label: "Coin Fiyatları", href: "/coins" },
  { key: "payouts", label: "Maaş / Ödemeler", href: "/payouts" },
  { key: "agencies", label: "Ajans Kazançları", href: "/agencies" },
  { key: "users", label: "Kullanıcılar & Banlar", href: "/users" },
  { key: "security", label: "IP Güvenlik", href: "/security" },
];

const PERMISSIONS: Record<Role, NavKey[]> = {
  SUPER_ADMIN: ["dashboard", "coins", "payouts", "agencies", "users", "security"],
  AGENCY_MANAGER: ["dashboard", "agencies"],
  MODERATOR: ["dashboard", "users", "security"],
};

export function canAccess(role: Role, key: NavKey): boolean {
  return PERMISSIONS[role].includes(key);
}

export function allowedNavItems(role: Role) {
  return NAV_ITEMS.filter((item) => canAccess(role, item.key));
}

export const ROLE_LABEL: Record<Role, string> = {
  SUPER_ADMIN: "Süper Admin",
  AGENCY_MANAGER: "Ajans Yöneticisi",
  MODERATOR: "Moderatör",
};
