# Backend API — Sesli Sohbet Platformu (İskelet)

Bu klasör, mobil uygulama ve admin panelinin ortak kullanacağı **gerçek** backend için
başlangıç iskeleti ve hazır veritabanı şemasıdır (NestJS + Prisma + PostgreSQL).

## Şu an burada ne var

- `prisma/schema.prisma` — admin panelindeki tüm mock veriye (coin paketleri, kullanıcılar,
  ajanslar, ödemeler, giriş logları) birebir karşılık gelen, çalıştırılabilir veritabanı şeması.
- `package.json` — gerekli bağımlılıklar önceden seçilmiş.

## Bir sonraki adımlar (henüz yazılmadı)

Proje planındaki modüller (`src/auth`, `src/users`, `src/rooms`, `src/wallet`, `src/gifts`,
`src/agency`, `src/payouts`, `src/admin`, `src/security`) klasörleri açıldı ama içleri boş —
bunlar bir sonraki adımda modül modül kodlanacak. Önerilen sıra:

1. `auth` — JWT tabanlı giriş, admin panelindeki rol sistemiyle birebir eşleşecek
2. `users` + `wallet` — kullanıcı ve coin bakiyesi mantığı
3. `rooms` — sesli oda oluşturma, Agora token üretimi
4. `gifts` — hediye gönderme, coin düşme, host kazancına ekleme
5. `agency` + `payouts` — komisyon hesaplama, ödeme talebi akışı
6. `security` — IP loglama, ban, çoklu hesap tespiti

## Kurulum (modüller yazıldıktan sonra)

```bash
cd backend-api
npm install
# .env dosyasına DATABASE_URL ekle (Postgres bağlantı adresi)
npm run prisma:migrate
npm run start:dev
```

## Nereye deploy edilir?

Vercel serverless fonksiyonları uzun süreli WebSocket/ses bağlantıları için uygun değildir.
Bu backend için **Railway, Render veya bir VPS** (Agora/WebRTC sinyalleşmesi + veritabanı
bağlantısı sürekli açık kalması gerektiği için) önerilir. Admin panel (Next.js) Vercel'de
kalabilir, bu backend'e API istekleri atar.
