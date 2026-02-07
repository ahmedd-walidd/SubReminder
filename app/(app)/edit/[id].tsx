import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SelectField } from "@/components/SelectField";
import { TextInputField } from "@/components/TextInputField";
import {
    deleteSubscription,
    getSubscriptionById,
    updateSubscription,
} from "@/services/subscriptions";

const currencies = ["USD", "EUR", "GBP", "CAD", "AUD"];

export default function EditSubscriptionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [renewalDate, setRenewalDate] = useState(new Date());
  const [reminderDaysBefore, setReminderDaysBefore] = useState("3");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        return;
      }
      const result = await getSubscriptionById(id);
      if (result.data) {
        const sub = result.data;
        setName(sub.name);
        setCost(sub.cost ? String(sub.cost) : "");
        setCurrency(sub.currency ?? "USD");
        setBillingCycle(sub.billing_cycle ?? "monthly");
        setRenewalDate(new Date(sub.renewal_date));
        setReminderDaysBefore(String(sub.reminder_days_before ?? 3));
      }
    };
    load();
  }, [id]);

  const handleSave = async () => {
    if (!id) {
      return;
    }

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

    const result = await updateSubscription(id, {
      name: name.trim(),
      cost: parsedCost,
      currency,
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

  const handleDelete = async () => {
    if (!id) {
      return;
    }

    Alert.alert(
      "Delete subscription",
      "Are you sure you want to delete this subscription?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await deleteSubscription(id);
            if (result.error) {
              Alert.alert("Error", result.error.message);
              return;
            }
            router.back();
          },
        },
      ],
    );
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Edit subscription</Text>

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
        label="Currency"
        value={currency}
        options={currencies.map((item) => ({ label: item, value: item }))}
        onValueChange={setCurrency}
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
        <Text style={styles.label}>Renewal date</Text>
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

      <PrimaryButton title="Save changes" onPress={handleSave} />
      <PrimaryButton
        title="Delete subscription"
        onPress={handleDelete}
        variant="danger"
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  fieldBlock: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
});
