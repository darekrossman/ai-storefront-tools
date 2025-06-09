create table "public"."categories" (
    "id" bigint generated always as identity not null,
    "brand_id" bigint not null,
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

create table "public"."products" (
    "id" bigint generated always as identity not null,
    "catalog_id" bigint not null,
    "primary_category_id" bigint not null,
    "subcategory_id" bigint,
    "name" text not null,
    "description" text not null,
    "short_description" text not null,
    "tags" text[] default '{}'::text[],
    "specifications" jsonb not null default '{}'::jsonb,
    "pricing" jsonb not null default '{}'::jsonb,
    "inventory" jsonb not null default '{}'::jsonb,
    "marketing" jsonb not null default '{}'::jsonb,
    "relations" jsonb default '{}'::jsonb,
    "status" brand_status not null default 'draft'::brand_status,
    "sort_order" integer not null default 0,
    "is_featured" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."products" enable row level security;

CREATE UNIQUE INDEX categories_pkey ON public.categories USING btree (id);

CREATE INDEX idx_categories_brand_id ON public.categories USING btree (brand_id);

CREATE UNIQUE INDEX idx_categories_brand_parent_name_unique ON public.categories USING btree (brand_id, parent_category_id, name);

CREATE UNIQUE INDEX idx_categories_brand_slug_unique ON public.categories USING btree (brand_id, slug);

CREATE INDEX idx_categories_created_at_desc ON public.categories USING btree (created_at DESC);

CREATE INDEX idx_categories_is_active ON public.categories USING btree (is_active);

CREATE INDEX idx_categories_metadata_gin ON public.categories USING gin (metadata);

CREATE INDEX idx_categories_name ON public.categories USING btree (name);

CREATE INDEX idx_categories_parent_id ON public.categories USING btree (parent_category_id);

CREATE INDEX idx_categories_slug ON public.categories USING btree (slug);

CREATE INDEX idx_categories_sort_order ON public.categories USING btree (sort_order);

CREATE INDEX idx_product_catalogs_brand_id ON public.product_catalogs USING btree (brand_id);

CREATE UNIQUE INDEX idx_product_catalogs_brand_slug_unique ON public.product_catalogs USING btree (brand_id, slug);

CREATE INDEX idx_product_catalogs_created_at_desc ON public.product_catalogs USING btree (created_at DESC);

CREATE INDEX idx_product_catalogs_name ON public.product_catalogs USING btree (name);

CREATE INDEX idx_product_catalogs_settings_gin ON public.product_catalogs USING gin (settings);

CREATE INDEX idx_product_catalogs_slug ON public.product_catalogs USING btree (slug);

CREATE INDEX idx_product_catalogs_status ON public.product_catalogs USING btree (status);

CREATE INDEX idx_products_catalog_id ON public.products USING btree (catalog_id);

CREATE INDEX idx_products_catalog_status ON public.products USING btree (catalog_id, status);

CREATE INDEX idx_products_category_featured ON public.products USING btree (primary_category_id, is_featured);

CREATE INDEX idx_products_created_at_desc ON public.products USING btree (created_at DESC);

CREATE INDEX idx_products_inventory_gin ON public.products USING gin (inventory);

CREATE INDEX idx_products_is_featured ON public.products USING btree (is_featured);

CREATE INDEX idx_products_marketing_gin ON public.products USING gin (marketing);

CREATE INDEX idx_products_name ON public.products USING btree (name);

CREATE INDEX idx_products_pricing_gin ON public.products USING gin (pricing);

CREATE INDEX idx_products_primary_category_id ON public.products USING btree (primary_category_id);

CREATE INDEX idx_products_relations_gin ON public.products USING gin (relations);

CREATE INDEX idx_products_sort_order ON public.products USING btree (sort_order);

CREATE INDEX idx_products_specifications_gin ON public.products USING gin (specifications);

CREATE INDEX idx_products_status ON public.products USING btree (status);

CREATE INDEX idx_products_subcategory_id ON public.products USING btree (subcategory_id);

CREATE INDEX idx_products_tags_gin ON public.products USING gin (tags);

CREATE UNIQUE INDEX product_catalogs_pkey ON public.product_catalogs USING btree (id);

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

alter table "public"."categories" add constraint "categories_pkey" PRIMARY KEY using index "categories_pkey";

alter table "public"."product_catalogs" add constraint "product_catalogs_pkey" PRIMARY KEY using index "product_catalogs_pkey";

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."categories" add constraint "categories_brand_id_fkey" FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE not valid;

alter table "public"."categories" validate constraint "categories_brand_id_fkey";

alter table "public"."categories" add constraint "categories_parent_category_id_fkey" FOREIGN KEY (parent_category_id) REFERENCES categories(id) ON DELETE SET NULL not valid;

alter table "public"."categories" validate constraint "categories_parent_category_id_fkey";

alter table "public"."product_catalogs" add constraint "product_catalogs_brand_id_fkey" FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE not valid;

alter table "public"."product_catalogs" validate constraint "product_catalogs_brand_id_fkey";

alter table "public"."products" add constraint "products_catalog_id_fkey" FOREIGN KEY (catalog_id) REFERENCES product_catalogs(id) ON DELETE CASCADE not valid;

alter table "public"."products" validate constraint "products_catalog_id_fkey";

alter table "public"."products" add constraint "products_primary_category_id_fkey" FOREIGN KEY (primary_category_id) REFERENCES categories(id) ON DELETE RESTRICT not valid;

alter table "public"."products" validate constraint "products_primary_category_id_fkey";

alter table "public"."products" add constraint "products_subcategory_id_fkey" FOREIGN KEY (subcategory_id) REFERENCES categories(id) ON DELETE SET NULL not valid;

alter table "public"."products" validate constraint "products_subcategory_id_fkey";

set check_function_bodies = off;

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

create policy "Users can delete categories from their own brands"
on "public"."categories"
as permissive
for delete
to authenticated
using ((brand_id IN ( SELECT brands.id
   FROM (brands
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can insert categories into their own brands"
on "public"."categories"
as permissive
for insert
to authenticated
with check ((brand_id IN ( SELECT brands.id
   FROM (brands
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can update categories from their own brands"
on "public"."categories"
as permissive
for update
to authenticated
using ((brand_id IN ( SELECT brands.id
   FROM (brands
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can view categories from their own brands"
on "public"."categories"
as permissive
for select
to authenticated
using ((brand_id IN ( SELECT brands.id
   FROM (brands
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


CREATE TRIGGER trigger_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_product_catalogs_updated_at BEFORE UPDATE ON public.product_catalogs FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_update_catalog_product_count AFTER INSERT OR DELETE OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_catalog_product_count();


