-- =====================================================
-- Waitlist Table Schema
-- =====================================================
-- Purpose: Store email addresses for users interested in joining the waitlist
-- Dependencies: None (standalone table)
-- RLS: Public insert for waitlist signups, admin read access
-- =====================================================

-- Create waitlist table
create table if not exists public.waitlist (
  id uuid not null default gen_random_uuid() primary key,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  source text default 'homepage',
  status text not null default 'active' check (status in ('active', 'notified', 'disabled')),
  metadata jsonb default '{}'::jsonb
);

comment on table public.waitlist is 'Email addresses from users interested in joining the platform waitlist.';
comment on column public.waitlist.email is 'User email address for waitlist notifications.';
comment on column public.waitlist.source is 'Source of the waitlist signup (homepage, referral, etc.).';
comment on column public.waitlist.status is 'Status of the waitlist entry (active, notified, disabled).';
comment on column public.waitlist.metadata is 'Additional metadata about the signup (referrer, utm params, etc.).';

-- Add unique constraint on email to prevent duplicates
do $$ begin
    alter table public.waitlist 
      add constraint waitlist_email_key 
      unique (email);
exception
    when duplicate_object then null;
end $$;

-- Add updated_at trigger
drop trigger if exists handle_updated_at on public.waitlist;
create trigger handle_updated_at
  before update on public.waitlist
  for each row
  execute procedure public.handle_updated_at();

-- Enable Row Level Security
alter table public.waitlist enable row level security;

-- RLS Policy: Allow public to insert waitlist entries (for signups)
create policy "Allow public waitlist signups"
  on public.waitlist
  for insert
  to anon, authenticated
  with check (true);

-- RLS Policy: Only authenticated admin users can read waitlist entries
-- Note: This assumes admin users will be determined by a different mechanism
-- For now, we'll restrict read access to authenticated users only
create policy "Authenticated users can read waitlist"
  on public.waitlist
  for select
  to authenticated
  using (true);

-- RLS Policy: No public updates or deletes (admin only through direct DB access)
-- We intentionally don't create update/delete policies to prevent tampering

-- Create an index on email for faster lookups
create index if not exists waitlist_email_idx on public.waitlist (email);

-- Create an index on created_at for time-based queries
create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

-- Create an index on status for filtering
create index if not exists waitlist_status_idx on public.waitlist (status); 