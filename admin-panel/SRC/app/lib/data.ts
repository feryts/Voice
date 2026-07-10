// ─────────────────────────────────────────────────────────────
// DEMO VERİ KATMANI
// Bu dosya, gerçek bir veritabanı (PostgreSQL + Prisma önerilir)
// bağlanana kadar admin panelini test edebilmen için in-memory
// (bellekte tutulan) örnek veriler sağlar. Sunucu her yeniden
// başladığında veriler sıfırlanır — bu normaldir, demo amaçlıdır.
// Prodüksiyona geçerken bu dosyadaki fonksiyonları gerçek DB
// sorgularıyla değiştirmen yeterli, üst katmanlar (API route'lar)
// değişmeden kalabilir.
// ─────────────────────────────────────────────────────────────

export type Role = "SUPER_ADMIN" | "AGENCY_MANAGER" | "MODERATOR";

export interface CoinPackage {
  id: string;
  coins: number;
  priceUSD: number;
}

export interface Agency {
  id: string;
  name: string;
  commissionRate: number; // ajansın host kazancından aldığı yüzde
}

export interface AppUser {
  id: string;
  username: string;
  phone: string;
  coinBalance: number;
  role: "USER" | "HOST";
  agencyId: string | null;
  banned: boolean;
  lastIp: string;
  totalEarningsUSD: number; // host ise, coin karşılığı kazandığı toplam (agency payı düşülmeden önce)
}

export interface Payout {
  id: string;
  hostId: string;
  hostName: string;
  agencyId: string;
  amountUSD: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: string;
}

export interface LoginLog {
  id: string;
  userId: string;
  username: string;
  ip: string;
  device: string;
  at: string;
}

// ── COIN PAKETLERİ ──
export const coinPackages: CoinPackage[] = [
  { id: "pkg_1", coins: 100, priceUSD: 0.99 },
  { id: "pkg_2", coins: 550, priceUSD: 4.99 },
  { id: "pkg_3", coins: 1200, priceUSD: 9.99 },
  { id: "pkg_4", coins: 6500, priceUSD: 49.99 },
  { id: "pkg_5", coins: 14000, priceUSD: 99.99 },
];

// Genel ödeme oranı: her 1000 coin karşılığı host'a ödenen USD
export let payoutRatePer1000Coins = 4.5;

// ── AJANSLAR ──
export const agencies: Agency[] = [
  { id: "agc_1", name: "Nova Ajans", commissionRate: 0.2 },
  { id: "agc_2", name: "Aurora Sesli", commissionRate: 0.25 },
  { id: "agc_3", name: "Kristal Medya", commissionRate: 0.18 },
];

// ── KULLANICILAR / YAYINCILAR ──
export const users: AppUser[] = [
  { id: "u_1", username: "melis_ay", phone: "+90 5xx xxx 01 01", coinBalance: 12500, role: "HOST", agencyId: "agc_1", banned: false, lastIp: "88.244.12.5", totalEarningsUSD: 812.4 },
  { id: "u_2", username: "kaan_voice", phone: "+90 5xx xxx 02 02", coinBalance: 8300, role: "HOST", agencyId: "agc_1", banned: false, lastIp: "88.244.12.5", totalEarningsUSD: 540.1 },
  { id: "u_3", username: "derya_live", phone: "+90 5xx xxx 03 03", coinBalance: 21000, role: "HOST", agencyId: "agc_2", banned: false, lastIp: "45.141.87.20", totalEarningsUSD: 1204.75 },
  { id: "u_4", username: "eren_odalari", phone: "+90 5xx xxx 04 04", coinBalance: 400, role: "HOST", agencyId: "agc_3", banned: true, lastIp: "31.223.9.14", totalEarningsUSD: 92.0 },
  { id: "u_5", username: "sude_rooms", phone: "+90 5xx xxx 05 05", coinBalance: 3100, role: "HOST", agencyId: "agc_2", banned: false, lastIp: "45.141.87.20", totalEarningsUSD: 260.9 },
  { id: "u_6", username: "berk_dinleyici", phone: "+90 5xx xxx 06 06", coinBalance: 950, role: "USER", agencyId: null, banned: false, lastIp: "78.180.44.2", totalEarningsUSD: 0 },
  { id: "u_7", username: "asli_dinleyici", phone: "+90 5xx xxx 07 07", coinBalance: 60, role: "USER", agencyId: null, banned: false, lastIp: "78.180.44.2", totalEarningsUSD: 0 },
];

