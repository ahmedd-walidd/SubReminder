import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDefaultCurrency } from "@/hooks/use-default-currency";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { listActiveSubscriptions } from "@/services/subscriptions";
import type { Subscription } from "@/types/subscription";
import { formatCurrency } from "@/utils/currency";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const { defaultCurrency } = useDefaultCurrency();
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
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>
            Your subscriptions
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Track upcoming renewals
          </Text>
        </View>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
        <Text style={[styles.summaryLabel, { color: "rgba(255,255,255,0.8)" }]}>
          Estimated monthly spend ({defaultCurrency})
        </Text>
        <Text style={[styles.summaryValue, { color: "#ffffff" }]}>
          {formatCurrency(monthlyTotal, defaultCurrency)}
        </Text>
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
            defaultCurrency={defaultCurrency}
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
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View
            style={[
              styles.emptyState,
              { backgroundColor: colors.surfaceHighlight },
            ]}
          >
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No subscriptions yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
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
    marginBottom: 20,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
  },
  summaryCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  summaryLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  emptyState: {
    padding: 32,
    borderRadius: 24,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: "center",
  },
});
