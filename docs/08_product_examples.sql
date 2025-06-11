-- =====================================================
-- Enhanced JSONB Product Model - Usage Examples
-- =====================================================
-- This file demonstrates how to use the Enhanced JSONB approach
-- for modeling products, variants, and attributes with real examples
-- =====================================================

-- Example 1: Create a T-shirt product with color and size variants
-- =====================================================

-- First, create the master product
insert into public.products (
  catalog_id,
  name,
  description,
  short_description,
  specifications,
  base_attributes,
  tags
) values (
  'cat_fashion_2024',
  'Classic Cotton T-Shirt',
  'Premium 100% cotton t-shirt with comfortable fit and durable construction. Perfect for everyday wear.',
  'Premium cotton t-shirt with comfortable fit',
  '{
    "material": "100% Cotton",
    "care_instructions": "Machine wash cold, tumble dry low",
    "origin": "Made in USA",
    "fit": "Regular fit",
    "collar": "Crew neck"
  }'::jsonb,
  '{
    "brand": "YourBrand",
    "collection": "Essentials",
    "season": "All Season"
  }'::jsonb,
  '{"cotton", "casual", "unisex", "essentials"}'
);

-- Get the product ID for attribute schemas
-- (In real usage, you'd capture this from the INSERT result)
-- select currval('products_id_seq') as product_id;

-- Define attribute schemas for the t-shirt
insert into public.product_attribute_schemas (
  product_id,
  attribute_key,
  attribute_label,
  attribute_type,
  options,
  is_required,
  is_variant_defining,
  sort_order
) values 
(
  1, -- Replace with actual product_id
  'color',
  'Color',
  'select',
  '[
    {"value": "black", "label": "Black", "hex": "#000000"},
    {"value": "white", "label": "White", "hex": "#FFFFFF"},
    {"value": "navy", "label": "Navy Blue", "hex": "#001f3f"},
    {"value": "red", "label": "Red", "hex": "#FF4136"},
    {"value": "gray", "label": "Heather Gray", "hex": "#AAAAAA"}
  ]'::jsonb,
  true,
  true,
  1
),
(
  1, -- Replace with actual product_id
  'size',
  'Size',
  'select',
  '[
    {"value": "xs", "label": "Extra Small"},
    {"value": "s", "label": "Small"},
    {"value": "m", "label": "Medium"},
    {"value": "l", "label": "Large"},
    {"value": "xl", "label": "Extra Large"},
    {"value": "xxl", "label": "2X Large"}
  ]'::jsonb,
  true,
  true,
  2
),
(
  1, -- Replace with actual product_id
  'personalization',
  'Personalization Text',
  'text',
  '[]'::jsonb,
  false,
  false,
  3
);

-- Create variants for different color/size combinations
insert into public.product_variants (
  product_id,
  price,
  attributes,
  inventory_count,
  weight,
  weight_unit
) values 
-- Black variants
(1, 24.99, '{"color": "black", "size": "s"}'::jsonb, 50, 0.2, 'kg'),
(1, 24.99, '{"color": "black", "size": "m"}'::jsonb, 75, 0.22, 'kg'),
(1, 24.99, '{"color": "black", "size": "l"}'::jsonb, 60, 0.24, 'kg'),
(1, 24.99, '{"color": "black", "size": "xl"}'::jsonb, 40, 0.26, 'kg'),

-- White variants
(1, 24.99, '{"color": "white", "size": "s"}'::jsonb, 45, 0.2, 'kg'),
(1, 24.99, '{"color": "white", "size": "m"}'::jsonb, 80, 0.22, 'kg'),
(1, 24.99, '{"color": "white", "size": "l"}'::jsonb, 55, 0.24, 'kg'),

-- Navy variants (premium pricing)
(1, 27.99, '{"color": "navy", "size": "m"}'::jsonb, 30, 0.22, 'kg'),
(1, 27.99, '{"color": "navy", "size": "l"}'::jsonb, 25, 0.24, 'kg');

-- =====================================================
-- Example 2: Electronics product with complex attributes
-- =====================================================

insert into public.products (
  catalog_id,
  name,
  description,
  short_description,
  specifications,
  base_attributes
) values (
  'cat_electronics_2024',
  'Wireless Bluetooth Headphones',
  'Premium wireless headphones with active noise cancellation, 30-hour battery life, and studio-quality sound.',
  'Premium wireless headphones with ANC',
  '{
    "driver_size": "40mm",
    "frequency_response": "20Hz - 20kHz",
    "impedance": "32 ohms",
    "battery_life": "30 hours",
    "charging_time": "2 hours",
    "connectivity": ["Bluetooth 5.0", "3.5mm Jack"],
    "features": ["Active Noise Cancellation", "Quick Charge", "Voice Assistant"]
  }'::jsonb,
  '{
    "brand": "TechBrand",
    "warranty": "2 years",
    "category": "Audio"
  }'::jsonb
);

