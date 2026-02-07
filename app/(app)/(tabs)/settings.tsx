import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SelectField } from "@/components/SelectField";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/hooks/use-auth";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDefaultCurrency } from "@/hooks/use-default-currency";

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const { defaultCurrency, setDefaultCurrency } = useDefaultCurrency();

  const currencyOptions = ["USD", "EUR", "EGP"].map((code) => ({
    label: code,
    value: code,
  }));

  return (
    <ScreenContainer scrollable={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Manage your account
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Preferences
        </Text>
        <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
          Choose the default currency for new subscriptions.
        </Text>
        <SelectField
          label="Default currency"
          value={defaultCurrency}
          options={currencyOptions}
          onValueChange={setDefaultCurrency}
        />
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Account</Text>
        <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>
          Sign out from this device.
        </Text>
        <PrimaryButton title="Sign out" onPress={signOut} variant="secondary" />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
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
  card: {
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
});
