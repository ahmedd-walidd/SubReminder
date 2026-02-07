import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { TextInputField } from "@/components/TextInputField";
import { useAuth } from "@/hooks/use-auth";

const emailRegex = /\S+@\S+\.\S+/;

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid email", "Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting", mode, "with email:", email);
      const result =
        mode === "login"
          ? await signIn(email, password)
          : await signUp(email, password);

      console.log("Auth result:", {
        error: result?.error?.message,
        session: !!result?.data?.session,
        user: !!result?.data?.user,
      });

      if (result?.error) {
        Alert.alert("Authentication failed", result.error.message);
      } else if (mode === "signup" && result?.data?.user) {
        Alert.alert("Success", "Account created! You can now sign in.");
        setMode("login");
      } else if (mode === "login" && result?.data?.session) {
        Alert.alert("Success", "Logged in successfully!");
      }
    } catch (error) {
      console.error("Auth error:", error);
      Alert.alert("Error", String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>SubTrack</Text>
        <Text style={styles.subtitle}>
          {mode === "login" ? "Welcome back" : "Create your account"}
        </Text>
      </View>

      <TextInputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInputField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
      />

      <PrimaryButton
        title={mode === "login" ? "Login" : "Sign up"}
        onPress={handleSubmit}
        loading={loading}
      />

      <Text style={styles.toggleText}>
        {mode === "login"
          ? "Don't have an account?"
          : "Already have an account?"}
        <Text
          style={styles.toggleLink}
          onPress={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {" "}
          {mode === "login" ? "Sign up" : "Login"}
        </Text>
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  toggleText: {
    textAlign: "center",
    marginTop: 16,
    color: "#6B7280",
  },
  toggleLink: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
