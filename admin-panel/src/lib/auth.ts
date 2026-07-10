import { cookies } from "next/headers";
import type { Role } from "./data";

// ─────────────────────────────────────────────────────────────
// DEMO GİRİŞ SİSTEMİ
// Tek giriş ekranından, girilen şifreye göre rol belirlenir.
// ÖNEMLİ: Bu bir demo/geliştirme mekanizmasıdır. Prodüksiyonda:
//  - Şifreleri hash'lenmiş olarak gerçek bir veritabanında tut (bcrypt/argon2)
//  - Cookie'yi imzalı/şifreli bir JWT ile değiştir (örn. NextAuth, iron-session)
//  - Ortam değişkenlerinden şifre okumayı tercih et (aşağıda zaten öyle)
// Şifreleri değiştirmek için .env.local dosyasına şunları ekle:
//   SUPER_ADMIN_PASSWORD=...
//   AGENCY_MANAGER_PASSWORD=...
//   MODERATOR_PASSWORD=...
// ─────────────────────────────────────────────────────────────

export interface Session {
  role: Role;
  agencyId?: string; // AGENCY_MANAGER ise, hangi ajansı yönettiği
  name: string;
}

const CREDENTIALS: { password: string; session: Session }[] = [
  {
    password: process.env.SUPER_ADMIN_PASSWORD || "super-demo-123",
    session: { role: "SUPER_ADMIN", name: "Süper Admin" },
  },
  {
    password: process.env.AGENCY_MANAGER_PASSWORD || "agency-demo-123",
    session: { role: "AGENCY_MANAGER", agencyId: "agc_1", name: "Nova Ajans Yöneticisi" },
  },
  {
    password: process.env.MODERATOR_PASSWORD || "mod-demo-123",
    session: { role: "MODERATOR", name: "Moderatör" },
  },
];

const COOKIE_NAME = "vca_session";

export function checkPassword(password: string): Session | null {
  const match = CREDENTIALS.find((c) => c.password === password);
  return match ? match.session : null;
}

export function encodeSession(session: Session): string {
  return Buffer.from(JSON.stringify(session)).toString("base64");
}

export function decodeSession(raw: string): Session | null {
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

export function getSession(): Session | null {
  const raw = cookies().get(COOKIE_NAME)?.value;
  if (!raw) return null;
  return decodeSession(raw);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