insert into public.product_attribute_schemas (
  product_id,
  attribute_key,
  attribute_label,
  attribute_type,
  options,
  is_required,
  is_variant_defining,
  validation_rules,
  sort_order
) values 
(
  2, -- Replace with actual product_id
  'color',
  'Color',
  'select',
  '[
    {"value": "matte_black", "label": "Matte Black"},
    {"value": "silver", "label": "Silver"},
    {"value": "rose_gold", "label": "Rose Gold"}
  ]'::jsonb,
  true,
  true,
  '{}'::jsonb,
  1
),
(
  2,
  'storage_case',
  'Include Storage Case',
  'boolean',
  '[]'::jsonb,
  false,
  true,
  '{}'::jsonb,
  2
),
(
  2,
  'engraving',
  'Custom Engraving',
  'text',
  '[]'::jsonb,
  false,
  false,
  '{"maxLength": 20, "pattern": "^[a-zA-Z0-9\\s]*$"}'::jsonb,
  3
);

insert into public.product_variants (
  product_id,
  price,
  compare_at_price,
  attributes,
  inventory_count
) values 
(2, 199.99, 249.99, '{"color": "matte_black", "storage_case": false}'::jsonb, 100),
(2, 219.99, 269.99, '{"color": "matte_black", "storage_case": true}'::jsonb, 75),
(2, 199.99, 249.99, '{"color": "silver", "storage_case": false}'::jsonb, 50),
(2, 229.99, 279.99, '{"color": "rose_gold", "storage_case": true}'::jsonb, 25);

-- =====================================================
-- Example Queries: How to work with the Enhanced JSONB model
-- =====================================================

-- Query 1: Get all products with their variant counts and price ranges
select 
  p.id,
  p.name,
  p.variant_count,
  p.active_variant_count,
  p.min_price,
  p.max_price,
  p.specifications->>'material' as material,
  p.base_attributes->>'brand' as brand
from public.products p
where p.status = 'published';

-- Query 2: Get all variants for a product with their effective attributes
select 
  v.id,
  v.sku,
  v.price,
  v.inventory_count,
  v.is_active,
  public.get_effective_attributes(v.product_id, v.attributes) as all_attributes,
  public.get_variant_display_name(v.id, true) as display_name
from public.product_variants v
where v.product_id = 1
order by v.sort_order, v.id;

-- Query 3: Search products by attribute values
select distinct
  p.id,
  p.name,
  v.price,
  v.attributes->>'color' as color,
  v.attributes->>'size' as size
from public.products p
join public.product_variants v on p.id = v.product_id
where v.attributes->>'color' = 'black'
  and v.is_active = true
  and p.status = 'published';

-- Query 4: Get product attribute schema for building forms
select public.get_product_attribute_schema(1) as schema;

-- Query 5: Find products with specific specifications
select 
  p.id,
  p.name,
  p.specifications->>'material' as material,
  p.specifications->>'care_instructions' as care
from public.products p
where p.specifications ? 'material'
  and p.specifications->>'material' ilike '%cotton%';

-- Query 6: Get variants within a price range with specific attributes
select 
  p.name as product_name,
  v.sku,
  v.price,
  v.attributes,
  v.inventory_count
from public.products p
join public.product_variants v on p.id = v.product_id
where v.price between 20 and 30
  and v.attributes ? 'color'
  and v.is_active = true
order by v.price;

-- Query 7: Complex search across multiple attributes
select 
  p.name,
  v.sku,
  v.price,
  v.attributes->>'color' as color,
  v.attributes->>'size' as size,
  case 
    when v.inventory_count > 50 then 'In Stock'
    when v.inventory_count > 0 then 'Low Stock'
    else 'Out of Stock'
  end as stock_status
from public.products p
join public.product_variants v on p.id = v.product_id
join public.product_attribute_schemas s1 on s1.product_id = p.id and s1.attribute_key = 'color'
join public.product_attribute_schemas s2 on s2.product_id = p.id and s2.attribute_key = 'size'
where v.attributes->>'color' in ('black', 'white')
  and v.attributes->>'size' in ('m', 'l')
  and v.is_active = true
  and p.status = 'published'
order by p.name, v.price;

-- =====================================================
-- Example Functions: Useful utilities for working with the model
-- =====================================================

-- Function to get available attribute values for a product
create or replace function public.get_available_attribute_values(
  p_product_id bigint,
  p_attribute_key text
) returns jsonb as $$
declare
  result jsonb := '[]';
  attr_value text;
begin
  for attr_value in
    select distinct v.attributes ->> p_attribute_key
    from public.product_variants v
    where v.product_id = p_product_id
    and v.is_active = true
    and v.attributes ? p_attribute_key
    and v.attributes ->> p_attribute_key is not null
    order by 1
  loop
    result := result || to_jsonb(attr_value);
  end loop;
  
  return result;
end;
$$ language plpgsql;

-- Function to check variant availability by attributes
create or replace function public.check_variant_availability(
  p_product_id bigint,
  p_attributes jsonb
) returns table (
  variant_id bigint,
  sku text,
  price decimal,
  inventory_count integer,
  is_available boolean
) as $$
begin
  return query
  select 
    v.id,
    v.sku,
    v.price,
    v.inventory_count,
    (v.is_active and (not v.inventory_tracked or v.inventory_count > 0 or v.inventory_policy = 'continue')) as is_available
  from public.product_variants v
  where v.product_id = p_product_id
  and v.attributes @> p_attributes;
end;
$$ language plpgsql;

-- Example usage of utility functions:
-- select public.get_available_attribute_values(1, 'color');
-- select * from public.check_variant_availability(1, '{"color": "black", "size": "m"}'::jsonb); 