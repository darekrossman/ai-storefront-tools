-- =====================================================
-- Brands Table Schema  
-- =====================================================
-- Purpose: Store complete brand identity data for projects
-- Dependencies: Requires public.projects table
-- RLS: User can only access brands from their own projects
-- JSONB Structure: Aligns with Zod schemas in lib/schemas.ts
-- =====================================================

-- Create brand status enum if it doesn't exist
do $$ begin
    create type public.brand_status as enum ('draft', 'active', 'inactive', 'archived');
exception
    when duplicate_object then null;
end $$;

-- Create brands table
create table public.brands (
  id bigint generated always as identity primary key,
  project_id bigint not null references public.projects (id) on delete cascade,
  name text not null,
  tagline text,
  mission text,
  vision text,
  values text[] default '{}',
  -- JSONB columns that align with Zod schemas
  target_market jsonb default '{}',
  brand_personality jsonb default '{}', 
  positioning jsonb default '{}',
  visual_identity jsonb default '{}',
  status public.brand_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.brands is 'Complete brand identity data including demographics, personality, positioning, and visual identity. JSONB columns align with BrandSchema from lib/schemas.ts.';

-- Add column comments for clarity
comment on column public.brands.target_market is 'JSONB: Demographics, psychographics, pain points, and needs (BrandTargetMarketSchema)';
comment on column public.brands.brand_personality is 'JSONB: Voice, tone, personality traits, communication style, and archetype (BrandPersonalitySchema)';
comment on column public.brands.positioning is 'JSONB: Category, differentiation, competitive advantages, and market position (BrandPositioningSchema)';
comment on column public.brands.visual_identity is 'JSONB: Logo description, color scheme, typography, imagery guidelines (BrandVisualIdentitySchema)';

-- Add indexes for performance
create index idx_brands_project_id on public.brands (project_id);
create index idx_brands_status on public.brands (status);
create index idx_brands_created_at_desc on public.brands (created_at desc);
create index idx_brands_name on public.brands (name);

-- GIN indexes for efficient JSONB queries
create index idx_brands_target_market_gin on public.brands using gin (target_market);
create index idx_brands_brand_personality_gin on public.brands using gin (brand_personality);
create index idx_brands_positioning_gin on public.brands using gin (positioning);
create index idx_brands_visual_identity_gin on public.brands using gin (visual_identity);

-- Enable Row Level Security
alter table public.brands enable row level security;

-- RLS Policy: Users can view brands from their own projects
create policy "Users can view brands from their own projects"
  on public.brands
  for select
  to authenticated
  using (
    project_id in (
      select id from public.projects where user_id = auth.uid()
    )
  );

-- RLS Policy: Users can insert brands into their own projects  
create policy "Users can insert brands into their own projects"
  on public.brands
  for insert
  to authenticated
  with check (
    project_id in (
      select id from public.projects where user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update brands from their own projects
create policy "Users can update brands from their own projects"
  on public.brands
  for update
  to authenticated
  using (
    project_id in (
      select id from public.projects where user_id = auth.uid()
    )
  );

-- RLS Policy: Users can delete brands from their own projects
create policy "Users can delete brands from their own projects"
  on public.brands
  for delete
  to authenticated
  using (
    project_id in (
      select id from public.projects where user_id = auth.uid()
    )
  );

-- Trigger to automatically update updated_at on brands
create trigger trigger_brands_updated_at
  before update on public.brands
  for each row
  execute function public.handle_updated_at(); 