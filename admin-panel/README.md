# Admin Panel — Sesli Sohbet Platformu (Demo)

Next.js 14 ile yazılmış, yetki bazlı yönetim paneli. Demo verilerle çalışıyor (gerçek
veritabanı yok) — amaç, arayüzü ve yetki mantığını test edip onaylaman.

## Yerelde çalıştırma

```bash
cd admin-panel
npm install
npm run dev
```

`http://localhost:3000` → `/login`'e yönlenirsin.

## Giriş / Kayıt sistemi nasıl çalışıyor

1. **Süper admin** zaten hazır — aşağıdaki demo bilgilerle giriş yapabilirsin:
   - Telefon: `+90 500 000 00 00`
   - Şifre: `super-demo-123`
2. **Diğer herkes önce `/register`'dan kayıt olur** (isim + telefon + şifre). Kayıt olan
   hesap otomatik admin olmaz — "onay bekliyor" durumunda kalır, giriş yapamaz.
3. Süper admin, **Admin Yönetimi** sayfasından kayıtlı adaylara yetki atar (en fazla 5 admin):
   - **Ban / IP Kontrolü** — kullanıcı banlama/unban, IP logları
   - **Ajans Yönetimi** — ajans oluşturma/kapatma, yayıncı kotaları
   - **Müşteri Hizmetleri** — destek taleplerine cevap, süper admine iletme
   - **Oda Kontrolü** — odalara *gizli modda* girebilme (normal giriş zaten herkeste var)
4. Bir admine birden fazla yetki verilebilir. Yetkisi olmayan hesap giriş yapamaz.
5. Tüm adminler (yetkisi ne olursa olsun) **Odalar** ve **Taleplerim** sayfalarını görebilir,
   odalara normal modda girip çıkabilir, süper admine talep gönderebilir.

**Demo şifrelerini değiştirmek için** `.env.local` dosyası oluştur:

```
SUPER_ADMIN_PHONE=senin-telefonun
SUPER_ADMIN_PASSWORD=senin-sifren
```

## Vercel'e deploy etme

1. `admin-panel/` klasörünü GitHub reponun kökü yap (ya da monorepo ise Vercel'de
   **Root Directory**'yi `admin-panel` seç).
2. Vercel'de "New Project" → repoyu bağla → framework otomatik "Next.js" algılanır.
3. Environment Variables'a `SUPER_ADMIN_PHONE` ve `SUPER_ADMIN_PASSWORD` ekle.
4. Deploy et.

**ÖNEMLİ:** GitHub'a yüklerken klasör/dosya yollarını ASLA elle taşıma/yeniden adlandırma —
özellikle `src` klasörünü büyük harfle (`SRC`) kaydetme, Linux tabanlı Vercel sunucuları
büyük/küçük harfe duyarlı ve bunu bulamaz. En güvenlisi: bu zip'i indirip `admin-panel`
klasörünü olduğu gibi, hiçbir şeye dokunmadan git ile push etmek.

## ÖNEMLİ — Bu bir demo, prodüksiyon değil

- [ ] Gerçek bir veritabanı bağla (PostgreSQL + Prisma — `backend-api/prisma/schema.prisma`
      şu an admin hesapları hariç diğer tabloları içeriyor, admin hesapları tablosu eklenmeli)
- [ ] Şifreleri hash'le (bcrypt/argon2), düz metin tutma
- [ ] Session cookie'sini imzalı/şifreli yapıya çevir (NextAuth/iron-session)
- [ ] `/api/auth/login` ve `/api/auth/register`'a rate-limit ekle

## Klasör yapısı (özet)

```
src/
├── app/
│   ├── login/               → telefon + şifre ile giriş
│   ├── register/             → admin adayı kaydı
│   ├── (protected)/
│   │   ├── dashboard/
│   │   ├── rooms/             → herkese açık: oda listesi, gir/çık
│   │   ├── coins/              → sadece süper admin
│   │   ├── payouts/             → sadece süper admin
│   │   ├── agencies/             → Ajans Yönetimi yetkisi
│   │   ├── users/                 → Ban/IP yetkisi
│   │   ├── security/               → Ban/IP yetkisi
│   │   ├── customer-service/        → Müşteri Hizmetleri yetkisi
│   │   ├── requests/                 → herkese açık (kendi talepleri / süper adminde hepsi)
│   │   └── admin-management/          → sadece süper admin (yetki atama)
│   └── api/                  → yukarıdaki sayfaların kullandığı endpoint'ler
├── lib/
│   ├── data.ts              → DEMO veri katmanı
│   ├── auth.ts              → giriş/kayıt/oturum mantığı
│   └── permissions.ts       → hangi yetki hangi sayfayı açar
├── components/
└── middleware.ts            → sayfa bazlı yetki kontrolü
```
