-- =====================================================
-- Katharsis — Schema SQL con Row Level Security (RLS)
-- Esegui questo file nel SQL Editor di Supabase
-- =====================================================

-- Abilita estensione UUID
create extension if not exists "uuid-ossp";

-- ─── Tabella profiles ──────────────────────────────────────────────────────────

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null default 'Viandante Cosmico',
  zodiac_sign text not null default 'Leone',
  level integer not null default 1,
  xp integer not null default 0,
  gems integer not null default 0,
  current_streak integer not null default 0,
  record_streak integer not null default 0,
  subscription_status text not null default 'free'
    check (subscription_status in ('free', 'premium')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Tabella daily_checkins ────────────────────────────────────────────────────

create table public.daily_checkins (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null default current_date,
  mood text not null,
  horoscope_text text not null,
  opened boolean not null default false,
  created_at timestamptz not null default now(),
  unique(user_id, date)
);

-- ─── Tabella oracle_messages ───────────────────────────────────────────────────

create table public.oracle_messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  question text not null,
  response text not null,
  created_at timestamptz not null default now()
);

-- ─── Row Level Security ────────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.oracle_messages enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Daily checkins policies
create policy "Users can view own checkins"
  on public.daily_checkins for select
  using (auth.uid() = user_id);

create policy "Users can insert own checkins"
  on public.daily_checkins for insert
  with check (auth.uid() = user_id);

create policy "Users can update own checkins"
  on public.daily_checkins for update
  using (auth.uid() = user_id);

-- Oracle messages policies
create policy "Users can view own oracle messages"
  on public.oracle_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert own oracle messages"
  on public.oracle_messages for insert
  with check (auth.uid() = user_id);

-- ─── Auto-create profile on signup ────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Viandante Cosmico')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Auto-update updated_at on profiles ───────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
