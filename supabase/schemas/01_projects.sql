-- =====================================================
-- Projects Table Schema
-- =====================================================
-- Purpose: Main container for user storefront projects
-- Dependencies: Requires auth.users table
-- RLS: User can only access their own projects
-- =====================================================

-- Create session status enum for projects (if not exists)
do $$ begin
    create type public.session_status as enum ('active', 'completed', 'archived');
exception
    when duplicate_object then null;
end $$;

-- Create projects table
create table public.projects (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text,
  status public.session_status not null default 'active',
  settings jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.projects is 'Container for user storefront projects. Each project can contain brands, products, and export configurations.';

-- Add indexes for performance
create index idx_projects_user_id on public.projects (user_id);
create index idx_projects_status on public.projects (status);
create index idx_projects_created_at_desc on public.projects (created_at desc);

-- Enable Row Level Security
alter table public.projects enable row level security;

-- RLS Policy: Users can view their own projects
create policy "Users can view their own projects"
  on public.projects
  for select
  to authenticated
  using (
    user_id = auth.uid()
  );

-- RLS Policy: Users can insert their own projects
create policy "Users can insert their own projects"
  on public.projects
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
  );

-- RLS Policy: Users can update their own projects
create policy "Users can update their own projects"
  on public.projects
  for update
  to authenticated
  using (
    user_id = auth.uid()
  );

-- RLS Policy: Users can delete their own projects
create policy "Users can delete their own projects"
  on public.projects
  for delete
  to authenticated
  using (
    user_id = auth.uid()
  );

-- Function handle_updated_at is defined in the migration file

-- Trigger to automatically update updated_at on projects
create trigger trigger_projects_updated_at
  before update on public.projects
  for each row
  execute function public.handle_updated_at(); 