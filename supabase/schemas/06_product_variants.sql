-- =====================================================
-- Product Variants Table (Enhanced JSONB Approach)
-- =====================================================
-- Purpose: Purchasable product variants with validated attributes, pricing, and SKUs
-- Dependencies: Requires public.products and public.product_attribute_schemas tables
-- RLS: User can only access variants from their own catalogs/brands
-- Architecture: JSONB attributes validated against schemas for performance and flexibility
-- =====================================================

-- Create product variants table
create table public.product_variants (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  sku text not null unique,
  barcode text,
  price decimal(10,2) not null,
  compare_at_price decimal(10,2),
  cost_per_item decimal(10,2),
  
  -- JSONB attributes validated against product_attribute_schemas
  attributes jsonb not null default '{}',
  
  -- Inventory and availability
  inventory_count integer default 0,
  inventory_policy text default 'deny' check (inventory_policy in ('deny', 'continue')),
  inventory_tracked boolean default true,
  is_active boolean not null default true,
  
  -- Physical properties (optional)
  weight decimal(8,3),
  weight_unit text default 'kg' check (weight_unit in ('kg', 'lb', 'g', 'oz')),
  
  -- Status and ordering
  status public.brand_status not null default 'draft',
  sort_order integer not null default 0,
  
  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.product_variants is 'Purchasable product variants with validated attributes, pricing, and inventory management';

-- Add column comments for clarity
comment on column public.product_variants.product_id is 'Reference to the master product';
comment on column public.product_variants.sku is 'Unique Stock Keeping Unit for this variant';
comment on column public.product_variants.barcode is 'Optional barcode (UPC, EAN, etc.)';
comment on column public.product_variants.price is 'Selling price for this variant';
comment on column public.product_variants.compare_at_price is 'Original/compare price for showing discounts';
comment on column public.product_variants.cost_per_item is 'Cost basis for profit calculations';
comment on column public.product_variants.attributes is 'JSONB: Validated attributes like {"color": "red", "size": "large"}';
comment on column public.product_variants.inventory_count is 'Current inventory count';
comment on column public.product_variants.inventory_policy is 'What to do when inventory is 0: deny sales or continue';
comment on column public.product_variants.inventory_tracked is 'Whether to track inventory for this variant';
comment on column public.product_variants.is_active is 'Whether this variant is available for purchase';
comment on column public.product_variants.weight is 'Physical weight of the variant';
comment on column public.product_variants.weight_unit is 'Unit for weight measurement';
comment on column public.product_variants.status is 'Variant status: draft, published, archived';
comment on column public.product_variants.sort_order is 'Display order within product variants';

-- Create indexes for performance
create index idx_product_variants_product_id on public.product_variants(product_id);
create index idx_product_variants_sku on public.product_variants(sku);
create index idx_product_variants_barcode on public.product_variants(barcode) where barcode is not null;
create index idx_product_variants_status on public.product_variants(status);
create index idx_product_variants_is_active on public.product_variants(is_active);
create index idx_product_variants_price on public.product_variants(price);
create index idx_product_variants_inventory_count on public.product_variants(inventory_count);
create index idx_product_variants_sort_order on public.product_variants(sort_order);
create index idx_product_variants_created_at_desc on public.product_variants(created_at desc);

-- GIN indexes for efficient JSONB queries
create index idx_product_variants_attributes_gin on public.product_variants using gin(attributes);

-- Composite indexes for common queries
create index idx_product_variants_product_active on public.product_variants(product_id, is_active);
create index idx_product_variants_product_status on public.product_variants(product_id, status);

-- Enable Row Level Security
alter table public.product_variants enable row level security;

-- RLS Policy: Users can view variants from their own catalogs
create policy "Users can view variants from their own catalogs"
  on public.product_variants for select
  to authenticated
  using (
    product_id in (
      select products.id from public.products
      join public.product_catalogs on products.catalog_id = product_catalogs.catalog_id
      join public.brands on product_catalogs.brand_id = brands.id
      join public.projects on brands.project_id = projects.id
      where projects.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can insert variants into their own products
create policy "Users can insert variants into their own products"
  on public.product_variants for insert
  to authenticated
  with check (
    product_id in (
      select products.id from public.products
      join public.product_catalogs on products.catalog_id = product_catalogs.catalog_id
      join public.brands on product_catalogs.brand_id = brands.id
      join public.projects on brands.project_id = projects.id
      where projects.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update variants from their own products
create policy "Users can update variants from their own products"
  on public.product_variants for update
  to authenticated
  using (
    product_id in (
      select products.id from public.products
      join public.product_catalogs on products.catalog_id = product_catalogs.catalog_id
      join public.brands on product_catalogs.brand_id = brands.id
      join public.projects on brands.project_id = projects.id
      where projects.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can delete variants from their own products
create policy "Users can delete variants from their own products"
  on public.product_variants for delete
  to authenticated
  using (
    product_id in (
      select products.id from public.products
      join public.product_catalogs on products.catalog_id = product_catalogs.catalog_id
      join public.brands on product_catalogs.brand_id = brands.id
      join public.projects on brands.project_id = projects.id
      where projects.user_id = auth.uid()
    )
  );

-- Function to validate variant attributes before insert/update
create or replace function public.validate_variant_attributes()
returns trigger as $$
declare
  variant_defining_attrs jsonb := '{}';
  existing_variant_id bigint;
begin
  -- Validate attributes against product schemas
  perform public.validate_attribute_values(new.product_id, new.attributes);
  
  -- Build a JSONB object with only variant-defining attributes for comparison
  select jsonb_object_agg(s.attribute_key, new.attributes -> s.attribute_key)
  into variant_defining_attrs
  from public.product_attribute_schemas s
  where s.product_id = new.product_id 
  and s.is_variant_defining = true
  and new.attributes ? s.attribute_key;
  
  -- Check if any existing variant has the same combination of variant-defining attributes
  select v.id into existing_variant_id
  from public.product_variants v
  where v.product_id = new.product_id 
  and v.id != coalesce(new.id, -1)  -- Exclude self on update
  and (
    select jsonb_object_agg(s.attribute_key, v.attributes -> s.attribute_key)
    from public.product_attribute_schemas s
    where s.product_id = new.product_id 
    and s.is_variant_defining = true
    and v.attributes ? s.attribute_key
  ) = variant_defining_attrs
  limit 1;
  
  if existing_variant_id is not null then
    raise exception 'A variant with these attribute values already exists for this product (existing variant ID: %)', existing_variant_id;
  end if;
  
  return new;
end;
$$ language plpgsql;

-- Function to auto-generate SKU if not provided
create or replace function public.auto_generate_sku()
returns trigger as $$
declare
  base_sku text;
  variant_suffix text := '';
  attr_key text;
  attr_value text;
  counter int := 1;
  final_sku text;
begin
  -- Only generate if SKU is not provided
  if new.sku is not null and new.sku != '' then
    return new;
  end if;
  
  -- Get product name for base SKU
  select upper(left(regexp_replace(name, '[^a-zA-Z0-9]', '', 'g'), 10))
  into base_sku
  from public.products 
  where id = new.product_id;
  
  -- Add variant-defining attributes to SKU
  for attr_key, attr_value in 
    select s.attribute_key, new.attributes ->> s.attribute_key
    from public.product_attribute_schemas s
    where s.product_id = new.product_id 
    and s.is_variant_defining = true
    and new.attributes ? s.attribute_key
    order by s.sort_order
  loop
    if attr_value is not null then
      variant_suffix := variant_suffix || '-' || upper(left(regexp_replace(attr_value, '[^a-zA-Z0-9]', '', 'g'), 5));
    end if;
  end loop;
  
  -- Create base SKU
  final_sku := base_sku || variant_suffix;
  
  -- Ensure uniqueness by adding counter if needed
  while exists (select 1 from public.product_variants where sku = final_sku || case when counter = 1 then '' else counter::text end) loop
    counter := counter + 1;
  end loop;
  
  new.sku := final_sku || case when counter = 1 then '' else counter::text end;
  
  return new;
end;
$$ language plpgsql;

-- Function to get variant display name
create or replace function public.get_variant_display_name(
  p_variant_id bigint,
  p_include_product_name boolean default false
) returns text as $$
declare
  product_name text;
  display_parts text[] := '{}';
  attr_record record;
  result text;
begin
  -- Get product name if requested
  if p_include_product_name then
    select p.name into product_name
    from public.products p
    join public.product_variants v on p.id = v.product_id
    where v.id = p_variant_id;
  end if;
  
  -- Get variant-defining attributes for display
  for attr_record in
    select s.attribute_label, v.attributes ->> s.attribute_key as attr_value
    from public.product_variants v
    join public.product_attribute_schemas s on s.product_id = v.product_id
    where v.id = p_variant_id
    and s.is_variant_defining = true
    and v.attributes ? s.attribute_key
    order by s.sort_order
  loop
    if attr_record.attr_value is not null then
      display_parts := display_parts || (attr_record.attribute_label || ': ' || attr_record.attr_value);
    end if;
  end loop;
  
  -- Build result
  result := array_to_string(display_parts, ', ');
  
  if p_include_product_name and product_name is not null then
    if result != '' then
      result := product_name || ' (' || result || ')';
    else
      result := product_name;
    end if;
  end if;
  
  return coalesce(result, 'Variant #' || p_variant_id);
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at on product_variants
create trigger trigger_product_variants_updated_at
  before update on public.product_variants
  for each row execute function public.handle_updated_at();

-- Trigger to validate variant attributes
create trigger trigger_validate_variant_attributes
  before insert or update on public.product_variants
  for each row execute function public.validate_variant_attributes();

-- Trigger to auto-generate SKU
create trigger trigger_auto_generate_sku
  before insert on public.product_variants
  for each row execute function public.auto_generate_sku();

-- Trigger to update product aggregates when variants change
create trigger trigger_update_product_aggregates_from_variants
  after insert or update or delete on public.product_variants
  for each row execute function public.update_product_aggregates(); 