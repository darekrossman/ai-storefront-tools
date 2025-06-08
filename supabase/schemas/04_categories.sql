-- =====================================================
-- Categories Table Schema
-- =====================================================
-- Purpose: Product categories for organizing products within brands
-- Dependencies: Requires public.brands table
-- RLS: User can only access categories from their own brands
-- Design: Categories belong to brands and can be used across multiple catalogs
-- =====================================================

-- Create categories table
create table public.categories (
  id bigint generated always as identity primary key,
  brand_id bigint not null references public.brands (id) on delete cascade,
  name text not null,
  description text not null,
  slug text not null,
  parent_category_id bigint references public.categories (id) on delete set null,
  sort_order integer not null default 0,
  metadata jsonb default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.categories is 'Product categories for organizing products within brands. Supports hierarchical structure with parent-child relationships.';

-- Add column comments for clarity
comment on column public.categories.parent_category_id is 'Self-referencing foreign key for hierarchical categories (subcategories)';
comment on column public.categories.sort_order is 'Display order for categories within the same level';
comment on column public.categories.metadata is 'JSONB: Additional category metadata like images, colors, SEO data';
comment on column public.categories.slug is 'URL-friendly identifier for the category within the brand';

-- Add indexes for performance
create index idx_categories_brand_id on public.categories (brand_id);
create index idx_categories_parent_id on public.categories (parent_category_id);
create index idx_categories_slug on public.categories (slug);
create index idx_categories_name on public.categories (name);
create index idx_categories_sort_order on public.categories (sort_order);
create index idx_categories_is_active on public.categories (is_active);
create index idx_categories_created_at_desc on public.categories (created_at desc);

-- GIN index for efficient JSONB queries
create index idx_categories_metadata_gin on public.categories using gin (metadata);

-- Ensure unique slug per brand
create unique index idx_categories_brand_slug_unique on public.categories (brand_id, slug);

-- Ensure unique name per brand per parent level
create unique index idx_categories_brand_parent_name_unique on public.categories (brand_id, parent_category_id, name);

-- Enable Row Level Security
alter table public.categories enable row level security;

-- RLS Policy: Users can view categories from their own brands
create policy "Users can view categories from their own brands"
  on public.categories
  for select
  to authenticated
  using (
    brand_id in (
      select brands.id 
      from public.brands 
      join public.projects on brands.project_id = projects.id 
      where projects.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can insert categories into their own brands
create policy "Users can insert categories into their own brands"
  on public.categories
  for insert
  to authenticated
  with check (
    brand_id in (
      select brands.id 
      from public.brands 
      join public.projects on brands.project_id = projects.id 
      where projects.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update categories from their own brands
create policy "Users can update categories from their own brands"
  on public.categories
  for update
  to authenticated
  using (
    brand_id in (
      select brands.id 
      from public.brands 
      join public.projects on brands.project_id = projects.id 
      where projects.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can delete categories from their own brands
create policy "Users can delete categories from their own brands"
  on public.categories
  for delete
  to authenticated
  using (
    brand_id in (
      select brands.id 
      from public.brands 
      join public.projects on brands.project_id = projects.id 
      where projects.user_id = auth.uid()
    )
  );

-- Trigger to automatically update updated_at on categories
create trigger trigger_categories_updated_at
  before update on public.categories
  for each row
  execute function public.handle_updated_at(); 