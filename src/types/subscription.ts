export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  cost: number | null;
  currency: string | null;
  billing_cycle: "monthly" | "yearly" | null;
  renewal_date: string;
  reminder_days_before: number | null;
  is_active: boolean | null;
  created_at: string;
}

export interface SubscriptionInsert {
  user_id?: string | null;
  name: string;
  cost: number | null;
  currency?: string;
  billing_cycle: "monthly" | "yearly";
  renewal_date: Date;
  reminder_days_before: number;
  is_active?: boolean;
}

export interface SubscriptionUpdate {
  name?: string;
  cost?: number | null;
  currency?: string;
  billing_cycle?: "monthly" | "yearly";
  renewal_date?: Date;
  reminder_days_before?: number;
  is_active?: boolean;
}
