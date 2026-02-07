-- SubTrack MVP schema

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  created_at timestamp with time zone default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  cost numeric,
  currency text default 'USD',
  billing_cycle text check (billing_cycle in ('monthly', 'yearly')),
  renewal_date date,
  reminder_days_before integer default 3,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_renewal_date_idx on public.subscriptions (renewal_date);

-- Track reminder sends to prevent duplicates
create table if not exists public.reminder_logs (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid references public.subscriptions(id) on delete cascade,
  reminder_date date not null,
  created_at timestamp with time zone default now(),
  unique (subscription_id, reminder_date)
);

alter table public.users enable row level security;

create policy "Users are viewable by owner"
  on public.users
  for select
  using (auth.uid() = id);

create policy "Users are insertable by owner"
  on public.users
  for insert
  with check (auth.uid() = id);

create policy "Users are updatable by owner"
  on public.users
  for update
  using (auth.uid() = id);

alter table public.subscriptions enable row level security;

create policy "Subscriptions are viewable by owner"
  on public.subscriptions
  for select
  using (auth.uid() = user_id);

create policy "Subscriptions are insertable by owner"
  on public.subscriptions
  for insert
  with check (auth.uid() = user_id);

create policy "Subscriptions are updatable by owner"
  on public.subscriptions
  for update
  using (auth.uid() = user_id);

create policy "Subscriptions are deletable by owner"
  on public.subscriptions
  for delete
  using (auth.uid() = user_id);

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
