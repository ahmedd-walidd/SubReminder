import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { useAuth } from "@/hooks/use-auth";
import { listActiveSubscriptions } from "@/services/subscriptions";
import type { Subscription } from "@/types/subscription";
import { formatCurrency } from "@/utils/currency";

export default function DashboardScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSubscriptions = useCallback(async () => {
    setRefreshing(true);
    const result = await listActiveSubscriptions();
    if (result.data) {
      setSubscriptions(result.data);
    }
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSubscriptions();
    }, [fetchSubscriptions]),
  );

  const monthlyTotal = useMemo(() => {
    return subscriptions.reduce((total, item) => {
      const cost = Number(item.cost ?? 0);
      if (Number.isNaN(cost)) {
        return total;
      }
      return total + (item.billing_cycle === "yearly" ? cost / 12 : cost);
    }, 0);
  }, [subscriptions]);

  return (
    <ScreenContainer scrollable={false}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Your subscriptions</Text>
          <Text style={styles.subtitle}>Track upcoming renewals</Text>
        </View>
        <PrimaryButton title="Sign out" onPress={signOut} variant="secondary" />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Estimated monthly spend</Text>
        <Text style={styles.summaryValue}>{formatCurrency(monthlyTotal)}</Text>
      </View>

      <PrimaryButton
        title="Add subscription"
        onPress={() => router.push("/(app)/add")}
      />

      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            subscription={item}
            onPress={() =>
              router.push({
                pathname: "/(app)/edit/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchSubscriptions}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No subscriptions yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your first subscription to get reminders.
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  summaryCard: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginTop: 6,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  emptyState: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#111827",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
});