// ── PAYOUT (ÖDEME) TALEPLERİ ──
export const payouts: Payout[] = [
  { id: "p_1", hostId: "u_1", hostName: "melis_ay", agencyId: "agc_1", amountUSD: 312.5, status: "PENDING", requestedAt: "2026-07-08T10:12:00Z" },
  { id: "p_2", hostId: "u_3", hostName: "derya_live", agencyId: "agc_2", amountUSD: 540.0, status: "PENDING", requestedAt: "2026-07-09T14:02:00Z" },
  { id: "p_3", hostId: "u_2", hostName: "kaan_voice", agencyId: "agc_1", amountUSD: 180.0, status: "APPROVED", requestedAt: "2026-07-01T09:30:00Z" },
  { id: "p_4", hostId: "u_5", hostName: "sude_rooms", agencyId: "agc_2", amountUSD: 95.4, status: "REJECTED", requestedAt: "2026-06-28T16:45:00Z" },
];

// ── GİRİŞ / IP LOGLARI ──
export const loginLogs: LoginLog[] = [
  { id: "l_1", userId: "u_1", username: "melis_ay", ip: "88.244.12.5", device: "iPhone 14", at: "2026-07-10T08:01:00Z" },
  { id: "l_2", userId: "u_2", username: "kaan_voice", ip: "88.244.12.5", device: "Samsung S23", at: "2026-07-10T08:03:00Z" },
  { id: "l_3", userId: "u_3", username: "derya_live", ip: "45.141.87.20", device: "iPhone 13", at: "2026-07-10T09:15:00Z" },
  { id: "l_4", userId: "u_5", username: "sude_rooms", ip: "45.141.87.20", device: "Redmi Note 12", at: "2026-07-10T09:20:00Z" },
  { id: "l_5", userId: "u_4", username: "eren_odalari", ip: "31.223.9.14", device: "iPhone 11", at: "2026-07-09T22:40:00Z" },
  { id: "l_6", userId: "u_6", username: "berk_dinleyici", ip: "78.180.44.2", device: "Samsung A54", at: "2026-07-10T07:10:00Z" },
  { id: "l_7", userId: "u_7", username: "asli_dinleyici", ip: "78.180.44.2", device: "iPhone 15", at: "2026-07-10T07:12:00Z" },
];

// Aynı IP'yi paylaşan farklı kullanıcı sayısını bulur (çoklu hesap şüphesi)
export function findSharedIps() {
  const map = new Map<string, Set<string>>();
  for (const log of loginLogs) {
    if (!map.has(log.ip)) map.set(log.ip, new Set());
    map.get(log.ip)!.add(log.username);
  }
  return Array.from(map.entries())
    .map(([ip, usernames]) => ({ ip, usernames: Array.from(usernames) }))
    .filter((row) => row.usernames.length > 1);
}

export function getAgencyEarnings(agencyId: string) {
  const hosts = users.filter((u) => u.agencyId === agencyId && u.role === "HOST");
  const agency = agencies.find((a) => a.id === agencyId)!;
  const grossUSD = hosts.reduce((sum, h) => sum + h.totalEarningsUSD, 0);
  const commissionUSD = grossUSD * agency.commissionRate;
  const hostShareUSD = grossUSD - commissionUSD;
  return { agency, hosts, grossUSD, commissionUSD, hostShareUSD };
}

export function setPayoutRate(newRate: number) {
  payoutRatePer1000Coins = newRate;
}
