import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "@/hooks/use-auth";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
