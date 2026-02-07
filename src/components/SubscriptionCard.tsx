import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Subscription } from "@/types/subscription";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress: () => void;
}

export function SubscriptionCard({
  subscription,
  onPress,
}: SubscriptionCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.name}>{subscription.name}</Text>
        <Text style={styles.cost}>
          {formatCurrency(
            subscription.cost ?? 0,
            subscription.currency ?? "USD",
          )}
        </Text>
      </View>
      <Text style={styles.date}>
        Renews {formatDate(subscription.renewal_date)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  cost: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2563EB",
  },
  date: {
    fontSize: 13,
    color: "#6B7280",
  },
});
