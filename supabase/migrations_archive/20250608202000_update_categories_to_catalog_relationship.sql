-- Migration: Update categories table to reference product_catalogs instead of brands
-- This changes the relationship from categories -> brands to categories -> product_catalogs

-- Step 1: Drop existing policies, constraints, and indexes that reference brand_id
drop policy if exists "Users can view categories from their own brands" on public.categories;
drop policy if exists "Users can insert categories into their own brands" on public.categories;
drop policy if exists "Users can update categories from their own brands" on public.categories;
drop policy if exists "Users can delete categories from their own brands" on public.categories;

drop index if exists idx_categories_brand_id;
drop index if exists idx_categories_brand_slug_unique;
drop index if exists idx_categories_brand_parent_name_unique;

-- Step 2: Add new catalog_id column
alter table public.categories add column catalog_id bigint;

-- Step 3: Populate catalog_id based on existing brand_id (temporary)
-- For now, we'll just use the first catalog for each brand
-- In a real migration, you'd need to handle this based on your business logic
update public.categories 
set catalog_id = (
  select pc.id 
  from public.product_catalogs pc 
  where pc.brand_id = categories.brand_id 
  limit 1
);

-- Step 4: Make catalog_id not null and add foreign key constraint
alter table public.categories alter column catalog_id set not null;
alter table public.categories add constraint categories_catalog_id_fkey 
  foreign key (catalog_id) references public.product_catalogs (id) on delete cascade;

-- Step 5: Drop the old brand_id column and constraint
alter table public.categories drop constraint if exists categories_brand_id_fkey;
alter table public.categories drop column brand_id;

-- Step 6: Add new indexes
create index idx_categories_catalog_id on public.categories (catalog_id);
create unique index idx_categories_catalog_slug_unique on public.categories (catalog_id, slug);
create unique index idx_categories_catalog_parent_name_unique on public.categories (catalog_id, parent_category_id, name);

-- Step 7: Create new RLS policies
create policy "Users can view categories from their own catalogs"
  on public.categories
  for select
  to authenticated
  using (
    catalog_id in (
      select product_catalogs.id 
      from public.product_catalogs 
      join public.brands on product_catalogs.brand_id = brands.id
      join public.projects on brands.project_id = projects.id 
      where projects.user_id = auth.uid()
    )
  );

create policy "Users can insert categories into their own catalogs"
  on public.categories
  for insert
  to authenticated
  with check (
    catalog_id in (
      select product_catalogs.id 
      from public.product_catalogs 
      join public.brands on product_catalogs.brand_id = brands.id
      join public.projects on brands.project_id = projects.id 
      where projects.user_id = auth.uid()
    )
  );

create policy "Users can update categories from their own catalogs"
  on public.categories
  for update
  to authenticated
  using (
    catalog_id in (
      select product_catalogs.id 
      from public.product_catalogs 
      join public.brands on product_catalogs.brand_id = brands.id
      join public.projects on brands.project_id = projects.id 
      where projects.user_id = auth.uid()
    )
  );

create policy "Users can delete categories from their own catalogs"
  on public.categories
  for delete
  to authenticated
  using (
    catalog_id in (
      select product_catalogs.id 
      from public.product_catalogs 
      join public.brands on product_catalogs.brand_id = brands.id
      join public.projects on brands.project_id = projects.id 
      where projects.user_id = auth.uid()
    )
  );

-- Step 8: Add validation trigger for products to ensure categories belong to same catalog
create or replace function public.validate_product_categories()
returns trigger as $$
begin
  -- Check primary category belongs to same catalog
  if not exists (
    select 1 from public.categories 
    where id = new.primary_category_id 
    and catalog_id = new.catalog_id
  ) then
    raise exception 'Primary category must belong to the same catalog as the product';
  end if;
  
  -- Check subcategory belongs to same catalog (if specified)
  if new.subcategory_id is not null and not exists (
    select 1 from public.categories 
    where id = new.subcategory_id 
    and catalog_id = new.catalog_id
  ) then
    raise exception 'Subcategory must belong to the same catalog as the product';
  end if;
  
  return new;
end;
$$ language plpgsql;

-- Add trigger if it doesn't exist
drop trigger if exists trigger_validate_product_categories on public.products;
create trigger trigger_validate_product_categories
  before insert or update on public.products
  for each row
  execute function public.validate_product_categories();

-- Update table and column comments
comment on table public.categories is 'Product categories for organizing products within product catalogs. Supports hierarchical structure with parent-child relationships.';
comment on column public.categories.catalog_id is 'Foreign key to product_catalogs table';
comment on column public.categories.slug is 'URL-friendly identifier for the category within the catalog'; 