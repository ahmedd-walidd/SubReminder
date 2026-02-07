# SubTrack - Subscription Reminder App 📱

A React Native mobile app built with Expo and Supabase for tracking subscription renewals and receiving email reminders.

## Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** Supabase (PostgreSQL + Auth)
- **Email:** Supabase Edge Functions with Resend
- **State Management:** React Context API

## Prerequisites

- Node.js 18+ installed
- Expo CLI (`npm install -g expo-cli`)
- Supabase account
- Resend account (for email reminders)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Update `.env` with your credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**Important:** Do NOT use quotes around the values in `.env`

### 3. Set Up Database

1. Open the Supabase SQL Editor
2. Run the SQL from `supabase/schema.sql` to create tables and policies

### 4. Deploy Edge Function (Optional - for email reminders)

1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link project: `supabase link --project-ref your-project-ref`
4. Set environment variables for the function:

```bash
supabase secrets set SUPABASE_URL=your_url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
supabase secrets set RESEND_API_KEY=your_resend_key
supabase secrets set FROM_EMAIL="SubTrack <noreply@yourdomain.com>"
```

5. Deploy function: `supabase functions deploy send-reminders`
6. Set up a cron job to run daily at 9AM in Supabase dashboard

### 5. Start the App

```bash
npx expo start --clear
```

Options to run:

- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app

## Features

- ✅ Email/password authentication
- ✅ Add/edit/delete subscriptions
- ✅ Track renewal dates and costs
- ✅ Monthly spending summary
- ✅ Email reminders before renewals
- ✅ Row-level security for data protection

## Project Structure

```
/app                    # Expo Router screens
  /(auth)              # Authentication screens
  /(app)               # Protected app screens
/src
  /components          # Reusable UI components
  /hooks               # Custom React hooks (auth)
  /services            # Supabase client & API calls
  /types               # TypeScript type definitions
  /utils               # Helper functions
/supabase
  /functions           # Edge Functions for email
  schema.sql           # Database schema & RLS policies
```

## Troubleshooting

### Auth not working

1. Check console logs for Supabase initialization errors
2. Verify `.env` has correct values without quotes
3. Restart with `npx expo start --clear` to reload environment variables
4. Check that email confirmation is disabled in Supabase Auth settings (for testing)

### Environment variables not loading

- Make sure to restart Expo after changing `.env`
- Use `--clear` flag to clear the Metro bundler cache

## License

MIT
