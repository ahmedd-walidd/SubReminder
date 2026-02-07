import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
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
  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme];

  const getBackgroundColor = (variant: ButtonVariant) => {
    switch (variant) {
      case "danger":
        return colors.danger;
      case "secondary":
        return colors.surfaceHighlight;
      default:
        return colors.primary;
    }
  };

  const getTextColor = (variant: ButtonVariant) => {
    if (variant === "secondary") return colors.text;
    return "#FFFFFF";
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: getBackgroundColor(variant) },
        pressed && styles.pressed,
        loading && styles.loading,
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "secondary" ? colors.text : "#FFFFFF"}
        />
      ) : (
        <Text style={[styles.text, { color: getTextColor(variant) }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  loading: {
    opacity: 0.7,
  },
});
