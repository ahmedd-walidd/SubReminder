// @ts-nocheck
import { createClient } from "@supabase/supabase-js";

type Subscription = {
  id: string;
  user_id: string;
  name: string;
  cost: number | null;
  currency: string | null;
  billing_cycle: "monthly" | "yearly" | null;
  renewal_date: string;
  reminder_days_before: number | null;
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "";
const fromEmail =
  Deno.env.get("FROM_EMAIL") ?? "SubTrack <no-reply@subtrack.app>";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function buildEmailHtml(subscription: Subscription, reminderDate: string) {
  const cost = subscription.cost ?? 0;
  const currency = subscription.currency ?? "USD";
  return `
    <div style="font-family: Arial, sans-serif; padding: 24px; color: #111827;">
      <h2 style="color:#2563EB;">Subscription Reminder</h2>
      <p>Hi there,</p>
      <p>Your <strong>${subscription.name}</strong> subscription renews on <strong>${reminderDate}</strong>.</p>
      <p>Amount: <strong>${formatCurrency(cost, currency)}</strong></p>
      <p>Billing cycle: ${subscription.billing_cycle ?? "monthly"}</p>
      <hr style="margin: 24px 0;" />
      <p style="font-size: 12px; color: #6B7280;">You are receiving this because you enabled reminders in SubTrack.</p>
    </div>
  `;
}

async function sendEmail(to: string, subject: string, html: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send email: ${errorText}`);
  }
}

Deno.serve(async () => {
  if (!supabaseUrl || !serviceRoleKey) {
    return new Response("Missing Supabase credentials", { status: 500 });
  }

  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);

  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("is_active", true)
    .returns<Subscription[]>();

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const reminders = subscriptions.filter((subscription: Subscription) => {
    const reminderDays = subscription.reminder_days_before ?? 3;
    const renewal = new Date(subscription.renewal_date);
    if (Number.isNaN(renewal.getTime())) {
      return false;
    }
    renewal.setDate(renewal.getDate() - reminderDays);
    return renewal.toISOString().slice(0, 10) === todayIso;
  });

  for (const subscription of reminders) {
    const { data: log } = await supabase
      .from("reminder_logs")
      .select("*")
      .eq("subscription_id", subscription.id)
      .eq("reminder_date", todayIso)
      .maybeSingle();

    if (log) {
      continue;
    }

    const { data: userData } = await supabase.auth.admin.getUserById(
      subscription.user_id,
    );
    const email = userData?.user?.email;

    if (!email) {
      continue;
    }

    const html = buildEmailHtml(subscription, subscription.renewal_date);
    await sendEmail(email, `Upcoming renewal: ${subscription.name}`, html);

    await supabase.from("reminder_logs").insert({
      subscription_id: subscription.id,
      reminder_date: todayIso,
    });
  }

  return new Response(JSON.stringify({ sent: reminders.length }), {
    headers: { "Content-Type": "application/json" },
  });
});
