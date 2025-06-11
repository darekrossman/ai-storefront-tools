drop trigger if exists "trigger_product_attributes_updated_at" on "public"."product_attributes";

drop policy "Users can delete attributes from their own products" on "public"."product_attributes";

drop policy "Users can insert attributes into their own products" on "public"."product_attributes";

drop policy "Users can update attributes from their own products" on "public"."product_attributes";

drop policy "Users can view attributes from their own products" on "public"."product_attributes";

revoke delete on table "public"."product_attributes" from "anon";

revoke insert on table "public"."product_attributes" from "anon";

revoke references on table "public"."product_attributes" from "anon";

revoke select on table "public"."product_attributes" from "anon";

revoke trigger on table "public"."product_attributes" from "anon";

revoke truncate on table "public"."product_attributes" from "anon";

revoke update on table "public"."product_attributes" from "anon";

revoke delete on table "public"."product_attributes" from "authenticated";

revoke insert on table "public"."product_attributes" from "authenticated";

revoke references on table "public"."product_attributes" from "authenticated";

revoke select on table "public"."product_attributes" from "authenticated";

revoke trigger on table "public"."product_attributes" from "authenticated";

revoke truncate on table "public"."product_attributes" from "authenticated";

revoke update on table "public"."product_attributes" from "authenticated";

revoke delete on table "public"."product_attributes" from "service_role";

revoke insert on table "public"."product_attributes" from "service_role";

revoke references on table "public"."product_attributes" from "service_role";

revoke select on table "public"."product_attributes" from "service_role";

revoke trigger on table "public"."product_attributes" from "service_role";

revoke truncate on table "public"."product_attributes" from "service_role";

revoke update on table "public"."product_attributes" from "service_role";

alter table "public"."product_attributes" drop constraint "product_attributes_product_id_fkey";

alter table "public"."product_attributes" drop constraint "unique_product_attribute";

alter table "public"."product_attributes" drop constraint "product_attributes_pkey";

drop index if exists "public"."idx_product_attributes_attribute_id";

drop index if exists "public"."idx_product_attributes_is_required";

drop index if exists "public"."idx_product_attributes_options_gin";

drop index if exists "public"."idx_product_attributes_product_id";

drop index if exists "public"."idx_product_attributes_sort_order";

drop index if exists "public"."idx_product_variants_orderable";

drop index if exists "public"."idx_products_attributes_gin";

drop index if exists "public"."idx_products_total_inventory";

drop index if exists "public"."product_attributes_pkey";

drop index if exists "public"."unique_product_attribute";

drop table "public"."product_attributes";

