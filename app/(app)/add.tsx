import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SelectField } from "@/components/SelectField";
import { TextInputField } from "@/components/TextInputField";
import { useDefaultCurrency } from "@/hooks/use-default-currency";
import { createSubscription } from "@/services/subscriptions";

export default function AddSubscriptionScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];
  const { defaultCurrency } = useDefaultCurrency();
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [renewalDate, setRenewalDate] = useState(new Date());
  const [reminderDaysBefore, setReminderDaysBefore] = useState("3");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Missing name", "Please provide a subscription name.");
      return;
    }

    const parsedCost = cost.trim() ? Number(cost) : null;
    if (parsedCost !== null && Number.isNaN(parsedCost)) {
      Alert.alert("Invalid cost", "Please enter a valid number for cost.");
      return;
    }

    const parsedReminder = Number(reminderDaysBefore);
    if (Number.isNaN(parsedReminder) || parsedReminder < 0) {
      Alert.alert(
        "Invalid reminder days",
        "Please enter a valid number of days.",
      );
      return;
    }

    const result = await createSubscription({
      name: name.trim(),
      cost: parsedCost,
      currency: defaultCurrency,
      billing_cycle: billingCycle,
      renewal_date: renewalDate,
      reminder_days_before: parsedReminder,
    });

    if (result.error) {
      Alert.alert("Error", result.error.message);
      return;
    }

    router.back();
  };

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text }]}>
          Add subscription
        </Text>
        <Pressable
          style={styles.closeButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <MaterialIcons name="close" size={22} color={colors.text} />
        </Pressable>
      </View>

      <TextInputField
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Netflix"
      />
      <TextInputField
        label="Cost"
        value={cost}
        onChangeText={setCost}
        placeholder="9.99"
        keyboardType="decimal-pad"
      />

      <SelectField
        label="Billing cycle"
        value={billingCycle}
        options={[
          { label: "Monthly", value: "monthly" },
          { label: "Yearly", value: "yearly" },
        ]}
        onValueChange={(value) =>
          setBillingCycle(value as "monthly" | "yearly")
        }
      />

      <View style={styles.fieldBlock}>
        <Text style={[styles.label, { color: colors.text }]}>Renewal date</Text>
        <PrimaryButton
          title={renewalDate.toDateString()}
          onPress={() => setShowDatePicker(true)}
          variant="secondary"
        />
        {showDatePicker && (
          <DateTimePicker
            value={renewalDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, date) => {
              setShowDatePicker(Platform.OS === "ios");
              if (date) {
                setRenewalDate(date);
              }
            }}
          />
        )}
      </View>

      <TextInputField
        label="Reminder days before"
        value={reminderDaysBefore}
        onChangeText={setReminderDaysBefore}
        placeholder="3"
        keyboardType="number-pad"
      />

      <PrimaryButton title="Save subscription" onPress={handleSave} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldBlock: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
});
