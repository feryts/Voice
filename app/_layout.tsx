import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0E0F12" },
        headerTintColor: "#EDEAE3",
        contentStyle: { backgroundColor: "#0E0F12" },
      }}
    />
  );
}
