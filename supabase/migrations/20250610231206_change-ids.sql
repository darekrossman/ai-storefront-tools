drop policy "Users can delete categories from their own catalogs" on "public"."categories";

drop policy "Users can insert categories into their own catalogs" on "public"."categories";

drop policy "Users can update categories from their own catalogs" on "public"."categories";

drop policy "Users can view categories from their own catalogs" on "public"."categories";

drop policy "Users can delete attributes from their own products" on "public"."product_attributes";

drop policy "Users can insert attributes into their own products" on "public"."product_attributes";

drop policy "Users can update attributes from their own products" on "public"."product_attributes";

drop policy "Users can view attributes from their own products" on "public"."product_attributes";

drop policy "Users can delete images from their own products" on "public"."product_images";

drop policy "Users can insert images into their own products" on "public"."product_images";

drop policy "Users can update images from their own products" on "public"."product_images";

drop policy "Users can view images from their own products" on "public"."product_images";

drop policy "Users can delete variants from their own products" on "public"."product_variants";

drop policy "Users can insert variants into their own products" on "public"."product_variants";

drop policy "Users can update variants from their own products" on "public"."product_variants";

drop policy "Users can view variants from their own catalogs" on "public"."product_variants";

drop policy "Users can delete products from their own catalogs" on "public"."products";

drop policy "Users can insert products into their own catalogs" on "public"."products";

drop policy "Users can update products from their own catalogs" on "public"."products";

drop policy "Users can view products from their own catalogs" on "public"."products";

alter table "public"."categories" drop constraint "categories_catalog_id_fkey";

alter table "public"."categories" drop constraint "categories_parent_category_id_fkey";

alter table "public"."products" drop constraint "products_catalog_id_fkey";

alter table "public"."products" drop constraint "products_parent_category_id_fkey";

alter table "public"."categories" add column "category_id" text not null;

alter table "public"."categories" alter column "catalog_id" set data type text using "catalog_id"::text;

alter table "public"."categories" alter column "parent_category_id" set data type text using "parent_category_id"::text;

alter table "public"."product_catalogs" add column "catalog_id" text not null;

alter table "public"."products" alter column "catalog_id" set data type text using "catalog_id"::text;

alter table "public"."products" alter column "parent_category_id" set data type text using "parent_category_id"::text;

CREATE UNIQUE INDEX categories_category_id_key ON public.categories USING btree (category_id);

CREATE INDEX idx_categories_category_id ON public.categories USING btree (category_id);

CREATE INDEX idx_product_catalogs_catalog_id ON public.product_catalogs USING btree (catalog_id);

CREATE UNIQUE INDEX product_catalogs_catalog_id_key ON public.product_catalogs USING btree (catalog_id);

alter table "public"."categories" add constraint "categories_category_id_key" UNIQUE using index "categories_category_id_key";

alter table "public"."product_catalogs" add constraint "product_catalogs_catalog_id_key" UNIQUE using index "product_catalogs_catalog_id_key";

alter table "public"."categories" add constraint "categories_catalog_id_fkey" FOREIGN KEY (catalog_id) REFERENCES product_catalogs(catalog_id) ON DELETE CASCADE not valid;

alter table "public"."categories" validate constraint "categories_catalog_id_fkey";

alter table "public"."categories" add constraint "categories_parent_category_id_fkey" FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE SET NULL not valid;

alter table "public"."categories" validate constraint "categories_parent_category_id_fkey";

alter table "public"."products" add constraint "products_catalog_id_fkey" FOREIGN KEY (catalog_id) REFERENCES product_catalogs(catalog_id) ON DELETE CASCADE not valid;

alter table "public"."products" validate constraint "products_catalog_id_fkey";

alter table "public"."products" add constraint "products_parent_category_id_fkey" FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE SET NULL not valid;

alter table "public"."products" validate constraint "products_parent_category_id_fkey";

set check_function_bodies = off;

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

create policy "Users can delete categories from their own catalogs"
on "public"."categories"
as permissive
for delete
to authenticated
using ((catalog_id IN ( SELECT product_catalogs.catalog_id
   FROM ((product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can insert categories into their own catalogs"
on "public"."categories"
as permissive
for insert
to authenticated
with check ((catalog_id IN ( SELECT product_catalogs.catalog_id
   FROM ((product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can update categories from their own catalogs"
on "public"."categories"
as permissive
for update
to authenticated
using ((catalog_id IN ( SELECT product_catalogs.catalog_id
   FROM ((product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can view categories from their own catalogs"
on "public"."categories"
as permissive
for select
to authenticated
using ((catalog_id IN ( SELECT product_catalogs.catalog_id
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
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
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
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
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
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
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
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can delete images from their own products"
on "public"."product_images"
as permissive
for delete
to authenticated
using ((product_id IN ( SELECT products.id
   FROM (((products
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
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
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
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
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
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
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
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
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
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
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
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
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
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
     JOIN product_catalogs ON ((products.catalog_id = product_catalogs.catalog_id)))
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can delete products from their own catalogs"
on "public"."products"
as permissive
for delete
to authenticated
using ((catalog_id IN ( SELECT product_catalogs.catalog_id
   FROM ((product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can insert products into their own catalogs"
on "public"."products"
as permissive
for insert
to authenticated
with check ((catalog_id IN ( SELECT product_catalogs.catalog_id
   FROM ((product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can update products from their own catalogs"
on "public"."products"
as permissive
for update
to authenticated
using ((catalog_id IN ( SELECT product_catalogs.catalog_id
   FROM ((product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));


create policy "Users can view products from their own catalogs"
on "public"."products"
as permissive
for select
to authenticated
using ((catalog_id IN ( SELECT product_catalogs.catalog_id
   FROM ((product_catalogs
     JOIN brands ON ((product_catalogs.brand_id = brands.id)))
     JOIN projects ON ((brands.project_id = projects.id)))
  WHERE (projects.user_id = auth.uid()))));



