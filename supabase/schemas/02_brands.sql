-- =====================================================
-- Brands Table Schema  
-- =====================================================
-- Purpose: Store complete brand identity data for projects
-- Dependencies: Requires public.projects table
-- RLS: User can only access brands from their own projects
-- Structure: Fully relational design with no JSONB columns
-- =====================================================

-- Create brand status enum if it doesn't exist
do $$ begin
    create type public.brand_status as enum ('draft', 'active', 'inactive', 'archived');
exception
    when duplicate_object then null;
end $$;

-- Create price point enum
do $$ begin
    create type public.price_point as enum ('luxury', 'premium', 'mid-market', 'value', 'budget');
exception
    when duplicate_object then null;
end $$;

-- Main brands table with core identity and flattened simple structures
create table public.brands (
  id bigint generated always as identity primary key,
  project_id bigint not null references public.projects (id) on delete cascade,
  
  -- Core Brand Identity
  name text not null,
  tagline text,
  mission text,
  vision text,
  values text[] default '{}',
  
  -- Target Market - Demographics (flattened)
  target_age_range text,
  target_income text,
  target_education text,
  target_location text,
  
  -- Target Market - Psychographics (flattened)
  target_lifestyle text,
  target_interests text[] default '{}',
  target_values text[] default '{}',
  target_personality_traits text[] default '{}',
  target_pain_points text[] default '{}',
  target_needs text[] default '{}',
  
  -- Brand Personality (flattened)
  brand_voice text,
  brand_tone text,
  personality_traits text[] default '{}',
  communication_style text,
  brand_archetype text,
  
  -- Positioning (flattened)
  category text,
  differentiation text,
  competitive_advantages text[] default '{}',
  price_point public.price_point,
  market_position text,
  
  -- Visual Identity - Basic (flattened)
  logo_description text,
  color_scheme text[] default '{}',
  design_principles text[] default '{}',
  
  -- Visual Identity - Typography (structured)
  typography_primary text,
  typography_secondary text,
  typography_accent text,
  
  -- Visual Identity - Imagery (structured)
  imagery_style text,
  imagery_mood text,
  imagery_guidelines text[] default '{}',
  
  status public.brand_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.brands is 'Complete brand identity data with fully structured relational design. No JSONB columns for better type safety and performance.';

-- Add column comments for clarity
comment on column public.brands.target_age_range is 'Target demographic age range (e.g., "25-35", "18-24")';
comment on column public.brands.target_income is 'Target demographic income level (e.g., "$50k-75k", "High income")';
comment on column public.brands.target_education is 'Target demographic education level (e.g., "College educated", "High school")';
comment on column public.brands.target_location is 'Target demographic location (e.g., "Urban areas", "North America")';

comment on column public.brands.target_lifestyle is 'Target psychographic lifestyle description';
comment on column public.brands.target_interests is 'Array of target audience interests';
comment on column public.brands.target_values is 'Array of target audience values (different from brand values)';
comment on column public.brands.target_personality_traits is 'Array of target audience personality traits';
comment on column public.brands.target_pain_points is 'Array of problems the brand solves for customers';
comment on column public.brands.target_needs is 'Array of customer needs the brand addresses';

comment on column public.brands.brand_voice is 'Brand voice description (e.g., "Professional and approachable")';
comment on column public.brands.brand_tone is 'Brand tone description (e.g., "Confident yet humble")';
comment on column public.brands.personality_traits is 'Array of brand personality traits';
comment on column public.brands.communication_style is 'How the brand communicates (e.g., "Direct and clear")';
comment on column public.brands.brand_archetype is 'Brand archetype (e.g., "The Hero", "The Sage")';

comment on column public.brands.category is 'Product/service category (e.g., "SaaS", "E-commerce")';
comment on column public.brands.differentiation is 'What makes this brand different';
comment on column public.brands.competitive_advantages is 'Array of competitive advantages';
comment on column public.brands.price_point is 'Market price positioning';
comment on column public.brands.market_position is 'Overall market position description';

comment on column public.brands.logo_description is 'Textual description of the logo design';
comment on column public.brands.color_scheme is 'Array of brand colors (hex codes)';
comment on column public.brands.design_principles is 'Array of visual design principles';

comment on column public.brands.typography_primary is 'Primary font family name';
comment on column public.brands.typography_secondary is 'Secondary font family name';
comment on column public.brands.typography_accent is 'Accent font family name (optional)';

comment on column public.brands.imagery_style is 'Visual imagery style (e.g., "Minimalist", "Bold and colorful")';
comment on column public.brands.imagery_mood is 'Imagery mood (e.g., "Professional", "Playful")';
comment on column public.brands.imagery_guidelines is 'Array of imagery usage guidelines';

-- Add indexes for performance
create index idx_brands_project_id on public.brands (project_id);
create index idx_brands_status on public.brands (status);
create index idx_brands_created_at_desc on public.brands (created_at desc);
create index idx_brands_name on public.brands (name);
create index idx_brands_category on public.brands (category);
create index idx_brands_price_point on public.brands (price_point);
create index idx_brands_brand_archetype on public.brands (brand_archetype);

-- GIN indexes for array columns to enable efficient searches
create index idx_brands_values_gin on public.brands using gin (values);
create index idx_brands_target_interests_gin on public.brands using gin (target_interests);
create index idx_brands_target_values_gin on public.brands using gin (target_values);
create index idx_brands_target_personality_traits_gin on public.brands using gin (target_personality_traits);
create index idx_brands_target_pain_points_gin on public.brands using gin (target_pain_points);
create index idx_brands_target_needs_gin on public.brands using gin (target_needs);
create index idx_brands_personality_traits_gin on public.brands using gin (personality_traits);
create index idx_brands_competitive_advantages_gin on public.brands using gin (competitive_advantages);
create index idx_brands_color_scheme_gin on public.brands using gin (color_scheme);
create index idx_brands_design_principles_gin on public.brands using gin (design_principles);
create index idx_brands_imagery_guidelines_gin on public.brands using gin (imagery_guidelines);

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