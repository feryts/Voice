import { View, Text, StyleSheet } from "react-native";

// ─────────────────────────────────────────────────────────────
// Bu, mobil uygulamanın ilk ekranı için başlangıç iskeletidir.
// Şu an sadece yer tutucu (placeholder) — gerçek oda listesi,
// giriş/kayıt akışı ve sesli sohbet ekranları bir sonraki adımda
// modül modül eklenecek (bkz. proje-plani.md → "Önerilen Sıra").
// ─────────────────────────────────────────────────────────────

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sesli Sohbet</Text>
      <Text style={styles.subtitle}>Mobil uygulama iskeleti — geliştirme burada başlayacak</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0F12",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  title: {
    color: "#EDEAE3",
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: "#8A8F9C",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
