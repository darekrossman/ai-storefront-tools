create type "public"."brand_status" as enum ('draft', 'active', 'inactive', 'archived');

create type "public"."session_status" as enum ('active', 'completed', 'archived');

create table "public"."brands" (
    "id" bigint generated always as identity not null,
    "project_id" bigint not null,
    "name" text not null,
    "tagline" text,
    "mission" text,
    "vision" text,
    "values" text[] default '{}'::text[],
    "target_market" jsonb default '{}'::jsonb,
    "brand_personality" jsonb default '{}'::jsonb,
    "positioning" jsonb default '{}'::jsonb,
    "visual_identity" jsonb default '{}'::jsonb,
    "status" brand_status not null default 'draft'::brand_status,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."brands" enable row level security;

create table "public"."categories" (
    "id" bigint generated always as identity not null,
    "catalog_id" bigint not null,
    "name" text not null,
    "description" text not null,
    "slug" text not null,
    "parent_category_id" bigint,
    "sort_order" integer not null default 0,
    "metadata" jsonb default '{}'::jsonb,
    "is_active" boolean not null default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."categories" enable row level security;

create table "public"."product_attributes" (
    "id" bigint generated always as identity not null,
    "product_id" bigint not null,
    "attribute_id" text not null,
    "attribute_label" text not null,
    "options" jsonb not null default '[]'::jsonb,
    "is_required" boolean not null default false,
    "sort_order" integer not null default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."product_attributes" enable row level security;

create table "public"."product_catalogs" (
    "id" bigint generated always as identity not null,
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
    "orderable" boolean not null default true,
    "attributes" jsonb not null default '{}'::jsonb,
    "status" brand_status not null default 'draft'::brand_status,
    "sort_order" integer not null default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."product_variants" enable row level security;

create table "public"."products" (
    "id" bigint generated always as identity not null,
    "catalog_id" bigint not null,
    "parent_category_id" bigint,
    "name" text not null,
    "description" text not null,
    "short_description" text not null,
    "tags" text[] default '{}'::text[],
    "specifications" jsonb not null default '{}'::jsonb,
    "attributes" jsonb default '{}'::jsonb,
    "min_price" numeric(10,2),
    "max_price" numeric(10,2),
    "total_inventory" integer default 0,
    "meta_title" text,
    "meta_description" text,
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

create table "public"."projects" (
    "id" bigint generated always as identity not null,
    "user_id" uuid not null,
    "name" text not null,
    "description" text,
    "status" session_status not null default 'active'::session_status,
    "settings" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."projects" enable row level security;

CREATE UNIQUE INDEX brands_pkey ON public.brands USING btree (id);

CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id);

CREATE INDEX idx_brands_brand_personality_gin ON public.brands USING gin (brand_personality);

CREATE INDEX idx_brands_created_at_desc ON public.brands USING btree (created_at DESC);

CREATE INDEX idx_brands_name ON public.brands USING btree (name);

CREATE INDEX idx_brands_positioning_gin ON public.brands USING gin (positioning);

CREATE INDEX idx_brands_project_id ON public.brands USING btree (project_id);

CREATE INDEX idx_brands_status ON public.brands USING btree (status);

CREATE INDEX idx_brands_target_market_gin ON public.brands USING gin (target_market);

CREATE INDEX idx_brands_visual_identity_gin ON public.brands USING gin (visual_identity);

CREATE INDEX idx_categories_catalog_id ON public.categories USING btree (catalog_id);

CREATE UNIQUE INDEX idx_categories_catalog_parent_name_unique ON public.categories USING btree (catalog_id, parent_category_id, name);

CREATE UNIQUE INDEX idx_categories_catalog_slug_unique ON public.categories USING btree (catalog_id, slug);

CREATE INDEX idx_categories_created_at_desc ON public.categories USING btree (created_at DESC);

CREATE INDEX idx_categories_is_active ON public.categories USING btree (is_active);

CREATE INDEX idx_categories_metadata_gin ON public.categories USING gin (metadata);

CREATE INDEX idx_categories_name ON public.categories USING btree (name);

CREATE INDEX idx_categories_parent_id ON public.categories USING btree (parent_category_id);

CREATE INDEX idx_categories_slug ON public.categories USING btree (slug);

CREATE INDEX idx_categories_sort_order ON public.categories USING btree (sort_order);

CREATE INDEX idx_product_attributes_attribute_id ON public.product_attributes USING btree (attribute_id);

CREATE INDEX idx_product_attributes_is_required ON public.product_attributes USING btree (is_required);

CREATE INDEX idx_product_attributes_options_gin ON public.product_attributes USING gin (options);

CREATE INDEX idx_product_attributes_product_id ON public.product_attributes USING btree (product_id);

CREATE INDEX idx_product_attributes_sort_order ON public.product_attributes USING btree (sort_order);

CREATE INDEX idx_product_catalogs_brand_id ON public.product_catalogs USING btree (brand_id);

CREATE UNIQUE INDEX idx_product_catalogs_brand_slug_unique ON public.product_catalogs USING btree (brand_id, slug);

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

CREATE INDEX idx_product_variants_orderable ON public.product_variants USING btree (orderable);

CREATE INDEX idx_product_variants_price ON public.product_variants USING btree (price);

CREATE INDEX idx_product_variants_product_id ON public.product_variants USING btree (product_id);

CREATE INDEX idx_product_variants_sku ON public.product_variants USING btree (sku);

CREATE INDEX idx_product_variants_sort_order ON public.product_variants USING btree (sort_order);

CREATE INDEX idx_product_variants_status ON public.product_variants USING btree (status);

CREATE INDEX idx_products_attributes_gin ON public.products USING gin (attributes);

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

CREATE INDEX idx_products_total_inventory ON public.products USING btree (total_inventory);

CREATE INDEX idx_projects_created_at_desc ON public.projects USING btree (created_at DESC);

CREATE INDEX idx_projects_status ON public.projects USING btree (status);

CREATE INDEX idx_projects_user_id ON public.projects USING btree (user_id);

CREATE UNIQUE INDEX product_attributes_pkey ON public.product_attributes USING btree (id);

CREATE UNIQUE INDEX product_catalogs_pkey ON public.product_catalogs USING btree (id);

CREATE UNIQUE INDEX product_images_pkey ON public.product_images USING btree (id);

CREATE UNIQUE INDEX product_variants_pkey ON public.product_variants USING btree (id);

CREATE UNIQUE INDEX product_variants_sku_key ON public.product_variants USING btree (sku);

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

CREATE UNIQUE INDEX unique_product_attribute ON public.product_attributes USING btree (product_id, attribute_id);

alter table "public"."brands" add constraint "brands_pkey" PRIMARY KEY using index "brands_pkey";

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."product_attributes" add constraint "product_attributes_pkey" PRIMARY KEY using index "product_attributes_pkey";

alter table "public"."product_catalogs" add constraint "product_catalogs_pkey" PRIMARY KEY using index "product_catalogs_pkey";

alter table "public"."product_images" add constraint "product_images_pkey" PRIMARY KEY using index "product_images_pkey";

alter table "public"."product_variants" add constraint "product_variants_pkey" PRIMARY KEY using index "product_variants_pkey";

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."brands" add constraint "brands_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE not valid;

alter table "public"."brands" validate constraint "brands_project_id_fkey";

alter table "public"."categories" add constraint "categories_catalog_id_fkey" FOREIGN KEY (catalog_id) REFERENCES product_catalogs(id) ON DELETE CASCADE not valid;

alter table "public"."categories" validate constraint "categories_catalog_id_fkey";

alter table "public"."categories" add constraint "categories_parent_category_id_fkey" FOREIGN KEY (parent_category_id) REFERENCES categories(id) ON DELETE SET NULL not valid;

alter table "public"."categories" validate constraint "categories_parent_category_id_fkey";

alter table "public"."product_attributes" add constraint "product_attributes_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE not valid;

alter table "public"."product_attributes" validate constraint "product_attributes_product_id_fkey";

alter table "public"."product_attributes" add constraint "unique_product_attribute" UNIQUE using index "unique_product_attribute";

alter table "public"."product_catalogs" add constraint "product_catalogs_brand_id_fkey" FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE not valid;

alter table "public"."product_catalogs" validate constraint "product_catalogs_brand_id_fkey";

alter table "public"."product_images" add constraint "check_image_type" CHECK ((type = ANY (ARRAY['hero'::text, 'gallery'::text, 'thumbnail'::text, 'lifestyle'::text, 'detail'::text, 'variant'::text]))) not valid;

alter table "public"."product_images" validate constraint "check_image_type";

alter table "public"."product_images" add constraint "product_images_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE not valid;

alter table "public"."product_images" validate constraint "product_images_product_id_fkey";

alter table "public"."product_variants" add constraint "product_variants_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE not valid;

alter table "public"."product_variants" validate constraint "product_variants_product_id_fkey";

alter table "public"."product_variants" add constraint "product_variants_sku_key" UNIQUE using index "product_variants_sku_key";

alter table "public"."products" add constraint "products_catalog_id_fkey" FOREIGN KEY (catalog_id) REFERENCES product_catalogs(id) ON DELETE CASCADE not valid;

alter table "public"."products" validate constraint "products_catalog_id_fkey";

alter table "public"."products" add constraint "products_parent_category_id_fkey" FOREIGN KEY (parent_category_id) REFERENCES categories(id) ON DELETE SET NULL not valid;

alter table "public"."products" validate constraint "products_parent_category_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."profiles" add constraint "username_length" CHECK ((char_length(username) >= 3)) not valid;

alter table "public"."profiles" validate constraint "username_length";

alter table "public"."projects" add constraint "projects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_user_id_fkey";

set check_function_bodies = off;

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
    where id = new.parent_category_id 
    and catalog_id = new.catalog_id
  ) then
    raise exception 'Parent category must belong to the same catalog as the product';
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

grant delete on table "public"."product_attributes" to "anon";

grant insert on table "public"."product_attributes" to "anon";

grant references on table "public"."product_attributes" to "anon";

grant select on table "public"."product_attributes" to "anon";

grant trigger on table "public"."product_attributes" to "anon";

grant truncate on table "public"."product_attributes" to "anon";

grant update on table "public"."product_attributes" to "anon";

grant delete on table "public"."product_attributes" to "authenticated";

grant insert on table "public"."product_attributes" to "authenticated";

grant references on table "public"."product_attributes" to "authenticated";

grant select on table "public"."product_attributes" to "authenticated";

grant trigger on table "public"."product_attributes" to "authenticated";

grant truncate on table "public"."product_attributes" to "authenticated";

grant update on table "public"."product_attributes" to "authenticated";

grant delete on table "public"."product_attributes" to "service_role";

grant insert on table "public"."product_attributes" to "service_role";

grant references on table "public"."product_attributes" to "service_role";

grant select on table "public"."product_attributes" to "service_role";

grant trigger on table "public"."product_attributes" to "service_role";

grant truncate on table "public"."product_attributes" to "service_role";

grant update on table "public"."product_attributes" to "service_role";

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

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

create policy "Users can delete brands from their own projects"
on "public"."brands"
as permissive
for delete
to authenticated
using ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can insert brands into their own projects"
on "public"."brands"
as permissive
for insert
to authenticated
with check ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can update brands from their own projects"
on "public"."brands"
as permissive
for update
to authenticated
using ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can view brands from their own projects"
on "public"."brands"
as permissive
for select
to authenticated
using ((project_id IN ( SELECT projects.id
   FROM projects
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can delete categories from their own catalogs"
on "public"."categories"
as permissive
for delete
to authenticated
using ((catalog_id IN ( SELECT product_catalogs.id
   FROM ((product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can insert categories into their own catalogs"
on "public"."categories"
as permissive
for insert
to authenticated
with check ((catalog_id IN ( SELECT product_catalogs.id
   FROM ((product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can update categories from their own catalogs"
on "public"."categories"
as permissive
for update
to authenticated
using ((catalog_id IN ( SELECT product_catalogs.id
   FROM ((product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can view categories from their own catalogs"
on "public"."categories"
as permissive
for select
to authenticated
using ((catalog_id IN ( SELECT product_catalogs.id
   FROM ((product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can delete attributes from their own products"
on "public"."product_attributes"
as permissive
for delete
to authenticated
using ((product_id IN ( SELECT products.id
   FROM (((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can insert attributes into their own products"
on "public"."product_attributes"
as permissive
for insert
to authenticated
with check ((product_id IN ( SELECT products.id
   FROM (((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can update attributes from their own products"
on "public"."product_attributes"
as permissive
for update
to authenticated
using ((product_id IN ( SELECT products.id
   FROM (((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can view attributes from their own products"
on "public"."product_attributes"
as permissive
for select
to authenticated
using ((product_id IN ( SELECT products.id
   FROM (((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can delete catalogs from their own brands"
on "public"."product_catalogs"
as permissive
for delete
to authenticated
using ((brand_id IN ( SELECT brands.id
   FROM (brands
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can insert catalogs into their own brands"
on "public"."product_catalogs"
as permissive
for insert
to authenticated
with check ((brand_id IN ( SELECT brands.id
   FROM (brands
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can update catalogs from their own brands"
on "public"."product_catalogs"
as permissive
for update
to authenticated
using ((brand_id IN ( SELECT brands.id
   FROM (brands
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can view catalogs from their own brands"
on "public"."product_catalogs"
as permissive
for select
to authenticated
using ((brand_id IN ( SELECT brands.id
   FROM (brands
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can delete images from their own products"
on "public"."product_images"
as permissive
for delete
to authenticated
using ((product_id IN ( SELECT products.id
   FROM (((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can insert images into their own products"
on "public"."product_images"
as permissive
for insert
to authenticated
with check ((product_id IN ( SELECT products.id
   FROM (((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can update images from their own products"
on "public"."product_images"
as permissive
for update
to authenticated
using ((product_id IN ( SELECT products.id
   FROM (((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can view images from their own products"
on "public"."product_images"
as permissive
for select
to authenticated
using ((product_id IN ( SELECT products.id
   FROM (((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can delete variants from their own products"
on "public"."product_variants"
as permissive
for delete
to authenticated
using ((product_id IN ( SELECT products.id
   FROM (((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can insert variants into their own products"
on "public"."product_variants"
as permissive
for insert
to authenticated
with check ((product_id IN ( SELECT products.id
   FROM (((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can update variants from their own products"
on "public"."product_variants"
as permissive
for update
to authenticated
using ((product_id IN ( SELECT products.id
   FROM (((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can view variants from their own catalogs"
on "public"."product_variants"
as permissive
for select
to authenticated
using ((product_id IN ( SELECT products.id
   FROM (((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can delete products from their own catalogs"
on "public"."products"
as permissive
for delete
to authenticated
using ((catalog_id IN ( SELECT product_catalogs.id
   FROM ((product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can insert products into their own catalogs"
on "public"."products"
as permissive
for insert
to authenticated
with check ((catalog_id IN ( SELECT product_catalogs.id
   FROM ((product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can update products from their own catalogs"
on "public"."products"
as permissive
for update
to authenticated
using ((catalog_id IN ( SELECT product_catalogs.id
   FROM ((product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can view products from their own catalogs"
on "public"."products"
as permissive
for select
to authenticated
using ((catalog_id IN ( SELECT product_catalogs.id
   FROM ((product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


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


create policy "Users can delete their own projects"
on "public"."projects"
as permissive
for delete
to authenticated
using ((user_id = auth.uid()));


create policy "Users can insert their own projects"
on "public"."projects"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Users can update their own projects"
on "public"."projects"
as permissive
for update
to authenticated
using ((user_id = auth.uid()));


create policy "Users can view their own projects"
on "public"."projects"
as permissive
for select
to authenticated
using ((user_id = auth.uid()));


CREATE TRIGGER trigger_brands_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_product_attributes_updated_at BEFORE UPDATE ON public.product_attributes FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_product_catalogs_updated_at BEFORE UPDATE ON public.product_catalogs FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_product_images_updated_at BEFORE UPDATE ON public.product_images FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_update_catalog_product_count AFTER INSERT OR DELETE OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_catalog_product_count();

CREATE TRIGGER trigger_validate_product_categories BEFORE INSERT OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION validate_product_categories();

CREATE TRIGGER trigger_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


