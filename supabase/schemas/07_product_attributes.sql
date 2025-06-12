-- =====================================================
-- Product Attribute Schemas Table (Enhanced JSONB Approach)
-- =====================================================
-- Purpose: Defines available attributes, types, and validation rules for products
-- Dependencies: Requires public.products table
-- RLS: User can only access attribute schemas from their own catalogs/brands
-- Architecture: Schema definitions for validating JSONB attribute values
-- =====================================================

-- Create product attribute schemas table
create table public.product_attribute_schemas (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  attribute_key text not null,
  attribute_label text not null,
  attribute_type text not null check (attribute_type in ('select', 'text', 'number', 'boolean', 'color', 'url', 'email')),
  options jsonb default '[]',
  default_value jsonb,
  is_required boolean not null default false,
  is_variant_defining boolean not null default true,
  validation_rules jsonb default '{}',
  help_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_product_attribute unique(product_id, attribute_key)
);

comment on table public.product_attribute_schemas is 'Defines available attributes, their types, and validation rules for products';

-- Add column comments for clarity
comment on column public.product_attribute_schemas.product_id is 'Reference to the master product';
comment on column public.product_attribute_schemas.attribute_key is 'Attribute identifier like "color", "size", "material"';
comment on column public.product_attribute_schemas.attribute_label is 'Human-readable label like "Color", "Size", "Material"';
comment on column public.product_attribute_schemas.attribute_type is 'Data type: select, text, number, boolean, color, url, email';
comment on column public.product_attribute_schemas.options is 'JSONB: Available options for select types like [{"value": "red", "label": "Red", "color": "#ff0000"}]';
comment on column public.product_attribute_schemas.default_value is 'JSONB: Default value for this attribute';
comment on column public.product_attribute_schemas.is_required is 'Whether this attribute is required for all variants';
comment on column public.product_attribute_schemas.is_variant_defining is 'Whether different values create separate SKUs (vs just metadata)';
comment on column public.product_attribute_schemas.validation_rules is 'JSONB: Validation constraints like {"min": 0, "max": 100, "pattern": "^[A-Z]"}';
comment on column public.product_attribute_schemas.help_text is 'Optional help text for attribute input forms';
comment on column public.product_attribute_schemas.sort_order is 'Display order for attribute input interface';

-- Create indexes for performance
create index idx_product_attribute_schemas_product_id on public.product_attribute_schemas(product_id);
create index idx_product_attribute_schemas_attribute_key on public.product_attribute_schemas(attribute_key);
create index idx_product_attribute_schemas_attribute_type on public.product_attribute_schemas(attribute_type);
create index idx_product_attribute_schemas_is_required on public.product_attribute_schemas(is_required);
create index idx_product_attribute_schemas_is_variant_defining on public.product_attribute_schemas(is_variant_defining);
create index idx_product_attribute_schemas_sort_order on public.product_attribute_schemas(sort_order);

-- GIN indexes for efficient JSONB queries
create index idx_product_attribute_schemas_options_gin on public.product_attribute_schemas using gin(options);
create index idx_product_attribute_schemas_validation_rules_gin on public.product_attribute_schemas using gin(validation_rules);

-- Enable Row Level Security
alter table public.product_attribute_schemas enable row level security;