create table "public"."product_attribute_schemas" (
    "id" bigint generated always as identity not null,
    "product_id" bigint not null,
    "attribute_key" text not null,
    "attribute_label" text not null,
    "attribute_type" text not null,
    "options" jsonb default '[]'::jsonb,
    "default_value" jsonb,
    "is_required" boolean not null default false,
    "is_variant_defining" boolean not null default true,
    "validation_rules" jsonb default '{}'::jsonb,
    "help_text" text,
    "sort_order" integer not null default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."product_attribute_schemas" enable row level security;

alter table "public"."product_variants" drop column "orderable";

alter table "public"."product_variants" add column "compare_at_price" numeric(10,2);

alter table "public"."product_variants" add column "cost_per_item" numeric(10,2);

alter table "public"."product_variants" add column "inventory_count" integer default 0;

alter table "public"."product_variants" add column "inventory_policy" text default 'deny'::text;

alter table "public"."product_variants" add column "inventory_tracked" boolean default true;

alter table "public"."product_variants" add column "is_active" boolean not null default true;

alter table "public"."product_variants" add column "weight" numeric(8,3);

alter table "public"."product_variants" add column "weight_unit" text default 'kg'::text;

alter table "public"."products" drop column "attributes";

alter table "public"."products" drop column "total_inventory";

alter table "public"."products" add column "active_variant_count" integer default 0;

alter table "public"."products" add column "base_attributes" jsonb not null default '{}'::jsonb;

alter table "public"."products" add column "variant_count" integer default 0;

CREATE INDEX idx_product_attribute_schemas_attribute_key ON public.product_attribute_schemas USING btree (attribute_key);

CREATE INDEX idx_product_attribute_schemas_attribute_type ON public.product_attribute_schemas USING btree (attribute_type);

CREATE INDEX idx_product_attribute_schemas_is_required ON public.product_attribute_schemas USING btree (is_required);

CREATE INDEX idx_product_attribute_schemas_is_variant_defining ON public.product_attribute_schemas USING btree (is_variant_defining);

CREATE INDEX idx_product_attribute_schemas_options_gin ON public.product_attribute_schemas USING gin (options);

CREATE INDEX idx_product_attribute_schemas_product_id ON public.product_attribute_schemas USING btree (product_id);

CREATE INDEX idx_product_attribute_schemas_sort_order ON public.product_attribute_schemas USING btree (sort_order);

CREATE INDEX idx_product_attribute_schemas_validation_rules_gin ON public.product_attribute_schemas USING gin (validation_rules);

CREATE INDEX idx_product_variants_barcode ON public.product_variants USING btree (barcode) WHERE (barcode IS NOT NULL);

CREATE INDEX idx_product_variants_created_at_desc ON public.product_variants USING btree (created_at DESC);

CREATE INDEX idx_product_variants_inventory_count ON public.product_variants USING btree (inventory_count);

CREATE INDEX idx_product_variants_is_active ON public.product_variants USING btree (is_active);

CREATE INDEX idx_product_variants_product_active ON public.product_variants USING btree (product_id, is_active);

CREATE INDEX idx_product_variants_product_status ON public.product_variants USING btree (product_id, status);

CREATE INDEX idx_products_active_variant_count ON public.products USING btree (active_variant_count);

CREATE INDEX idx_products_base_attributes_gin ON public.products USING gin (base_attributes);

CREATE INDEX idx_products_catalog_active_variants ON public.products USING btree (catalog_id, active_variant_count) WHERE (active_variant_count > 0);

CREATE INDEX idx_products_variant_count ON public.products USING btree (variant_count);

CREATE UNIQUE INDEX product_attribute_schemas_pkey ON public.product_attribute_schemas USING btree (id);

CREATE UNIQUE INDEX unique_product_attribute ON public.product_attribute_schemas USING btree (product_id, attribute_key);

alter table "public"."product_attribute_schemas" add constraint "product_attribute_schemas_pkey" PRIMARY KEY using index "product_attribute_schemas_pkey";

alter table "public"."product_attribute_schemas" add constraint "product_attribute_schemas_attribute_type_check" CHECK ((attribute_type = ANY (ARRAY['select'::text, 'text'::text, 'number'::text, 'boolean'::text, 'color'::text, 'url'::text, 'email'::text]))) not valid;

alter table "public"."product_attribute_schemas" validate constraint "product_attribute_schemas_attribute_type_check";

alter table "public"."product_attribute_schemas" add constraint "product_attribute_schemas_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE not valid;

alter table "public"."product_attribute_schemas" validate constraint "product_attribute_schemas_product_id_fkey";

alter table "public"."product_attribute_schemas" add constraint "unique_product_attribute" UNIQUE using index "unique_product_attribute";

alter table "public"."product_variants" add constraint "product_variants_inventory_policy_check" CHECK ((inventory_policy = ANY (ARRAY['deny'::text, 'continue'::text]))) not valid;

alter table "public"."product_variants" validate constraint "product_variants_inventory_policy_check";

alter table "public"."product_variants" add constraint "product_variants_weight_unit_check" CHECK ((weight_unit = ANY (ARRAY['kg'::text, 'lb'::text, 'g'::text, 'oz'::text]))) not valid;

alter table "public"."product_variants" validate constraint "product_variants_weight_unit_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.auto_generate_sku()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_effective_attributes(p_product_id bigint, p_variant_attributes jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_product_attribute_schema(p_product_id bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_variant_display_name(p_variant_id bigint, p_include_product_name boolean DEFAULT false)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.update_product_aggregates()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.validate_attribute_values(p_product_id bigint, p_attribute_values jsonb)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.validate_variant_attributes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  -- Validate attributes against product schemas
  perform public.validate_attribute_values(new.product_id, new.attributes);
  
  -- Ensure variant-defining attributes create unique combinations
  if exists (
    select 1 from public.product_variants v
    join public.product_attribute_schemas s on s.product_id = v.product_id
    where v.product_id = new.product_id 
    and v.id != coalesce(new.id, -1)  -- Exclude self on update
    and s.is_variant_defining = true
    and (v.attributes -> s.attribute_key) = (new.attributes -> s.attribute_key)
    group by v.product_id
    having count(*) = (
      select count(*) from public.product_attribute_schemas 
      where product_id = new.product_id and is_variant_defining = true
    )
  ) then
    raise exception 'A variant with these attribute values already exists for this product';
  end if;
  
  return new;
end;
$function$
;

grant delete on table "public"."product_attribute_schemas" to "anon";

grant insert on table "public"."product_attribute_schemas" to "anon";

grant references on table "public"."product_attribute_schemas" to "anon";

grant select on table "public"."product_attribute_schemas" to "anon";

grant trigger on table "public"."product_attribute_schemas" to "anon";

grant truncate on table "public"."product_attribute_schemas" to "anon";

grant update on table "public"."product_attribute_schemas" to "anon";

grant delete on table "public"."product_attribute_schemas" to "authenticated";

grant insert on table "public"."product_attribute_schemas" to "authenticated";

grant references on table "public"."product_attribute_schemas" to "authenticated";

grant select on table "public"."product_attribute_schemas" to "authenticated";

grant trigger on table "public"."product_attribute_schemas" to "authenticated";

grant truncate on table "public"."product_attribute_schemas" to "authenticated";

grant update on table "public"."product_attribute_schemas" to "authenticated";

grant delete on table "public"."product_attribute_schemas" to "service_role";

grant insert on table "public"."product_attribute_schemas" to "service_role";

grant references on table "public"."product_attribute_schemas" to "service_role";

grant select on table "public"."product_attribute_schemas" to "service_role";

grant trigger on table "public"."product_attribute_schemas" to "service_role";

grant truncate on table "public"."product_attribute_schemas" to "service_role";

grant update on table "public"."product_attribute_schemas" to "service_role";

create policy "Users can delete attribute schemas from their own products"
on "public"."product_attribute_schemas"
as permissive
for delete
to authenticated
using ((product_id IN ( SELECT products.id
   FROM (((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can insert attribute schemas into their own products"
on "public"."product_attribute_schemas"
as permissive
for insert
to authenticated
with check ((product_id IN ( SELECT products.id
   FROM (((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can update attribute schemas from their own products"
on "public"."product_attribute_schemas"
as permissive
for update
to authenticated
using ((product_id IN ( SELECT products.id
   FROM (((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can view attribute schemas from their own products"
on "public"."product_attribute_schemas"
as permissive
for select
to authenticated
using ((product_id IN ( SELECT products.id
   FROM (((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


CREATE TRIGGER trigger_product_attribute_schemas_updated_at BEFORE UPDATE ON public.product_attribute_schemas FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_auto_generate_sku BEFORE INSERT ON public.product_variants FOR EACH ROW EXECUTE FUNCTION auto_generate_sku();

CREATE TRIGGER trigger_update_product_aggregates_from_variants AFTER INSERT OR DELETE OR UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION update_product_aggregates();

CREATE TRIGGER trigger_validate_variant_attributes BEFORE INSERT OR UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION validate_variant_attributes();


