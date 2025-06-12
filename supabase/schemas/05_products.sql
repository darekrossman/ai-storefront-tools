-- =====================================================
-- Products Table Schema (Enhanced JSONB Approach)
-- =====================================================
-- Purpose: Master products with shared specifications and base attributes
-- Dependencies: Requires public.product_catalogs and public.categories tables
-- RLS: User can only access products from their own catalogs/brands
-- Architecture: JSONB-first for performance with structured attribute validation
-- =====================================================

-- Create products table
create table public.products (
  id bigint generated always as identity primary key,
  catalog_id text not null references public.product_catalogs (catalog_id) on delete cascade,
  parent_category_id text references public.categories (category_id) on delete set null,
  name text not null,
  description text not null,
  short_description text not null,
  tags text[] default '{}',
  
  -- Static product specifications (dimensions, materials, features)
  specifications jsonb not null default '{}',
  
  -- Base attributes that apply to all variants (can be overridden)
  base_attributes jsonb not null default '{}',
  
  -- SEO and marketing
  meta_title text,
  meta_description text,
  
  -- Calculated fields (auto-updated by triggers)
  min_price decimal(10,2),
  max_price decimal(10,2),
  variant_count integer default 0,
  active_variant_count integer default 0,
  
  -- Status and ordering
  status public.brand_status not null default 'draft',
  sort_order integer not null default 0,
  
  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.products is 'Master products with shared specifications and base attributes. Variants inherit and override these attributes.';

-- Add column comments for clarity
comment on column public.products.parent_category_id is 'Parent category assignment';
comment on column public.products.specifications is 'JSONB: Static product specs (dimensions, materials, features) that don''t vary by SKU';
comment on column public.products.base_attributes is 'JSONB: Default attribute values that all variants inherit (can be overridden)';
comment on column public.products.short_description is 'Brief product description for listings and previews';
comment on column public.products.min_price is 'Minimum price across all active variants (auto-calculated)';
comment on column public.products.max_price is 'Maximum price across all active variants (auto-calculated)';
comment on column public.products.variant_count is 'Total number of variants (auto-calculated)';
comment on column public.products.active_variant_count is 'Number of active/orderable variants (auto-calculated)';
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
create index idx_products_variant_count on public.products (variant_count);
create index idx_products_active_variant_count on public.products (active_variant_count);

-- GIN indexes for efficient JSONB queries
create index idx_products_specifications_gin on public.products using gin (specifications);
create index idx_products_base_attributes_gin on public.products using gin (base_attributes);

-- GIN index for tags array
create index idx_products_tags_gin on public.products using gin (tags);

-- Composite indexes for common queries
create index idx_products_catalog_status on public.products (catalog_id, status);
create index idx_products_catalog_active_variants on public.products (catalog_id, active_variant_count) where active_variant_count > 0;

-- Enable Row Level Security
alter table public.products enable row level security;

-- RLS Policy: Users can view products from their own catalogs
create policy "Users can view products from their own catalogs"
  on public.products
  for select
  to authenticated
  using (
    catalog_id in (
      select product_catalogs.catalog_id 
      from public.product_catalogs 
      join public.brands on product_catalogs.brand_id = brands.id
      where brands.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can insert products into their own catalogs
create policy "Users can insert products into their own catalogs"
  on public.products
  for insert
  to authenticated
  with check (
    catalog_id in (
      select product_catalogs.catalog_id 
      from public.product_catalogs 
      join public.brands on product_catalogs.brand_id = brands.id
      where brands.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update products from their own catalogs
create policy "Users can update products from their own catalogs"
  on public.products
  for update
  to authenticated
  using (
    catalog_id in (
      select product_catalogs.catalog_id 
      from public.product_catalogs 
      join public.brands on product_catalogs.brand_id = brands.id
      where brands.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can delete products from their own catalogs
create policy "Users can delete products from their own catalogs"
  on public.products
  for delete
  to authenticated
  using (
    catalog_id in (
      select product_catalogs.catalog_id 
      from public.product_catalogs 
      join public.brands on product_catalogs.brand_id = brands.id
      where brands.user_id = auth.uid()
    )
  );

-- Function to update product variant counts and pricing
create or replace function public.update_product_aggregates()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update public.products 
    set 
      variant_count = (
        select count(*) 
        from public.product_variants 
        where product_id = new.product_id
      ),
      active_variant_count = (
        select count(*) 
        from public.product_variants 
        where product_id = new.product_id and is_active = true
      ),
      min_price = (
        select min(price) 
        from public.product_variants 
        where product_id = new.product_id and is_active = true
      ),
      max_price = (
        select max(price) 
        from public.product_variants 
        where product_id = new.product_id and is_active = true
      )
    where id = new.product_id;
    return new;
    
  elsif tg_op = 'DELETE' then
    update public.products 
    set 
      variant_count = (
        select count(*) 
        from public.product_variants 
        where product_id = old.product_id
      ),
      active_variant_count = (
        select count(*) 
        from public.product_variants 
        where product_id = old.product_id and is_active = true
      ),
      min_price = (
        select min(price) 
        from public.product_variants 
        where product_id = old.product_id and is_active = true
      ),
      max_price = (
        select max(price) 
        from public.product_variants 
        where product_id = old.product_id and is_active = true
      )
    where id = old.product_id;
    return old;
    
  elsif tg_op = 'UPDATE' then
    -- Handle product change (shouldn't happen but just in case)
    if old.product_id != new.product_id then
      -- Update old product
      update public.products 
      set 
        variant_count = (
          select count(*) 
          from public.product_variants 
          where product_id = old.product_id
        ),
        active_variant_count = (
          select count(*) 
          from public.product_variants 
          where product_id = old.product_id and is_active = true
        ),
        min_price = (
          select min(price) 
          from public.product_variants 
          where product_id = old.product_id and is_active = true
        ),
        max_price = (
          select max(price) 
          from public.product_variants 
          where product_id = old.product_id and is_active = true
        )
      where id = old.product_id;
    end if;
    
    -- Update new/current product
    update public.products 
    set 
      variant_count = (
        select count(*) 
        from public.product_variants 
        where product_id = new.product_id
      ),
      active_variant_count = (
        select count(*) 
        from public.product_variants 
        where product_id = new.product_id and is_active = true
      ),
      min_price = (
        select min(price) 
        from public.product_variants 
        where product_id = new.product_id and is_active = true
      ),
      max_price = (
        select max(price) 
        from public.product_variants 
        where product_id = new.product_id and is_active = true
      )
    where id = new.product_id;
    return new;
  end if;
  
  return coalesce(new, old);
end;
$$ language plpgsql;

-- Function to update product catalog total_products count
create or replace function public.update_catalog_product_count()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update public.product_catalogs 
    set total_products = total_products + 1 
    where catalog_id = new.catalog_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.product_catalogs 
    set total_products = total_products - 1 
    where catalog_id = old.catalog_id;
    return old;
  elsif tg_op = 'UPDATE' and old.catalog_id != new.catalog_id then
    -- Product moved to different catalog
    update public.product_catalogs 
    set total_products = total_products - 1 
    where catalog_id = old.catalog_id;
    update public.product_catalogs 
    set total_products = total_products + 1 
    where catalog_id = new.catalog_id;
    return new;
  end if;
  return coalesce(new, old);
end;
$$ language plpgsql;

-- Function to validate that product categories belong to the same catalog
create or replace function public.validate_product_categories()
returns trigger as $$
begin
  -- Check parent category belongs to same catalog (if specified)
  if new.parent_category_id is not null and not exists (
    select 1 from public.categories 
    where category_id = new.parent_category_id 
    and catalog_id = new.catalog_id
  ) then
    raise exception 'Parent category must belong to the same catalog as the product';
  end if;
  
  return new;
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

-- Trigger to validate product categories
create trigger trigger_validate_product_categories
  before insert or update on public.products
  for each row
  execute function public.validate_product_categories(); 