-- Fix variant validation function to properly check unique combinations
-- Date: 2025-01-13

-- Replace the validate_variant_attributes function with corrected logic
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