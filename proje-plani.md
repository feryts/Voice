# Sesli Sohbet Uygulaması — Proje Planı

## 1. Genel Mimari

```
voice-chat-platform/
├── mobile-app/          → React Native (Expo) — Android + iOS
├── backend-api/         → Node.js (NestJS) + PostgreSQL
├── admin-panel/         → Next.js (Vercel'de demo)
└── shared/              → Ortak tipler, sabitler (coin oranları, roller vb.)
```

Üç parça birbirinden bağımsız deploy edilir ama aynı backend API'yi kullanır:
- Mobil uygulama → kullanıcı tarafı
- Admin panel → yönetim tarafı
- Backend → ikisinin de ortak beyni

---

## 2. mobile-app/ (React Native - Expo)

```
mobile-app/
├── app/
│   ├── (auth)/          → giriş, kayıt, telefon doğrulama
│   ├── (rooms)/         → oda listesi, oda içi ekran, sesli sohbet arayüzü
│   ├── (wallet)/        → coin bakiyesi, coin satın alma, hediye gönderme
│   ├── (profile)/       → kullanıcı profili, ayarlar
│   └── (agency)/        → ajansa bağlı yayıncı ekranı (kazanç görme)
├── components/          → oda kartı, ses dalgası animasyonu, hediye popup'ı
├── services/
│   ├── api.ts           → backend ile iletişim
│   ├── agora.ts         → sesli sohbet SDK entegrasyonu
│   └── auth.ts
└── store/               → global state (kullanıcı, coin bakiyesi, aktif oda)
```

---

## 3. backend-api/ (NestJS + PostgreSQL)

```
backend-api/
├── src/
│   ├── auth/            → giriş, JWT, rol bazlı yetkilendirme
│   ├── users/           → kullanıcı CRUD, ban durumu
│   ├── rooms/           → sesli oda oluşturma/yönetme, Agora token üretimi
│   ├── wallet/          → coin bakiyesi, coin paketleri, satın alma geçmişi
│   ├── gifts/           → hediye kataloğu, hediye gönderme işlemleri
│   ├── agency/          → ajans-yayıncı ilişkisi, komisyon hesaplama
│   ├── payouts/         → maaş/çekim talepleri, onay akışı
│   ├── admin/           → admin'e özel endpoint'ler (rol kontrolü burada sıkı)
│   ├── security/        → IP loglama, çoklu hesap tespiti, ban sistemi
│   └── common/          → guard'lar, decorator'lar, interceptor'lar
├── prisma/ (veya typeorm)
│   └── schema.prisma    → veritabanı şeması
└── config/
```

**Rol sistemi (tek giriş ekranı, role göre yetki):**
- `SUPER_ADMIN` → her şeyi görür (coin fiyatı, tüm ajans kazançları, IP logları, ban)
- `AGENCY_MANAGER` → sadece kendi ajansının yayıncı kazançlarını görür
- `MODERATOR` → sadece ban/rapor yönetimi
- `USER` → normal kullanıcı

---

## 4. admin-panel/ (Next.js → Vercel)

```
admin-panel/
├── app/
│   ├── login/                → tek giriş ekranı
│   ├── dashboard/             → genel özet (günlük coin satışı, aktif oda sayısı)
│   ├── coins/                 → coin paket fiyatlarını düzenleme
│   ├── payouts/                → maaş/çekim onayları, oranlar
│   ├── agencies/               → ajans listesi, ajans bazlı kazanç raporu
│   ├── users/                  → kullanıcı arama, ban/unban, IP geçmişi
│   └── security/                → şüpheli IP/çoklu hesap uyarıları
└── lib/
    └── permissions.ts          → hangi rol hangi sayfayı görebilir
```

---

## 5. Veritabanı — Ana Tablolar (özet)

- `users` (id, telefon, coin_bakiyesi, rol, ban_durumu, son_ip)
- `rooms` (id, sahip_id, aktif_mi, agora_channel)
- `coin_packages` (id, miktar, fiyat, para_birimi)
- `gifts` (id, isim, coin_degeri, animasyon)
- `gift_transactions` (gönderen, alıcı, hediye_id, oda_id, tarih)
- `agencies` (id, isim, komisyon_orani)
- `agency_hosts` (agency_id, host_id)
- `payouts` (host_id, tutar, durum, tarih)
- `login_logs` (user_id, ip, cihaz, tarih) → çoklu hesap/ban analizi için

---

## 6. Önerilen Sıra

1. Veritabanı şeması (yukarıdaki tablolar detaylandırılır)
2. Backend: auth + roller + temel CRUD
3. Admin panel: login + dashboard + coin/ajans ekranları (Vercel'de demo)
4. Backend: wallet + gift + agency mantığı
5. Mobil app: oda + sesli sohbet (Agora entegrasyonu)
6. Mobil app: wallet + hediye gönderme
7. Güvenlik: IP loglama, ban sistemi, çoklu hesap tespiti

---

*Not: Bu bir planlama dokümanıdır. Her adımda kod yazarken sırayla ilerleyeceğiz — istersen bir sonraki adım olan veritabanı şemasına geçebiliriz.*
