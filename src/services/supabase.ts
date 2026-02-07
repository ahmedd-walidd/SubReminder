import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error("Missing Supabase environment variables.");
  // eslint-disable-next-line no-console
  console.error("URL:", supabaseUrl);
  // eslint-disable-next-line no-console
  console.error("Key exists:", !!supabaseAnonKey);
}

// eslint-disable-next-line no-console
console.log("Supabase client initialized", {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
