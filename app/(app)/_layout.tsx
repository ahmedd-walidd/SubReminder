import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/hooks/use-auth";

export default function AppLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    />
  );
}
