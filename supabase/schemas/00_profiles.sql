-- =====================================================
-- Profiles Table Schema (Existing)
-- =====================================================
-- Purpose: User profiles linked to auth.users
-- Dependencies: Requires auth.users table (managed by Supabase)
-- RLS: Users can manage their own profiles, public viewing
-- =====================================================

-- Create handle_new_user function (existing)
create or replace function public.handle_new_user()
returns trigger 
language plpgsql 
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Create profiles table (existing structure)
create table public.profiles (
  id uuid not null primary key,
  updated_at timestamptz,
  username text,
  full_name text,
  avatar_url text,
  website text,
  constraint username_length check (char_length(username) >= 3)
);

comment on table public.profiles is 'User profiles containing additional user information beyond authentication data.';

-- Add foreign key constraint to auth.users
alter table public.profiles 
  add constraint profiles_id_fkey 
  foreign key (id) references auth.users (id) on delete cascade;

-- Add unique constraint on username
alter table public.profiles 
  add constraint profiles_username_key 
  unique (username);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- RLS Policy: Public profiles are viewable by everyone
create policy "Public profiles are viewable by everyone"
  on public.profiles
  for select
  using (true);

-- RLS Policy: Users can insert their own profile
create policy "Users can insert their own profile"
  on public.profiles
  for insert
  to authenticated
  with check (
    auth.uid() = id
  );

-- RLS Policy: Users can update own profile
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (
    auth.uid() = id
  ); 