-- =====================================================
-- Migration Guide: Enhanced JSONB Product Model
-- =====================================================
-- This guide helps migrate from your current structure to the Enhanced JSONB approach
-- Run these migrations in order after implementing the new schema files
-- =====================================================

-- Step 1: Backup existing data
-- =====================================================
-- IMPORTANT: Always backup your data before running migrations!

-- create table backup_products as select * from public.products;
-- create table backup_product_variants as select * from public.product_variants;
-- create table backup_product_attributes as select * from public.product_attributes;

-- Step 2: Update existing products table
-- =====================================================

-- Add new columns to products table
alter table public.products 
add column if not exists base_attributes jsonb default '{}',
add column if not exists variant_count integer default 0,
add column if not exists active_variant_count integer default 0;

-- Update column comments
comment on column public.products.specifications is 'JSONB: Static product specs (dimensions, materials, features) that don''t vary by SKU';
comment on column public.products.base_attributes is 'JSONB: Default attribute values that all variants inherit (can be overridden)';
comment on column public.products.variant_count is 'Total number of variants (auto-calculated)';
comment on column public.products.active_variant_count is 'Number of active/orderable variants (auto-calculated)';

-- Migrate existing attributes to base_attributes
update public.products 
set base_attributes = coalesce(attributes, '{}')
where base_attributes = '{}';

-- Drop old attributes column (after confirming migration)
-- alter table public.products drop column if exists attributes;
-- alter table public.products drop column if exists total_inventory;

-- Step 3: Update existing product_variants table
-- =====================================================

-- Add new columns to product_variants table
alter table public.product_variants 
add column if not exists compare_at_price decimal(10,2),
add column if not exists cost_per_item decimal(10,2),
add column if not exists inventory_count integer default 0,
add column if not exists inventory_policy text default 'deny' check (inventory_policy in ('deny', 'continue')),
add column if not exists inventory_tracked boolean default true,
add column if not exists is_active boolean default true,
add column if not exists weight decimal(8,3),
add column if not exists weight_unit text default 'kg' check (weight_unit in ('kg', 'lb', 'g', 'oz'));

-- Migrate orderable to is_active
update public.product_variants 
set is_active = orderable
where is_active is null;

-- Update existing variants to have proper attributes structure
-- This assumes your current attributes are already in JSONB format
-- Adjust based on your current data structure

-- Drop old orderable column (after confirming migration)
-- alter table public.product_variants drop column if exists orderable;

-- Step 4: Create new indexes for Enhanced JSONB approach
-- =====================================================

-- Products table indexes
create index if not exists idx_products_base_attributes_gin on public.products using gin (base_attributes);
create index if not exists idx_products_variant_count on public.products (variant_count);
create index if not exists idx_products_active_variant_count on public.products (active_variant_count);
create index if not exists idx_products_catalog_active_variants on public.products (catalog_id, active_variant_count) where active_variant_count > 0;

-- Product variants table indexes
create index if not exists idx_product_variants_is_active on public.product_variants(is_active);
create index if not exists idx_product_variants_inventory_count on public.product_variants(inventory_count);
create index if not exists idx_product_variants_product_active on public.product_variants(product_id, is_active);
create index if not exists idx_product_variants_product_status on public.product_variants(product_id, status);

-- Step 5: Migrate existing product_attributes to product_attribute_schemas
-- =====================================================

-- Note: This assumes you want to convert your existing product_attributes
-- to the new schema-based approach. Adjust based on your data.

insert into public.product_attribute_schemas (
  product_id,
  attribute_key,
  attribute_label,
  attribute_type,
  options,
  is_required,
  is_variant_defining,
  sort_order,
  created_at
)
select 
  pa.product_id,
  pa.attribute_id as attribute_key,
  pa.attribute_label,
  'select' as attribute_type,  -- Adjust based on your needs
  pa.options,
  pa.is_required,
  true as is_variant_defining,  -- Adjust based on your needs
  pa.sort_order,
  pa.created_at
