import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

type ButtonVariant = "primary" | "secondary" | "danger";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: ButtonVariant;
}

export function PrimaryButton({
  title,
  onPress,
  loading = false,
  variant = "primary",
}: PrimaryButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        loading && styles.loading,
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "secondary" ? "#111827" : "#FFFFFF"}
        />
      ) : (
        <Text style={[styles.text, variant === "secondary" && styles.textDark]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  primary: {
    backgroundColor: "#2563EB",
  },
  secondary: {
    backgroundColor: "#E5E7EB",
  },
  danger: {
    backgroundColor: "#DC2626",
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  textDark: {
    color: "#111827",
  },
  pressed: {
    opacity: 0.85,
  },
  loading: {
    opacity: 0.7,
  },
});
