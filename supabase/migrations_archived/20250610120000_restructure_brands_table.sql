-- =====================================================
-- Migration: Restructure Brands Table
-- =====================================================
-- Purpose: Replace JSONB columns with structured relational data
-- Affected Tables: public.brands (complete restructure)
-- Breaking Change: Yes - This migration restructures the entire brands table
-- Data Migration: All existing brand data will be lost (DROP TABLE)
-- 
-- This migration transforms the brands table from using JSONB columns 
-- (target_market, brand_personality, positioning, visual_identity) 
-- to fully structured relational columns for better type safety,
-- performance, and queryability.
-- =====================================================

-- step 1: drop existing brands table and all related objects
-- warning: this is a destructive operation that will permanently delete all brand data
-- if you need to preserve existing data, export it before running this migration
drop table if exists public.brands cascade;

-- step 2: create enum types needed for the brands table
-- create brand_status enum (may already exist from previous migrations)
do $$ begin
    create type public.brand_status as enum ('draft', 'active', 'inactive', 'archived');
exception
    when duplicate_object then 
        -- enum already exists, skip creation
        null;
end $$;

-- create new price_point enum for price positioning
do $$ begin
    create type public.price_point as enum ('luxury', 'premium', 'mid-market', 'value', 'budget');
exception
    when duplicate_object then 
        -- enum already exists, skip creation
        null;
end $$;

