# Mobil Uygulama — Sesli Sohbet (İskelet)

React Native (Expo + Expo Router) ile başlangıç iskeleti. Android ve iOS için tek koddan yayın
yapılabilecek şekilde kurulu.

## Şu an burada ne var

Sadece bir açılış ekranı (placeholder). Proje planındaki (`proje-plani.md`) klasör yapısına göre
sırayla eklenecek gerçek ekranlar:

- `(auth)` — giriş, kayıt, telefon doğrulama
- `(rooms)` — oda listesi, sesli sohbet ekranı (Agora entegrasyonu)
- `(wallet)` — coin bakiyesi, coin satın alma, hediye gönderme
- `(profile)` — kullanıcı profili
- `(agency)` — ajansa bağlı yayıncının kendi kazancını görebildiği ekran

## Yerelde çalıştırma

```bash
cd mobile-app
npm install
npx expo start
```

Açılan QR kodu Expo Go uygulamasıyla (Android/iOS) okutarak telefonunda canlı önizleme
görebilirsin. Gerçek APK/IPA olarak yayınlamak için `eas build` kullanılacak (bu adım
uygulama ekranları tamamlandıktan sonra).

## Backend bağlantısı

Bu uygulama, `backend-api/` klasöründeki API'ye bağlanacak şekilde tasarlanacak (coin,
oda, hediye işlemleri için). Admin panel ile bu uygulama birbirinden bağımsız deploy edilir,
sadece aynı backend'i paylaşırlar.
