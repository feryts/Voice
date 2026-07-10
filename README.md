# Sesli Sohbet Platformu

Bu repo üç bağımsız parçadan oluşuyor:

| Klasör | Ne | Nereye deploy edilir | Durum |
|---|---|---|---|
| `admin-panel/` | Yönetim paneli (Next.js) | **Vercel** | ✅ Çalışır durumda, demo veriyle |
| `backend-api/` | Ortak backend (NestJS + Prisma) | Railway/Render/VPS | 🚧 Veritabanı şeması hazır, modüller sırayla yazılacak |
| `mobile-app/` | Android + iOS uygulaması (Expo) | App Store / Play Store | 🚧 İskelet, ekranlar sırayla yazılacak |

`proje-plani.md` dosyasında tüm mimarinin ayrıntılı açıklaması var.

## En hızlı şekilde test etmek istiyorsan

**Admin panel** şu an tamamen çalışıyor ve Vercel'e direkt atılabilir:

```bash
cd admin-panel
npm install
npm run dev
```

`http://localhost:3000` → `/login` → aşağıdaki demo şifrelerden biriyle gir:

- Süper Admin: `super-demo-123` (her şeyi görür — coin fiyatları, ödemeler, tüm ajans
  kazançları, kullanıcılar, IP güvenlik)
- Ajans Yöneticisi: `agency-demo-123` (sadece kendi ajansının kazanç raporunu görür)
- Moderatör: `mod-demo-123` (kullanıcı/ban ve IP güvenlik)

Detaylı Vercel deploy adımları için `admin-panel/README.md` dosyasına bak.

## GitHub'a yükleme

Tüm klasörü tek bir repo olarak yükleyebilirsin:

```bash
git init
git add .
git commit -m "İlk commit: proje planı + admin panel + iskeletler"
git remote add origin <senin-repo-adresin>
git push -u origin main
```

Vercel'de proje oluştururken **Root Directory** ayarını `admin-panel` olarak seçmeyi unutma
(repo kökünde birden fazla proje olduğu için Vercel hangisini build edeceğini bilmeli).

## Sırada ne var

1. Admin paneli incele, kontrol et — eksik/yanlış bir şey varsa söyle, düzeltelim
2. Onayladıktan sonra: backend API modüllerini (auth, wallet, agency, payouts) gerçek
   koda dökeriz
3. Ardından mobil uygulamanın gerçek ekranlarına (oda, sesli sohbet, coin) geçeriz
