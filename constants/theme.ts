/**
 * Modern color palette for SubTrack
 */
import { Platform } from "react-native";

const primary = "#6366F1"; // Indigo 500
const primaryDark = "#4F46E5"; // Indigo 600
const secondary = "#EC4899"; // Pink 500

export const Colors = {
  light: {
    primary: primary,
    primaryDark: primaryDark,
    secondary: secondary,
    background: "#F9FAFB", // Gray 50
    surface: "#FFFFFF",
    surfaceHighlight: "#F3F4F6", // Gray 100
    text: "#111827", // Gray 900
    textMuted: "#6B7280", // Gray 500
    textLight: "#9CA3AF", // Gray 400
    border: "#E5E7EB", // Gray 200
    danger: "#EF4444", // Red 500
    success: "#10B981", // Emerald 500
    warning: "#F59E0B", // Amber 500
    tint: primary,
    tabIconDefault: "#9CA3AF",
    tabIconSelected: primary,
  },
  dark: {
    primary: "#818CF8", // Indigo 400
    primaryDark: "#6366F1", // Indigo 500
    secondary: "#F472B6", // Pink 400
    background: "#111827", // Gray 900
    surface: "#1F2937", // Gray 800
    surfaceHighlight: "#374151", // Gray 700
    text: "#F9FAFB", // Gray 50
    textMuted: "#D1D5DB", // Gray 300
    textLight: "#9CA3AF", // Gray 400
    border: "#374151", // Gray 700
    danger: "#F87171", // Red 400
    success: "#34D399", // Emerald 400
    warning: "#FBBF24", // Amber 400
    tint: "#818CF8",
    tabIconDefault: "#6B7280",
    tabIconSelected: "#818CF8",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "System",
    serif: "Georgia",
    mono: "Menlo",
  },
  default: {
    sans: "sans-serif",
    serif: "serif",
    mono: "monospace",
  },
});
