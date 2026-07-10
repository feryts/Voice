# Admin Panel — Sesli Sohbet Platformu (Demo)

Next.js 14 ile yazılmış, rol bazlı yetkilendirmeli yönetim paneli. Şu an **demo verilerle**
çalışıyor (gerçek veritabanı yok) — amaç, arayüzü ve yetki mantığını test edip onaylaman.

## Yerelde çalıştırma

```bash
cd admin-panel
npm install
npm run dev
```

Tarayıcıda `http://localhost:3000` adresine git, `/login` sayfasına yönlendirileceksin.

## Demo giriş şifreleri

| Rol | Şifre | Görebildiği sayfalar |
|---|---|---|
| Süper Admin | `super-demo-123` | Hepsi (coin fiyatları, ödemeler, tüm ajans kazançları, kullanıcılar, IP güvenlik) |
| Ajans Yöneticisi | `agency-demo-123` | Sadece kendi ajansının (Nova Ajans) kazanç raporu |
| Moderatör | `mod-demo-123` | Kullanıcılar/banlar ve IP güvenlik |

**Bu şifreleri değiştirmek için** proje kök dizininde `.env.local` dosyası oluştur:

```
SUPER_ADMIN_PASSWORD=senin-sifren
AGENCY_MANAGER_PASSWORD=senin-sifren
MODERATOR_PASSWORD=senin-sifren
```

## Vercel'e deploy etme

1. Bu klasörü (`admin-panel/`) kendi GitHub reponun kökü yap (veya monorepo ise Vercel proje
   ayarlarından "Root Directory" olarak `admin-panel` seç).
2. Vercel'de "New Project" → repoyu bağla → framework otomatik "Next.js" olarak algılanır.
3. Environment Variables kısmına yukarıdaki 3 şifreyi eklemeyi unutma (eklemezsen demo
   şifreler geçerli olur).
4. Deploy et.

## ÖNEMLİ — Bu bir demo, prodüksiyon değil

Şu an veriler `src/lib/data.ts` içinde bellekte (in-memory) tutuluyor. Bu, arayüzü test etmen
için yeterli ama **her deploy'da ya da sunucu yeniden başladığında veriler sıfırlanır** ve
birden fazla sunucu instance'ı arasında tutarlı olmaz. Gerçek kullanıma geçmeden önce:

- [ ] Gerçek bir veritabanı bağla (PostgreSQL + Prisma önerilir — proje planındaki şema hazır)
- [ ] Şifreleri hash'lenmiş olarak DB'de tut (bcrypt/argon2), düz metin env değişkeni olarak değil
- [ ] Oturum (session) cookie'sini imzalı/şifreli bir yapıya çevir (NextAuth veya iron-session)
- [ ] API route'lara rate-limit ekle (özellikle `/api/auth/login`)

## Klasör yapısı

```
src/
├── app/
│   ├── login/              → tek giriş ekranı
│   ├── (protected)/         → sidebar arkasındaki tüm sayfalar
│   │   ├── dashboard/
│   │   ├── coins/            → coin fiyatları + ödeme oranı
│   │   ├── payouts/           → yayıncı ödeme talepleri (onay/red)
│   │   ├── agencies/           → ajans kazanç raporu (role göre kısıtlı)
│   │   ├── users/               → kullanıcı arama, ban/unban
│   │   └── security/             → IP logları, çoklu hesap tespiti
│   └── api/                 → yukarıdaki sayfaların kullandığı endpoint'ler
├── lib/
│   ├── data.ts             → DEMO veri katmanı (gerçek DB ile değiştirilecek)
│   ├── auth.ts             → giriş/şifre/rol mantığı
│   └── permissions.ts      → hangi rol hangi sayfayı görebilir
├── components/
└── middleware.ts           → sayfa bazlı yetki kontrolü (rol yetkisi yoksa dashboard'a atar)
```