-- RLS Policy: Users can view attribute schemas from their own products
create policy "Users can view attribute schemas from their own products"
  on public.product_attribute_schemas for select
  to authenticated
  using (
    product_id in (
      select products.id from public.products
      join public.product_catalogs on products.catalog_id = product_catalogs.catalog_id
      join public.brands on product_catalogs.brand_id = brands.id
      where brands.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can insert attribute schemas into their own products
create policy "Users can insert attribute schemas into their own products"
  on public.product_attribute_schemas for insert
  to authenticated
  with check (
    product_id in (
      select products.id from public.products
      join public.product_catalogs on products.catalog_id = product_catalogs.catalog_id
      join public.brands on product_catalogs.brand_id = brands.id
      where brands.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update attribute schemas from their own products
create policy "Users can update attribute schemas from their own products"
  on public.product_attribute_schemas for update
  to authenticated
  using (
    product_id in (
      select products.id from public.products
      join public.product_catalogs on products.catalog_id = product_catalogs.catalog_id
      join public.brands on product_catalogs.brand_id = brands.id
      where brands.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can delete attribute schemas from their own products
create policy "Users can delete attribute schemas from their own products"
  on public.product_attribute_schemas for delete
  to authenticated
  using (
    product_id in (
      select products.id from public.products
      join public.product_catalogs on products.catalog_id = product_catalogs.catalog_id
      join public.brands on product_catalogs.brand_id = brands.id
      where brands.user_id = auth.uid()
    )
  );

-- Function to validate attribute values against their schemas
create or replace function public.validate_attribute_values(
  p_product_id bigint,
  p_attribute_values jsonb
) returns boolean as $$
declare
  schema_record record;
  attr_value jsonb;
  attr_text text;
  attr_number decimal;
  validation_rules jsonb;
begin
  -- Get all attribute schemas for this product
  for schema_record in 
    select * from public.product_attribute_schemas 
    where product_id = p_product_id
  loop
    attr_value := p_attribute_values -> schema_record.attribute_key;
    
    -- Check required attributes
    if schema_record.is_required and (attr_value is null or attr_value = 'null'::jsonb) then
      raise exception 'Required attribute "%" is missing', schema_record.attribute_label;
    end if;
    
    -- Skip validation if value is null and not required
    if attr_value is null or attr_value = 'null'::jsonb then
      continue;
    end if;
    
    -- Type-specific validation
    case schema_record.attribute_type
      when 'select' then
        -- Validate against options
        if schema_record.options != '[]'::jsonb and not exists (
          select 1 from jsonb_array_elements(schema_record.options) as option
          where option->>'value' = attr_value#>>'{}'
        ) then
          raise exception 'Invalid option "%" for attribute "%"', attr_value#>>'{}', schema_record.attribute_label;
        end if;
        
      when 'text' then
        attr_text := attr_value#>>'{}';
        validation_rules := schema_record.validation_rules;
        
        -- Check min/max length
        if validation_rules ? 'minLength' and length(attr_text) < (validation_rules->>'minLength')::int then
          raise exception 'Attribute "%" must be at least % characters', schema_record.attribute_label, validation_rules->>'minLength';
        end if;
        if validation_rules ? 'maxLength' and length(attr_text) > (validation_rules->>'maxLength')::int then
          raise exception 'Attribute "%" must be at most % characters', schema_record.attribute_label, validation_rules->>'maxLength';
        end if;
        
        -- Check pattern
        if validation_rules ? 'pattern' and not (attr_text ~ (validation_rules->>'pattern')) then
          raise exception 'Attribute "%" does not match required pattern', schema_record.attribute_label;
        end if;
        
      when 'number' then
        attr_number := (attr_value#>>'{}')::decimal;
        validation_rules := schema_record.validation_rules;
        
        -- Check min/max values
        if validation_rules ? 'min' and attr_number < (validation_rules->>'min')::decimal then
          raise exception 'Attribute "%" must be at least %', schema_record.attribute_label, validation_rules->>'min';
        end if;
        if validation_rules ? 'max' and attr_number > (validation_rules->>'max')::decimal then
          raise exception 'Attribute "%" must be at most %', schema_record.attribute_label, validation_rules->>'max';
        end if;
        
      when 'boolean' then
        -- Ensure it's a valid boolean
        if not (attr_value#>>'{}' in ('true', 'false')) then
          raise exception 'Attribute "%" must be true or false', schema_record.attribute_label;
        end if;
        
      when 'color' then
        attr_text := attr_value#>>'{}';
        -- Validate hex color format
        if not (attr_text ~ '^#[0-9A-Fa-f]{6}$') then
          raise exception 'Attribute "%" must be a valid hex color (e.g., #FF0000)', schema_record.attribute_label;
        end if;
        
      when 'url' then
        attr_text := attr_value#>>'{}';
        -- Basic URL validation
        if not (attr_text ~ '^https?://') then
          raise exception 'Attribute "%" must be a valid URL starting with http:// or https://', schema_record.attribute_label;
        end if;
        
      when 'email' then
        attr_text := attr_value#>>'{}';
        -- Basic email validation
        if not (attr_text ~ '^[^@]+@[^@]+\.[^@]+$') then
          raise exception 'Attribute "%" must be a valid email address', schema_record.attribute_label;
        end if;
    end case;
  end loop;
  
  return true;
end;
$$ language plpgsql;

-- Function to merge base attributes with variant-specific attributes
create or replace function public.get_effective_attributes(
  p_product_id bigint,
  p_variant_attributes jsonb default '{}'::jsonb
) returns jsonb as $$
declare
  base_attrs jsonb;
  result jsonb;
begin
  -- Get base attributes from product
  select base_attributes into base_attrs 
  from public.products 
  where id = p_product_id;
  
  -- Merge base attributes with variant attributes (variant takes precedence)
  result := coalesce(base_attrs, '{}'::jsonb) || coalesce(p_variant_attributes, '{}'::jsonb);
  
  return result;
end;
$$ language plpgsql;

-- Function to get attribute schema for a product
create or replace function public.get_product_attribute_schema(p_product_id bigint)
returns jsonb as $$
declare
  result jsonb := '{}';
  schema_record record;
begin
  for schema_record in 
    select * from public.product_attribute_schemas 
    where product_id = p_product_id 
    order by sort_order, attribute_label
  loop
    result := result || jsonb_build_object(
      schema_record.attribute_key,
      jsonb_build_object(
        'label', schema_record.attribute_label,
        'type', schema_record.attribute_type,
        'options', schema_record.options,
        'defaultValue', schema_record.default_value,
        'required', schema_record.is_required,
        'variantDefining', schema_record.is_variant_defining,
        'validation', schema_record.validation_rules,
        'helpText', schema_record.help_text,
        'sortOrder', schema_record.sort_order
      )
    );
  end loop;
  
  return result;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at on product_attribute_schemas
create trigger trigger_product_attribute_schemas_updated_at
  before update on public.product_attribute_schemas
  for each row execute function public.handle_updated_at(); 