from public.product_attributes pa
where not exists (
  select 1 from public.product_attribute_schemas pas
  where pas.product_id = pa.product_id 
  and pas.attribute_key = pa.attribute_id
);

-- Step 6: Update calculated fields
-- =====================================================

-- Update variant counts and pricing for all products
update public.products 
set 
  variant_count = (
    select count(*) 
    from public.product_variants v 
    where v.product_id = products.id
  ),
  active_variant_count = (
    select count(*) 
    from public.product_variants v 
    where v.product_id = products.id and v.is_active = true
  ),
  min_price = (
    select min(price) 
    from public.product_variants v 
    where v.product_id = products.id and v.is_active = true
  ),
  max_price = (
    select max(price) 
    from public.product_variants v 
    where v.product_id = products.id and v.is_active = true
  );

-- Step 7: Update RLS policies for new structure
-- =====================================================

-- Drop old policies that reference the old table structure
-- drop policy if exists "Users can view attributes from their own products" on public.product_attributes;
-- drop policy if exists "Users can insert attributes into their own products" on public.product_attributes;
-- drop policy if exists "Users can update attributes from their own products" on public.product_attributes;
-- drop policy if exists "Users can delete attributes from their own products" on public.product_attributes;

-- The new policies are already created in the schema files

-- Step 8: Clean up old structure (OPTIONAL - after confirming everything works)
-- =====================================================

-- Drop old table and unused columns
-- drop table if exists public.product_attributes;
-- alter table public.products drop column if exists attributes;
-- alter table public.products drop column if exists total_inventory;
-- alter table public.product_variants drop column if exists orderable;

-- Step 9: Data validation queries
-- =====================================================

-- Verify migration was successful
select 
  'Products' as table_name,
  count(*) as total_rows,
  count(*) filter (where base_attributes != '{}') as with_base_attributes,
  count(*) filter (where variant_count > 0) as with_variants
from public.products

union all

select 
  'Product Variants' as table_name,
  count(*) as total_rows,
  count(*) filter (where attributes != '{}') as with_attributes,
  count(*) filter (where is_active = true) as active_variants
from public.product_variants

union all

select 
  'Attribute Schemas' as table_name,
  count(*) as total_rows,
  count(distinct product_id) as products_with_schemas,
  count(*) filter (where is_variant_defining = true) as variant_defining_attrs
from public.product_attribute_schemas;

-- Check for any data inconsistencies
select 
  p.id,
  p.name,
  p.variant_count,
  (select count(*) from public.product_variants v where v.product_id = p.id) as actual_variant_count,
  p.active_variant_count,
  (select count(*) from public.product_variants v where v.product_id = p.id and v.is_active = true) as actual_active_count
from public.products p
where p.variant_count != (select count(*) from public.product_variants v where v.product_id = p.id)
   or p.active_variant_count != (select count(*) from public.product_variants v where v.product_id = p.id and v.is_active = true);

-- =====================================================
-- Post-Migration Best Practices
-- =====================================================

-- 1. Always validate attributes before inserting variants:
-- select public.validate_attribute_values(product_id, attributes_jsonb);

-- 2. Use the utility functions for common operations:
-- select public.get_product_attribute_schema(product_id);
-- select public.get_effective_attributes(product_id, variant_attributes);
-- select public.get_variant_display_name(variant_id, include_product_name);

-- 3. For performance, use appropriate indexes:
-- - GIN indexes on JSONB columns for attribute searches
-- - Composite indexes for common query patterns
-- - Partial indexes for filtered queries

-- 4. Regular maintenance:
-- - Monitor JSONB query performance
-- - Keep attribute schemas up to date
-- - Validate data integrity periodically

-- Example maintenance query to find orphaned data:
select 'Variants without valid product' as issue, count(*)
from public.product_variants v
left join public.products p on v.product_id = p.id
where p.id is null

union all

select 'Attribute schemas without valid product' as issue, count(*)
from public.product_attribute_schemas s
left join public.products p on s.product_id = p.id
where p.id is null; 