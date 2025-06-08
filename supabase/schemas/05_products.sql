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
  primary_category_id bigint not null references public.categories (id) on delete restrict,
  subcategory_id bigint references public.categories (id) on delete set null,
  name text not null,
  description text not null,
  short_description text not null,
  tags text[] default '{}',
  -- JSONB columns that align with Zod schemas
  specifications jsonb not null default '{}',
  pricing jsonb not null default '{}',
  inventory jsonb not null default '{}',
  marketing jsonb not null default '{}',
  relations jsonb default '{}',
  status public.brand_status not null default 'draft',
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.products is 'Individual products with complete specifications, pricing, inventory, and marketing data. JSONB columns align with ProductSchema from lib/schemas.ts.';

-- Add column comments for clarity
comment on column public.products.specifications is 'JSONB: Product specifications including dimensions, materials, colors, features (ProductSpecificationsSchema)';
comment on column public.products.pricing is 'JSONB: Pricing structure including base price, currency, variants, margins (ProductPricingSchema)';
comment on column public.products.inventory is 'JSONB: Inventory management including SKU, barcode, stock levels, variants (ProductInventorySchema)';
comment on column public.products.marketing is 'JSONB: Marketing data including SEO, copy, headlines, benefits (ProductMarketingSchema)';
comment on column public.products.relations is 'JSONB: Product relationships including related, cross-sells, up-sells, bundles (ProductRelationsSchema)';
comment on column public.products.subcategory_id is 'Optional subcategory, must be a child of primary_category_id';
comment on column public.products.sort_order is 'Display order for products within the catalog';
comment on column public.products.is_featured is 'Whether this product is featured in the catalog';

-- Add indexes for performance
create index idx_products_catalog_id on public.products (catalog_id);
create index idx_products_primary_category_id on public.products (primary_category_id);
create index idx_products_subcategory_id on public.products (subcategory_id);
create index idx_products_status on public.products (status);
create index idx_products_name on public.products (name);
create index idx_products_sort_order on public.products (sort_order);
create index idx_products_is_featured on public.products (is_featured);
create index idx_products_created_at_desc on public.products (created_at desc);

-- GIN indexes for efficient JSONB queries
create index idx_products_specifications_gin on public.products using gin (specifications);
create index idx_products_pricing_gin on public.products using gin (pricing);
create index idx_products_inventory_gin on public.products using gin (inventory);
create index idx_products_marketing_gin on public.products using gin (marketing);
create index idx_products_relations_gin on public.products using gin (relations);

-- GIN index for tags array
create index idx_products_tags_gin on public.products using gin (tags);

-- Composite indexes for common queries
create index idx_products_catalog_status on public.products (catalog_id, status);
create index idx_products_category_featured on public.products (primary_category_id, is_featured);

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
  -- Check primary category belongs to same catalog
  if not exists (
    select 1 from public.categories 
    where id = new.primary_category_id 
    and catalog_id = new.catalog_id
  ) then
    raise exception 'Primary category must belong to the same catalog as the product';
  end if;
  
  -- Check subcategory belongs to same catalog (if specified)
  if new.subcategory_id is not null and not exists (
    select 1 from public.categories 
    where id = new.subcategory_id 
    and catalog_id = new.catalog_id
  ) then
    raise exception 'Subcategory must belong to the same catalog as the product';
  end if;
  
  return new;
end;
$$ language plpgsql;

-- Trigger to validate product categories
create trigger trigger_validate_product_categories
  before insert or update on public.products
  for each row
  execute function public.validate_product_categories(); 