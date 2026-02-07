import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { Subscription } from "@/types/subscription";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress: () => void;
  defaultCurrency?: string;
}

export function SubscriptionCard({
  subscription,
  onPress,
  defaultCurrency = "USD",
}: SubscriptionCardProps) {
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          shadowColor: "#000", // Standard shadow color
        },
        pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] },
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.textContainer}>
          <Text style={[styles.name, { color: colors.text }]}>
            {subscription.name}
          </Text>
          <Text style={[styles.date, { color: colors.textMuted }]}>
            Renews {formatDate(subscription.renewal_date)}
          </Text>
        </View>
        <View
          style={[
            styles.costBadge,
            { backgroundColor: colors.primary + "15" }, // 10% opacity hex approximation roughly
          ]}
        >
          <Text style={[styles.cost, { color: colors.primaryDark }]}>
            {formatCurrency(
              subscription.cost ?? 0,
              subscription.currency ?? defaultCurrency,
            )}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1, // keeping a very sublte border might be nice if the shadow is too weak on some screens, or remove it.
    borderColor: "rgba(0,0,0,0.03)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  costBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  cost: {
    fontSize: 15,
    fontWeight: "700",
  },
  date: {
    fontSize: 13,
    fontWeight: "500",
  },
});