-- step 3: create the new brands table with structured columns
-- this replaces all jsonb columns with explicit, typed columns
create table public.brands (
  id bigint generated always as identity primary key,
  project_id bigint not null references public.projects (id) on delete cascade,
  
  -- core brand identity information
  name text not null,
  tagline text,
  mission text,
  vision text,
  values text[] default '{}',
  
  -- target market demographics (previously in target_market jsonb)
  -- these columns capture the primary demographic characteristics of the target audience
  target_age_range text,
  target_income text,
  target_education text,
  target_location text,
  
  -- target market psychographics (previously in target_market jsonb)
  -- these columns capture behavioral and psychological characteristics
  target_lifestyle text,
  target_interests text[] default '{}',
  target_values text[] default '{}',
  target_personality_traits text[] default '{}',
  target_pain_points text[] default '{}',
  target_needs text[] default '{}',
  
  -- brand personality characteristics (previously in brand_personality jsonb)
  -- these columns define how the brand communicates and expresses itself
  brand_voice text,
  brand_tone text,
  personality_traits text[] default '{}',
  communication_style text,
  brand_archetype text,
  
  -- competitive positioning information (previously in positioning jsonb)
  -- these columns define the brand's market position and differentiation
  category text,
  differentiation text,
  competitive_advantages text[] default '{}',
  price_point public.price_point,
  market_position text,
  
  -- visual identity basics (previously in visual_identity jsonb)
  -- core visual brand elements that can be stored as simple types
  logo_description text,
  color_scheme text[] default '{}',
  design_principles text[] default '{}',
  
  -- visual identity typography (previously nested in visual_identity jsonb)
  -- typography choices are now explicit columns for better queryability
  typography_primary text,
  typography_secondary text,
  typography_accent text,
  
  -- visual identity imagery guidelines (previously nested in visual_identity jsonb)
  -- imagery guidelines are now structured for better access and filtering
  imagery_style text,
  imagery_mood text,
  imagery_guidelines text[] default '{}',
  
  -- status and metadata
  status public.brand_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- add detailed column comments for documentation and clarity
comment on table public.brands is 'Complete brand identity data with fully structured relational design. Replaces previous JSONB approach for better type safety, performance, and queryability.';

comment on column public.brands.target_age_range is 'Target demographic age range (e.g., "25-35", "18-24", "35-50")';
comment on column public.brands.target_income is 'Target demographic income level (e.g., "$50k-75k", "High income", "Middle class")';
comment on column public.brands.target_education is 'Target demographic education level (e.g., "College educated", "High school", "Graduate degree")';
comment on column public.brands.target_location is 'Target demographic location (e.g., "Urban areas", "North America", "Global")';

comment on column public.brands.target_lifestyle is 'Target psychographic lifestyle description (e.g., "Active and health-conscious", "Tech-savvy professionals")';
comment on column public.brands.target_interests is 'Array of target audience interests and hobbies';
comment on column public.brands.target_values is 'Array of target audience values (distinct from brand values)';
comment on column public.brands.target_personality_traits is 'Array of target audience personality characteristics';
comment on column public.brands.target_pain_points is 'Array of problems and challenges the brand solves for customers';
comment on column public.brands.target_needs is 'Array of customer needs and desires the brand addresses';

comment on column public.brands.brand_voice is 'Brand voice description (e.g., "Professional and approachable", "Bold and confident")';
comment on column public.brands.brand_tone is 'Brand tone description (e.g., "Confident yet humble", "Friendly and supportive")';
comment on column public.brands.personality_traits is 'Array of brand personality traits and characteristics';
comment on column public.brands.communication_style is 'How the brand communicates (e.g., "Direct and clear", "Conversational and warm")';
comment on column public.brands.brand_archetype is 'Brand archetype (e.g., "The Hero", "The Sage", "The Innovator")';

comment on column public.brands.category is 'Primary product/service category (e.g., "SaaS", "E-commerce", "Healthcare")';
comment on column public.brands.differentiation is 'Core differentiation strategy and unique value proposition';
comment on column public.brands.competitive_advantages is 'Array of specific competitive advantages and strengths';
comment on column public.brands.price_point is 'Market price positioning level (enum: luxury, premium, mid-market, value, budget)';
comment on column public.brands.market_position is 'Overall market position and strategic positioning description';

comment on column public.brands.logo_description is 'Textual description of the logo design, style, and elements';
comment on column public.brands.color_scheme is 'Array of brand colors (preferably hex codes, e.g., ["#FF6B6B", "#4ECDC4"])';
comment on column public.brands.design_principles is 'Array of visual design principles and guidelines';

comment on column public.brands.typography_primary is 'Primary font family name or description for headings and key content';
comment on column public.brands.typography_secondary is 'Secondary font family name or description for body text';
comment on column public.brands.typography_accent is 'Accent font family name or description for special elements (optional)';

comment on column public.brands.imagery_style is 'Visual imagery style description (e.g., "Minimalist", "Bold and colorful", "Documentary style")';
comment on column public.brands.imagery_mood is 'Imagery mood and emotional tone (e.g., "Professional", "Playful", "Aspirational")';
comment on column public.brands.imagery_guidelines is 'Array of specific imagery usage guidelines and requirements';

-- step 4: create performance indexes
-- basic indexes for common query patterns
create index idx_brands_project_id on public.brands (project_id);
create index idx_brands_status on public.brands (status);
create index idx_brands_created_at_desc on public.brands (created_at desc);
create index idx_brands_name on public.brands (name);

-- indexes for new structured columns that will be frequently queried
create index idx_brands_category on public.brands (category);
create index idx_brands_price_point on public.brands (price_point);
create index idx_brands_brand_archetype on public.brands (brand_archetype);

-- gin indexes for array columns to enable efficient array operations and searches
-- these indexes allow for queries like: where 'value' = any(array_column)
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

-- step 5: enable row level security
-- rls is required for all tables in supabase to control data access
alter table public.brands enable row level security;

-- step 6: create rls policies for data access control
-- these policies ensure users can only access brands from their own projects

-- policy for select operations (viewing brands)
-- allows authenticated users to view brands from projects they own
create policy "authenticated_users_can_view_own_project_brands"
  on public.brands
  for select
  to authenticated
  using (
    project_id in (
      select id from public.projects where user_id = auth.uid()
    )
  );

-- policy for insert operations (creating new brands)
-- allows authenticated users to create brands in their own projects
create policy "authenticated_users_can_create_brands_in_own_projects"
  on public.brands
  for insert
  to authenticated
  with check (
    project_id in (
      select id from public.projects where user_id = auth.uid()
    )
  );

-- policy for update operations (modifying existing brands)
-- allows authenticated users to update brands from their own projects
create policy "authenticated_users_can_update_own_project_brands"
  on public.brands
  for update
  to authenticated
  using (
    project_id in (
      select id from public.projects where user_id = auth.uid()
    )
  );

-- policy for delete operations (removing brands)
-- allows authenticated users to delete brands from their own projects
create policy "authenticated_users_can_delete_own_project_brands"
  on public.brands
  for delete
  to authenticated
  using (
    project_id in (
      select id from public.projects where user_id = auth.uid()
    )
  );

-- step 7: create trigger for automatic updated_at timestamp
-- this trigger automatically updates the updated_at column when a row is modified
create trigger trigger_brands_updated_at
  before update on public.brands
  for each row
  execute function public.handle_updated_at();

-- migration completed successfully
-- the brands table now uses fully structured data instead of jsonb columns 