-- =====================================================
-- Products Table Schema
-- =====================================================
-- Purpose: Individual products with complete specifications and marketing data
-- Dependencies: Requires public.product_catalogs and public.categories tables
-- RLS: User can only access products from their own catalogs/brands
-- JSONB Structure: Aligns with ProductSchema from lib/schemas.ts
-- =====================================================

-- Create products table
create table public.products (
  id bigint generated always as identity primary key,
  catalog_id bigint not null references public.product_catalogs (id) on delete cascade,
  parent_category_id bigint references public.categories (id) on delete set null,
  name text not null,
  description text not null,
  short_description text not null,
  tags text[] default '{}',
  -- JSONB columns for master product data
  specifications jsonb not null default '{}',
  attributes jsonb default '{}',
  min_price decimal(10,2),
  max_price decimal(10,2),
  total_inventory integer default 0,
  meta_title text,
  meta_description text,
  status public.brand_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.products is 'Master products containing shared information. Variants hold specific SKUs, pricing, and attributes.';

-- Add column comments for clarity
comment on column public.products.parent_category_id is 'Parent category assignment';
comment on column public.products.specifications is 'JSONB: Product specifications including dimensions, materials, colors, features';
comment on column public.products.short_description is 'Brief product description for listings and previews';
comment on column public.products.attributes is 'JSONB: General product attributes that apply to all variants';
comment on column public.products.min_price is 'Minimum price across all variants (auto-calculated)';
comment on column public.products.max_price is 'Maximum price across all variants (auto-calculated)';
comment on column public.products.total_inventory is 'Total count of orderable variants (auto-calculated)';
comment on column public.products.meta_title is 'SEO meta title';
comment on column public.products.meta_description is 'SEO meta description';
comment on column public.products.sort_order is 'Display order for products within the catalog';

-- Add indexes for performance
create index idx_products_catalog_id on public.products (catalog_id);
create index idx_products_parent_category_id on public.products (parent_category_id);
create index idx_products_status on public.products (status);
create index idx_products_name on public.products (name);
create index idx_products_sort_order on public.products (sort_order);
create index idx_products_created_at_desc on public.products (created_at desc);
create index idx_products_min_price on public.products (min_price);
create index idx_products_max_price on public.products (max_price);
create index idx_products_total_inventory on public.products (total_inventory);

-- GIN indexes for efficient JSONB queries
create index idx_products_specifications_gin on public.products using gin (specifications);
create index idx_products_attributes_gin on public.products using gin (attributes);

-- GIN index for tags array
create index idx_products_tags_gin on public.products using gin (tags);

-- Composite indexes for common queries
create index idx_products_catalog_status on public.products (catalog_id, status);

-- Enable Row Level Security
alter table public.products enable row level security;

-- RLS Policy: Users can view products from their own catalogs
create policy "Users can view products from their own catalogs"
  on public.products
  for select
  to authenticated
  using (
    catalog_id in (
      select product_catalogs.id 
      from public.product_catalogs 
      join public.brands on product_catalogs.brand_id = brands.id
      join public.projects on brands.project_id = projects.id 
      where projects.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can insert products into their own catalogs
create policy "Users can insert products into their own catalogs"
  on public.products
  for insert
  to authenticated
  with check (
    catalog_id in (
      select product_catalogs.id 
      from public.product_catalogs 
      join public.brands on product_catalogs.brand_id = brands.id
      join public.projects on brands.project_id = projects.id 
      where projects.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update products from their own catalogs
create policy "Users can update products from their own catalogs"
  on public.products
  for update
  to authenticated
  using (
    catalog_id in (
      select product_catalogs.id 
      from public.product_catalogs 
      join public.brands on product_catalogs.brand_id = brands.id
      join public.projects on brands.project_id = projects.id 
      where projects.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can delete products from their own catalogs
create policy "Users can delete products from their own catalogs"
  on public.products
  for delete
  to authenticated
  using (
    catalog_id in (
      select product_catalogs.id 
      from public.product_catalogs 
      join public.brands on product_catalogs.brand_id = brands.id
      join public.projects on brands.project_id = projects.id 
      where projects.user_id = auth.uid()
    )
  );

-- Function to update product catalog total_products count
create or replace function public.update_catalog_product_count()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update public.product_catalogs 
    set total_products = total_products + 1 
    where id = new.catalog_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.product_catalogs 
    set total_products = total_products - 1 
    where id = old.catalog_id;
    return old;
  elsif tg_op = 'UPDATE' and old.catalog_id != new.catalog_id then
    -- Product moved to different catalog
    update public.product_catalogs 
    set total_products = total_products - 1 
    where id = old.catalog_id;
    update public.product_catalogs 
    set total_products = total_products + 1 
    where id = new.catalog_id;
    return new;
  end if;
  return coalesce(new, old);
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at on products
create trigger trigger_products_updated_at
  before update on public.products
  for each row
  execute function public.handle_updated_at();

-- Trigger to maintain product count in catalogs
create trigger trigger_update_catalog_product_count
  after insert or update or delete on public.products
  for each row
  execute function public.update_catalog_product_count();

-- Function to validate that product categories belong to the same catalog
create or replace function public.validate_product_categories()
returns trigger as $$
begin
  -- Check parent category belongs to same catalog (if specified)
  if new.parent_category_id is not null and not exists (
    select 1 from public.categories 
    where id = new.parent_category_id 
    and catalog_id = new.catalog_id
  ) then
    raise exception 'Parent category must belong to the same catalog as the product';
  end if;
  
  return new;
end;
$$ language plpgsql;

-- Trigger to validate product categories
create trigger trigger_validate_product_categories
  before insert or update on public.products
  for each row
  execute function public.validate_product_categories(); 