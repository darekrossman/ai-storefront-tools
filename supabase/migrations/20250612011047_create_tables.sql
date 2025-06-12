create type "public"."brand_status" as enum ('draft', 'active', 'inactive', 'archived');

create type "public"."price_point" as enum ('luxury', 'premium', 'mid-market', 'value', 'budget');

create table "public"."brands" (
    "id" bigint generated always as identity not null,
    "user_id" uuid not null,
    "name" text not null,
    "tagline" text,
    "mission" text,
    "vision" text,
    "values" text[] default '{}'::text[],
    "target_age_range" text,
    "target_income" text,
    "target_education" text,
    "target_location" text,
    "target_lifestyle" text,
    "target_interests" text[] default '{}'::text[],
    "target_values" text[] default '{}'::text[],
    "target_personality_traits" text[] default '{}'::text[],
    "target_pain_points" text[] default '{}'::text[],
    "target_needs" text[] default '{}'::text[],
    "brand_voice" text,
    "brand_tone" text,
    "personality_traits" text[] default '{}'::text[],
    "communication_style" text,
    "brand_archetype" text,
    "category" text,
    "differentiation" text,
    "competitive_advantages" text[] default '{}'::text[],
    "price_point" price_point,
    "market_position" text,
    "logo_description" text,
    "logo_url" text,
    "color_scheme" text[] default '{}'::text[],
    "design_principles" text[] default '{}'::text[],
    "typography_primary" text,
    "typography_secondary" text,
    "typography_accent" text,
    "imagery_style" text,
    "imagery_mood" text,
    "imagery_guidelines" text[] default '{}'::text[],
    "status" brand_status not null default 'draft'::brand_status,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."brands" enable row level security;

create table "public"."categories" (
    "id" bigint generated always as identity not null,
    "category_id" text not null,
    "catalog_id" text not null,
    "name" text not null,
    "description" text not null,
    "slug" text not null,
    "parent_category_id" text,
    "sort_order" integer not null default 0,
    "metadata" jsonb default '{}'::jsonb,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."categories" enable row level security;

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

create table "public"."product_catalogs" (
    "id" bigint generated always as identity not null,
    "catalog_id" text not null,
    "brand_id" bigint not null,
    "name" text not null,
    "description" text,
    "slug" text not null,
    "total_products" integer not null default 0,
    "settings" jsonb default '{}'::jsonb,
    "status" brand_status not null default 'draft'::brand_status,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."product_catalogs" enable row level security;

create table "public"."product_images" (
    "id" bigint generated always as identity not null,
    "product_id" bigint not null,
    "url" text not null,
    "alt_text" text,
    "type" text not null default 'gallery'::text,
    "color_id" text,
    "attribute_filters" jsonb default '{}'::jsonb,
    "sort_order" integer not null default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."product_images" enable row level security;

create table "public"."product_variants" (
    "id" bigint generated always as identity not null,
    "product_id" bigint not null,
    "sku" text not null,
    "barcode" text,
    "price" numeric(10,2) not null,
    "compare_at_price" numeric(10,2),
    "cost_per_item" numeric(10,2),
    "attributes" jsonb not null default '{}'::jsonb,
    "inventory_count" integer default 0,
    "inventory_policy" text default 'deny'::text,
    "inventory_tracked" boolean default true,
    "is_active" boolean not null default true,
    "weight" numeric(8,3),
    "weight_unit" text default 'kg'::text,
    "status" brand_status not null default 'draft'::brand_status,
    "sort_order" integer not null default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."product_variants" enable row level security;

create table "public"."products" (
    "id" bigint generated always as identity not null,
    "catalog_id" text not null,
    "parent_category_id" text,
    "name" text not null,
    "description" text not null,
    "short_description" text not null,
    "tags" text[] default '{}'::text[],
    "specifications" jsonb not null default '{}'::jsonb,
    "base_attributes" jsonb not null default '{}'::jsonb,
    "meta_title" text,
    "meta_description" text,
    "min_price" numeric(10,2),
    "max_price" numeric(10,2),
    "variant_count" integer default 0,
    "active_variant_count" integer default 0,
    "status" brand_status not null default 'draft'::brand_status,
    "sort_order" integer not null default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."products" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "updated_at" timestamp with time zone,
    "username" text,
    "full_name" text,
    "avatar_url" text,
    "website" text
);


alter table "public"."profiles" enable row level security;

create table "public"."waitlist" (
    "id" uuid not null default gen_random_uuid(),
    "email" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "source" text default 'homepage'::text,
    "status" text not null default 'active'::text,
    "metadata" jsonb default '{}'::jsonb
);


alter table "public"."waitlist" enable row level security;

CREATE UNIQUE INDEX brands_pkey ON public.brands USING btree (id);

CREATE UNIQUE INDEX categories_category_id_key ON public.categories USING btree (category_id);

CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id);

CREATE INDEX idx_brands_brand_archetype ON public.brands USING btree (brand_archetype);

CREATE INDEX idx_brands_category ON public.brands USING btree (category);

CREATE INDEX idx_brands_color_scheme_gin ON public.brands USING gin (color_scheme);

CREATE INDEX idx_brands_competitive_advantages_gin ON public.brands USING gin (competitive_advantages);

CREATE INDEX idx_brands_created_at_desc ON public.brands USING btree (created_at DESC);

CREATE INDEX idx_brands_design_principles_gin ON public.brands USING gin (design_principles);

CREATE INDEX idx_brands_imagery_guidelines_gin ON public.brands USING gin (imagery_guidelines);

CREATE INDEX idx_brands_name ON public.brands USING btree (name);

CREATE INDEX idx_brands_personality_traits_gin ON public.brands USING gin (personality_traits);

CREATE INDEX idx_brands_price_point ON public.brands USING btree (price_point);

CREATE INDEX idx_brands_status ON public.brands USING btree (status);

CREATE INDEX idx_brands_target_interests_gin ON public.brands USING gin (target_interests);

CREATE INDEX idx_brands_target_needs_gin ON public.brands USING gin (target_needs);

CREATE INDEX idx_brands_target_pain_points_gin ON public.brands USING gin (target_pain_points);

CREATE INDEX idx_brands_target_personality_traits_gin ON public.brands USING gin (target_personality_traits);

CREATE INDEX idx_brands_target_values_gin ON public.brands USING gin (target_values);

CREATE INDEX idx_brands_user_id ON public.brands USING btree (user_id);

CREATE INDEX idx_brands_values_gin ON public.brands USING gin ("values");

CREATE INDEX idx_categories_catalog_id ON public.categories USING btree (catalog_id);

CREATE UNIQUE INDEX idx_categories_catalog_parent_name_unique ON public.categories USING btree (catalog_id, parent_category_id, name);

CREATE UNIQUE INDEX idx_categories_catalog_slug_unique ON public.categories USING btree (catalog_id, slug);

CREATE INDEX idx_categories_category_id ON public.categories USING btree (category_id);

CREATE INDEX idx_categories_created_at_desc ON public.categories USING btree (created_at DESC);

CREATE INDEX idx_categories_is_active ON public.categories USING btree (is_active);

CREATE INDEX idx_categories_metadata_gin ON public.categories USING gin (metadata);

CREATE INDEX idx_categories_name ON public.categories USING btree (name);

CREATE INDEX idx_categories_parent_id ON public.categories USING btree (parent_category_id);

CREATE INDEX idx_categories_slug ON public.categories USING btree (slug);

CREATE INDEX idx_categories_sort_order ON public.categories USING btree (sort_order);

CREATE INDEX idx_product_attribute_schemas_attribute_key ON public.product_attribute_schemas USING btree (attribute_key);

CREATE INDEX idx_product_attribute_schemas_attribute_type ON public.product_attribute_schemas USING btree (attribute_type);

CREATE INDEX idx_product_attribute_schemas_is_required ON public.product_attribute_schemas USING btree (is_required);

CREATE INDEX idx_product_attribute_schemas_is_variant_defining ON public.product_attribute_schemas USING btree (is_variant_defining);

CREATE INDEX idx_product_attribute_schemas_options_gin ON public.product_attribute_schemas USING gin (options);

CREATE INDEX idx_product_attribute_schemas_product_id ON public.product_attribute_schemas USING btree (product_id);

CREATE INDEX idx_product_attribute_schemas_sort_order ON public.product_attribute_schemas USING btree (sort_order);

CREATE INDEX idx_product_attribute_schemas_validation_rules_gin ON public.product_attribute_schemas USING gin (validation_rules);

CREATE INDEX idx_product_catalogs_brand_id ON public.product_catalogs USING btree (brand_id);

CREATE UNIQUE INDEX idx_product_catalogs_brand_slug_unique ON public.product_catalogs USING btree (brand_id, slug);

CREATE INDEX idx_product_catalogs_catalog_id ON public.product_catalogs USING btree (catalog_id);

CREATE INDEX idx_product_catalogs_created_at_desc ON public.product_catalogs USING btree (created_at DESC);

CREATE INDEX idx_product_catalogs_name ON public.product_catalogs USING btree (name);

CREATE INDEX idx_product_catalogs_settings_gin ON public.product_catalogs USING gin (settings);

CREATE INDEX idx_product_catalogs_slug ON public.product_catalogs USING btree (slug);

CREATE INDEX idx_product_catalogs_status ON public.product_catalogs USING btree (status);

CREATE INDEX idx_product_images_attribute_filters_gin ON public.product_images USING gin (attribute_filters);

CREATE INDEX idx_product_images_color_id ON public.product_images USING btree (color_id);

CREATE INDEX idx_product_images_product_id ON public.product_images USING btree (product_id);

CREATE INDEX idx_product_images_sort_order ON public.product_images USING btree (sort_order);

CREATE INDEX idx_product_images_type ON public.product_images USING btree (type);

CREATE INDEX idx_product_variants_attributes_gin ON public.product_variants USING gin (attributes);

CREATE INDEX idx_product_variants_barcode ON public.product_variants USING btree (barcode) WHERE (barcode IS NOT NULL);

CREATE INDEX idx_product_variants_created_at_desc ON public.product_variants USING btree (created_at DESC);

CREATE INDEX idx_product_variants_inventory_count ON public.product_variants USING btree (inventory_count);

CREATE INDEX idx_product_variants_is_active ON public.product_variants USING btree (is_active);

CREATE INDEX idx_product_variants_price ON public.product_variants USING btree (price);

CREATE INDEX idx_product_variants_product_active ON public.product_variants USING btree (product_id, is_active);

CREATE INDEX idx_product_variants_product_id ON public.product_variants USING btree (product_id);

CREATE INDEX idx_product_variants_product_status ON public.product_variants USING btree (product_id, status);

CREATE INDEX idx_product_variants_sku ON public.product_variants USING btree (sku);

CREATE INDEX idx_product_variants_sort_order ON public.product_variants USING btree (sort_order);

CREATE INDEX idx_product_variants_status ON public.product_variants USING btree (status);

CREATE INDEX idx_products_active_variant_count ON public.products USING btree (active_variant_count);

CREATE INDEX idx_products_base_attributes_gin ON public.products USING gin (base_attributes);

CREATE INDEX idx_products_catalog_active_variants ON public.products USING btree (catalog_id, active_variant_count) WHERE (active_variant_count > 0);

CREATE INDEX idx_products_catalog_id ON public.products USING btree (catalog_id);

CREATE INDEX idx_products_catalog_status ON public.products USING btree (catalog_id, status);

CREATE INDEX idx_products_created_at_desc ON public.products USING btree (created_at DESC);

CREATE INDEX idx_products_max_price ON public.products USING btree (max_price);

CREATE INDEX idx_products_min_price ON public.products USING btree (min_price);

CREATE INDEX idx_products_name ON public.products USING btree (name);

CREATE INDEX idx_products_parent_category_id ON public.products USING btree (parent_category_id);

CREATE INDEX idx_products_sort_order ON public.products USING btree (sort_order);

CREATE INDEX idx_products_specifications_gin ON public.products USING gin (specifications);

CREATE INDEX idx_products_status ON public.products USING btree (status);

CREATE INDEX idx_products_tags_gin ON public.products USING gin (tags);

CREATE INDEX idx_products_variant_count ON public.products USING btree (variant_count);

CREATE UNIQUE INDEX product_attribute_schemas_pkey ON public.product_attribute_schemas USING btree (id);

CREATE UNIQUE INDEX product_catalogs_catalog_id_key ON public.product_catalogs USING btree (catalog_id);

CREATE UNIQUE INDEX product_catalogs_pkey ON public.product_catalogs USING btree (id);

CREATE UNIQUE INDEX product_images_pkey ON public.product_images USING btree (id);

CREATE UNIQUE INDEX product_variants_pkey ON public.product_variants USING btree (id);

CREATE UNIQUE INDEX product_variants_sku_key ON public.product_variants USING btree (sku);

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

CREATE UNIQUE INDEX unique_product_attribute ON public.product_attribute_schemas USING btree (product_id, attribute_key);

CREATE INDEX waitlist_created_at_idx ON public.waitlist USING btree (created_at DESC);

CREATE INDEX waitlist_email_idx ON public.waitlist USING btree (email);

CREATE UNIQUE INDEX waitlist_email_key ON public.waitlist USING btree (email);

CREATE UNIQUE INDEX waitlist_pkey ON public.waitlist USING btree (id);

CREATE INDEX waitlist_status_idx ON public.waitlist USING btree (status);

alter table "public"."brands" add constraint "brands_pkey" PRIMARY KEY using index "brands_pkey";

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."product_attribute_schemas" add constraint "product_attribute_schemas_pkey" PRIMARY KEY using index "product_attribute_schemas_pkey";

alter table "public"."product_catalogs" add constraint "product_catalogs_pkey" PRIMARY KEY using index "product_catalogs_pkey";

alter table "public"."product_images" add constraint "product_images_pkey" PRIMARY KEY using index "product_images_pkey";

alter table "public"."product_variants" add constraint "product_variants_pkey" PRIMARY KEY using index "product_variants_pkey";

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."waitlist" add constraint "waitlist_pkey" PRIMARY KEY using index "waitlist_pkey";

alter table "public"."brands" add constraint "brands_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."brands" validate constraint "brands_user_id_fkey";

alter table "public"."categories" add constraint "categories_catalog_id_fkey" FOREIGN KEY (catalog_id) REFERENCES product_catalogs(catalog_id) ON DELETE CASCADE not valid;

alter table "public"."categories" validate constraint "categories_catalog_id_fkey";

alter table "public"."categories" add constraint "categories_category_id_key" UNIQUE using index "categories_category_id_key";

alter table "public"."categories" add constraint "categories_parent_category_id_fkey" FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE SET NULL not valid;

alter table "public"."categories" validate constraint "categories_parent_category_id_fkey";

alter table "public"."product_attribute_schemas" add constraint "product_attribute_schemas_attribute_type_check" CHECK ((attribute_type = ANY (ARRAY['select'::text, 'text'::text, 'number'::text, 'boolean'::text, 'color'::text, 'url'::text, 'email'::text]))) not valid;

alter table "public"."product_attribute_schemas" validate constraint "product_attribute_schemas_attribute_type_check";

alter table "public"."product_attribute_schemas" add constraint "product_attribute_schemas_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE not valid;

alter table "public"."product_attribute_schemas" validate constraint "product_attribute_schemas_product_id_fkey";

alter table "public"."product_attribute_schemas" add constraint "unique_product_attribute" UNIQUE using index "unique_product_attribute";

alter table "public"."product_catalogs" add constraint "product_catalogs_brand_id_fkey" FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE not valid;

alter table "public"."product_catalogs" validate constraint "product_catalogs_brand_id_fkey";

alter table "public"."product_catalogs" add constraint "product_catalogs_catalog_id_key" UNIQUE using index "product_catalogs_catalog_id_key";

alter table "public"."product_images" add constraint "check_image_type" CHECK ((type = ANY (ARRAY['hero'::text, 'gallery'::text, 'thumbnail'::text, 'lifestyle'::text, 'detail'::text, 'variant'::text]))) not valid;

alter table "public"."product_images" validate constraint "check_image_type";

alter table "public"."product_images" add constraint "product_images_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE not valid;

alter table "public"."product_images" validate constraint "product_images_product_id_fkey";

alter table "public"."product_variants" add constraint "product_variants_inventory_policy_check" CHECK ((inventory_policy = ANY (ARRAY['deny'::text, 'continue'::text]))) not valid;

alter table "public"."product_variants" validate constraint "product_variants_inventory_policy_check";

alter table "public"."product_variants" add constraint "product_variants_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE not valid;

alter table "public"."product_variants" validate constraint "product_variants_product_id_fkey";

alter table "public"."product_variants" add constraint "product_variants_sku_key" UNIQUE using index "product_variants_sku_key";

alter table "public"."product_variants" add constraint "product_variants_weight_unit_check" CHECK ((weight_unit = ANY (ARRAY['kg'::text, 'lb'::text, 'g'::text, 'oz'::text]))) not valid;

alter table "public"."product_variants" validate constraint "product_variants_weight_unit_check";

alter table "public"."products" add constraint "products_catalog_id_fkey" FOREIGN KEY (catalog_id) REFERENCES product_catalogs(catalog_id) ON DELETE CASCADE not valid;

alter table "public"."products" validate constraint "products_catalog_id_fkey";

alter table "public"."products" add constraint "products_parent_category_id_fkey" FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE SET NULL not valid;

alter table "public"."products" validate constraint "products_parent_category_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."profiles" add constraint "username_length" CHECK ((char_length(username) >= 3)) not valid;

alter table "public"."profiles" validate constraint "username_length";

alter table "public"."waitlist" add constraint "waitlist_email_key" UNIQUE using index "waitlist_email_key";

alter table "public"."waitlist" add constraint "waitlist_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'notified'::text, 'disabled'::text]))) not valid;

alter table "public"."waitlist" validate constraint "waitlist_status_check";

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

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_catalog_product_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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

CREATE OR REPLACE FUNCTION public.validate_product_categories()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.validate_variant_attributes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

grant delete on table "public"."brands" to "anon";

grant insert on table "public"."brands" to "anon";

grant references on table "public"."brands" to "anon";

grant select on table "public"."brands" to "anon";

grant trigger on table "public"."brands" to "anon";

grant truncate on table "public"."brands" to "anon";

grant update on table "public"."brands" to "anon";

grant delete on table "public"."brands" to "authenticated";

grant insert on table "public"."brands" to "authenticated";

grant references on table "public"."brands" to "authenticated";

grant select on table "public"."brands" to "authenticated";

grant trigger on table "public"."brands" to "authenticated";

grant truncate on table "public"."brands" to "authenticated";

grant update on table "public"."brands" to "authenticated";

grant delete on table "public"."brands" to "service_role";

grant insert on table "public"."brands" to "service_role";

grant references on table "public"."brands" to "service_role";

grant select on table "public"."brands" to "service_role";

grant trigger on table "public"."brands" to "service_role";

grant truncate on table "public"."brands" to "service_role";

grant update on table "public"."brands" to "service_role";

grant delete on table "public"."categories" to "anon";

grant insert on table "public"."categories" to "anon";

grant references on table "public"."categories" to "anon";

grant select on table "public"."categories" to "anon";

grant trigger on table "public"."categories" to "anon";

grant truncate on table "public"."categories" to "anon";

grant update on table "public"."categories" to "anon";

grant delete on table "public"."categories" to "authenticated";

grant insert on table "public"."categories" to "authenticated";

grant references on table "public"."categories" to "authenticated";

grant select on table "public"."categories" to "authenticated";

grant trigger on table "public"."categories" to "authenticated";

grant truncate on table "public"."categories" to "authenticated";

grant update on table "public"."categories" to "authenticated";

grant delete on table "public"."categories" to "service_role";

grant insert on table "public"."categories" to "service_role";

grant references on table "public"."categories" to "service_role";

grant select on table "public"."categories" to "service_role";

grant trigger on table "public"."categories" to "service_role";

grant truncate on table "public"."categories" to "service_role";

grant update on table "public"."categories" to "service_role";

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

grant delete on table "public"."product_catalogs" to "anon";

grant insert on table "public"."product_catalogs" to "anon";

grant references on table "public"."product_catalogs" to "anon";

grant select on table "public"."product_catalogs" to "anon";

grant trigger on table "public"."product_catalogs" to "anon";

grant truncate on table "public"."product_catalogs" to "anon";

grant update on table "public"."product_catalogs" to "anon";

grant delete on table "public"."product_catalogs" to "authenticated";

grant insert on table "public"."product_catalogs" to "authenticated";

grant references on table "public"."product_catalogs" to "authenticated";

grant select on table "public"."product_catalogs" to "authenticated";

grant trigger on table "public"."product_catalogs" to "authenticated";

grant truncate on table "public"."product_catalogs" to "authenticated";

grant update on table "public"."product_catalogs" to "authenticated";

grant delete on table "public"."product_catalogs" to "service_role";

grant insert on table "public"."product_catalogs" to "service_role";

grant references on table "public"."product_catalogs" to "service_role";

grant select on table "public"."product_catalogs" to "service_role";

grant trigger on table "public"."product_catalogs" to "service_role";

grant truncate on table "public"."product_catalogs" to "service_role";

grant update on table "public"."product_catalogs" to "service_role";

grant delete on table "public"."product_images" to "anon";

grant insert on table "public"."product_images" to "anon";

grant references on table "public"."product_images" to "anon";

grant select on table "public"."product_images" to "anon";

grant trigger on table "public"."product_images" to "anon";

grant truncate on table "public"."product_images" to "anon";

grant update on table "public"."product_images" to "anon";

grant delete on table "public"."product_images" to "authenticated";

grant insert on table "public"."product_images" to "authenticated";

grant references on table "public"."product_images" to "authenticated";

grant select on table "public"."product_images" to "authenticated";

grant trigger on table "public"."product_images" to "authenticated";

grant truncate on table "public"."product_images" to "authenticated";

grant update on table "public"."product_images" to "authenticated";

grant delete on table "public"."product_images" to "service_role";

grant insert on table "public"."product_images" to "service_role";

grant references on table "public"."product_images" to "service_role";

grant select on table "public"."product_images" to "service_role";

grant trigger on table "public"."product_images" to "service_role";

grant truncate on table "public"."product_images" to "service_role";

grant update on table "public"."product_images" to "service_role";

grant delete on table "public"."product_variants" to "anon";

grant insert on table "public"."product_variants" to "anon";

grant references on table "public"."product_variants" to "anon";

grant select on table "public"."product_variants" to "anon";

grant trigger on table "public"."product_variants" to "anon";

grant truncate on table "public"."product_variants" to "anon";

grant update on table "public"."product_variants" to "anon";

grant delete on table "public"."product_variants" to "authenticated";

grant insert on table "public"."product_variants" to "authenticated";

grant references on table "public"."product_variants" to "authenticated";

grant select on table "public"."product_variants" to "authenticated";

grant trigger on table "public"."product_variants" to "authenticated";

grant truncate on table "public"."product_variants" to "authenticated";

grant update on table "public"."product_variants" to "authenticated";

grant delete on table "public"."product_variants" to "service_role";

grant insert on table "public"."product_variants" to "service_role";

grant references on table "public"."product_variants" to "service_role";

grant select on table "public"."product_variants" to "service_role";

grant trigger on table "public"."product_variants" to "service_role";

grant truncate on table "public"."product_variants" to "service_role";

grant update on table "public"."product_variants" to "service_role";

grant delete on table "public"."products" to "anon";

grant insert on table "public"."products" to "anon";

grant references on table "public"."products" to "anon";

grant select on table "public"."products" to "anon";

grant trigger on table "public"."products" to "anon";

grant truncate on table "public"."products" to "anon";

grant update on table "public"."products" to "anon";

grant delete on table "public"."products" to "authenticated";

grant insert on table "public"."products" to "authenticated";

grant references on table "public"."products" to "authenticated";

grant select on table "public"."products" to "authenticated";

grant trigger on table "public"."products" to "authenticated";

grant truncate on table "public"."products" to "authenticated";

grant update on table "public"."products" to "authenticated";

grant delete on table "public"."products" to "service_role";

grant insert on table "public"."products" to "service_role";

grant references on table "public"."products" to "service_role";

grant select on table "public"."products" to "service_role";

grant trigger on table "public"."products" to "service_role";

grant truncate on table "public"."products" to "service_role";

grant update on table "public"."products" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."waitlist" to "anon";

grant insert on table "public"."waitlist" to "anon";

grant references on table "public"."waitlist" to "anon";

grant select on table "public"."waitlist" to "anon";

grant trigger on table "public"."waitlist" to "anon";

grant truncate on table "public"."waitlist" to "anon";

grant update on table "public"."waitlist" to "anon";

grant delete on table "public"."waitlist" to "authenticated";

grant insert on table "public"."waitlist" to "authenticated";

grant references on table "public"."waitlist" to "authenticated";

grant select on table "public"."waitlist" to "authenticated";

grant trigger on table "public"."waitlist" to "authenticated";

grant truncate on table "public"."waitlist" to "authenticated";

grant update on table "public"."waitlist" to "authenticated";

grant delete on table "public"."waitlist" to "service_role";

grant insert on table "public"."waitlist" to "service_role";

grant references on table "public"."waitlist" to "service_role";

grant select on table "public"."waitlist" to "service_role";

grant trigger on table "public"."waitlist" to "service_role";

grant truncate on table "public"."waitlist" to "service_role";

grant update on table "public"."waitlist" to "service_role";

create policy "Users can delete their own brands"
on "public"."brands"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Users can insert their own brands"
on "public"."brands"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Users can update their own brands"
on "public"."brands"
as permissive
for update
to authenticated
using ((user_id = auth.uid()));


create policy "Users can view their own brands"
on "public"."brands"
as permissive
for select
to authenticated
using ((user_id = auth.uid()));


create policy "Users can delete categories from their own catalogs"
on "public"."categories"
as permissive
for delete
to authenticated
using ((catalog_id IN ( SELECT product_catalogs.catalog_id
   FROM (product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can insert categories into their own catalogs"
on "public"."categories"
as permissive
for insert
to authenticated
with check ((catalog_id IN ( SELECT product_catalogs.catalog_id
   FROM (product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can update categories from their own catalogs"
on "public"."categories"
as permissive
for update
to authenticated
using ((catalog_id IN ( SELECT product_catalogs.catalog_id
   FROM (product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can view categories from their own catalogs"
on "public"."categories"
as permissive
for select
to authenticated
using ((catalog_id IN ( SELECT product_catalogs.catalog_id
   FROM (product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can delete attribute schemas from their own products"
on "public"."product_attribute_schemas"
as permissive
for delete
to authenticated
using ((product_id IN ( SELECT products.id
   FROM ((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can insert attribute schemas into their own products"
on "public"."product_attribute_schemas"
as permissive
for insert
to authenticated
with check ((product_id IN ( SELECT products.id
   FROM ((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can update attribute schemas from their own products"
on "public"."product_attribute_schemas"
as permissive
for update
to authenticated
using ((product_id IN ( SELECT products.id
   FROM ((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can view attribute schemas from their own products"
on "public"."product_attribute_schemas"
as permissive
for select
to authenticated
using ((product_id IN ( SELECT products.id
   FROM ((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can delete catalogs from their own brands"
on "public"."product_catalogs"
as permissive
for delete
to authenticated
using ((brand_id IN ( SELECT brands.id
   FROM brands
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can insert catalogs into their own brands"
on "public"."product_catalogs"
as permissive
for insert
to authenticated
with check ((brand_id IN ( SELECT brands.id
   FROM brands
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can update catalogs from their own brands"
on "public"."product_catalogs"
as permissive
for update
to authenticated
using ((brand_id IN ( SELECT brands.id
   FROM brands
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can view catalogs from their own brands"
on "public"."product_catalogs"
as permissive
for select
to authenticated
using ((brand_id IN ( SELECT brands.id
   FROM brands
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can delete images from their own products"
on "public"."product_images"
as permissive
for delete
to authenticated
using ((product_id IN ( SELECT products.id
   FROM ((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can insert images into their own products"
on "public"."product_images"
as permissive
for insert
to authenticated
with check ((product_id IN ( SELECT products.id
   FROM ((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can update images from their own products"
on "public"."product_images"
as permissive
for update
to authenticated
using ((product_id IN ( SELECT products.id
   FROM ((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can view images from their own products"
on "public"."product_images"
as permissive
for select
to authenticated
using ((product_id IN ( SELECT products.id
   FROM ((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can delete variants from their own products"
on "public"."product_variants"
as permissive
for delete
to authenticated
using ((product_id IN ( SELECT products.id
   FROM ((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can insert variants into their own products"
on "public"."product_variants"
as permissive
for insert
to authenticated
with check ((product_id IN ( SELECT products.id
   FROM ((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can update variants from their own products"
on "public"."product_variants"
as permissive
for update
to authenticated
using ((product_id IN ( SELECT products.id
   FROM ((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can view variants from their own catalogs"
on "public"."product_variants"
as permissive
for select
to authenticated
using ((product_id IN ( SELECT products.id
   FROM ((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can delete products from their own catalogs"
on "public"."products"
as permissive
for delete
to authenticated
using ((catalog_id IN ( SELECT product_catalogs.catalog_id
   FROM (product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can insert products into their own catalogs"
on "public"."products"
as permissive
for insert
to authenticated
with check ((catalog_id IN ( SELECT product_catalogs.catalog_id
   FROM (product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can update products from their own catalogs"
on "public"."products"
as permissive
for update
to authenticated
using ((catalog_id IN ( SELECT product_catalogs.catalog_id
   FROM (product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Users can view products from their own catalogs"
on "public"."products"
as permissive
for select
to authenticated
using ((catalog_id IN ( SELECT product_catalogs.catalog_id
   FROM (product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
  WHERE (brands.user_id = auth.uid()))));


create policy "Public profiles are viewable by everyone"
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile"
on "public"."profiles"
as permissive
for insert
to authenticated
with check ((auth.uid() = id));


create policy "Users can update own profile"
on "public"."profiles"
as permissive
for update
to authenticated
using ((auth.uid() = id));


create policy "Allow public waitlist signups"
on "public"."waitlist"
as permissive
for insert
to anon, authenticated
with check (true);


create policy "Authenticated users can read waitlist"
on "public"."waitlist"
as permissive
for select
to authenticated
using (true);


CREATE TRIGGER trigger_brands_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_product_attribute_schemas_updated_at BEFORE UPDATE ON public.product_attribute_schemas FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_product_catalogs_updated_at BEFORE UPDATE ON public.product_catalogs FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_product_images_updated_at BEFORE UPDATE ON public.product_images FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_auto_generate_sku BEFORE INSERT ON public.product_variants FOR EACH ROW EXECUTE FUNCTION auto_generate_sku();

CREATE TRIGGER trigger_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_update_product_aggregates_from_variants AFTER INSERT OR DELETE OR UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION update_product_aggregates();

CREATE TRIGGER trigger_validate_variant_attributes BEFORE INSERT OR UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION validate_variant_attributes();

CREATE TRIGGER trigger_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_update_catalog_product_count AFTER INSERT OR DELETE OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_catalog_product_count();

CREATE TRIGGER trigger_validate_product_categories BEFORE INSERT OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION validate_product_categories();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.waitlist FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


