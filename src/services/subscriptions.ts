import type { PostgrestSingleResponse } from "@supabase/supabase-js";

import { supabase } from "@/services/supabase";
import type {
    Subscription,
    SubscriptionInsert,
    SubscriptionUpdate,
} from "@/types/subscription";

export async function listActiveSubscriptions() {
  return supabase
    .from("subscriptions")
    .select("*")
    .eq("is_active", true)
    .order("renewal_date", { ascending: true })
    .returns<Subscription[]>();
}

export async function getSubscriptionById(id: string) {
  const response = await supabase
    .from("subscriptions")
    .select("*")
    .eq("id", id)
    .single();

  return response as PostgrestSingleResponse<Subscription>;
}

export async function createSubscription(payload: SubscriptionInsert) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  return supabase
    .from("subscriptions")
    .insert({ ...payload, user_id: userId })
    .select("*")
    .single();
}

export async function updateSubscription(
  id: string,
  payload: SubscriptionUpdate,
) {
  return supabase
    .from("subscriptions")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
}

export async function deleteSubscription(id: string) {
  return supabase.from("subscriptions").delete().eq("id", id);
}
