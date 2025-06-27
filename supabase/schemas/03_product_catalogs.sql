-- =====================================================
-- Product Catalogs Table Schema
-- =====================================================
-- Purpose: Container for product catalogs within brands
-- Dependencies: Requires public.brands table
-- RLS: User can only access catalogs from their own brands
-- Alignment: Supports multiple ProductCatalogSchema per brand
-- =====================================================

-- Create product catalogs table
create table public.product_catalogs (
  id bigint generated always as identity primary key,
  catalog_id text not null unique,
  brand_id bigint not null references public.brands (id) on delete cascade,
  name text not null,
  description text,
  slug text not null,
  total_products integer not null default 0,
  total_categories integer not null default 0,
  settings jsonb default '{}',
  status public.brand_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.product_catalogs is 'Product catalogs containing organized collections of products within brands. Each brand can have multiple catalogs for different purposes or audiences.';

-- Add column comments for clarity
comment on column public.product_catalogs.catalog_id is 'Unique text identifier for the catalog';
comment on column public.product_catalogs.total_products is 'Automatically calculated count of products in this catalog';
comment on column public.product_catalogs.total_categories is 'Automatically calculated count of categories in this catalog';
comment on column public.product_catalogs.settings is 'JSONB: Catalog-specific configuration and metadata';
comment on column public.product_catalogs.slug is 'URL-friendly identifier for the catalog within the brand';

-- Add indexes for performance
create index idx_product_catalogs_catalog_id on public.product_catalogs (catalog_id);
create index idx_product_catalogs_brand_id on public.product_catalogs (brand_id);
create index idx_product_catalogs_status on public.product_catalogs (status);
create index idx_product_catalogs_created_at_desc on public.product_catalogs (created_at desc);
create index idx_product_catalogs_name on public.product_catalogs (name);
create index idx_product_catalogs_slug on public.product_catalogs (slug);

-- GIN index for efficient JSONB queries
create index idx_product_catalogs_settings_gin on public.product_catalogs using gin (settings);

-- Ensure unique slug per brand
create unique index idx_product_catalogs_brand_slug_unique on public.product_catalogs (brand_id, slug);

-- Enable Row Level Security
alter table public.product_catalogs enable row level security;

-- RLS Policy: Users can view catalogs from their own brands
create policy "Users can view catalogs from their own brands"
  on public.product_catalogs
  for select
  to authenticated
  using (
    brand_id in (
      select brands.id 
      from public.brands 
      where brands.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can insert catalogs into their own brands
create policy "Users can insert catalogs into their own brands"
  on public.product_catalogs
  for insert
  to authenticated
  with check (
    brand_id in (
      select brands.id 
      from public.brands 
      where brands.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update catalogs from their own brands
create policy "Users can update catalogs from their own brands"
  on public.product_catalogs
  for update
  to authenticated
  using (
    brand_id in (
      select brands.id 
      from public.brands 
      where brands.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can delete catalogs from their own brands
create policy "Users can delete catalogs from their own brands"
  on public.product_catalogs
  for delete
  to authenticated
  using (
    brand_id in (
      select brands.id 
      from public.brands 
      where brands.user_id = auth.uid()
    )
  );

-- Trigger to automatically update updated_at on product_catalogs
create trigger trigger_product_catalogs_updated_at
  before update on public.product_catalogs
  for each row
  execute function public.handle_updated_at(); 