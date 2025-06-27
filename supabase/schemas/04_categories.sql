-- =====================================================
-- Categories Table Schema
-- =====================================================
-- Purpose: Product categories for organizing products within product catalogs
-- Dependencies: Requires public.product_catalogs table
-- RLS: User can only access categories from their own catalogs
-- Design: Categories belong to product catalogs, allowing different categorization per catalog
-- =====================================================

-- Create categories table
create table public.categories (
  id bigint generated always as identity primary key,
  category_id text not null unique,
  catalog_id text not null references public.product_catalogs (catalog_id) on delete cascade,
  name text not null,
  description text not null,
  slug text not null,
  parent_category_id text references public.categories (category_id) on delete set null,
  sort_order integer not null default 0,
  metadata jsonb default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.categories is 'Product categories for organizing products within product catalogs. Supports hierarchical structure with parent-child relationships.';

-- Add column comments for clarity
comment on column public.categories.category_id is 'Unique text identifier for the category';
comment on column public.categories.parent_category_id is 'Self-referencing foreign key for hierarchical categories (subcategories)';
comment on column public.categories.sort_order is 'Display order for categories within the same level';
comment on column public.categories.metadata is 'JSONB: Additional category metadata like images, colors, SEO data';
comment on column public.categories.slug is 'URL-friendly identifier for the category within the catalog';

-- Add indexes for performance
create index idx_categories_category_id on public.categories (category_id);
create index idx_categories_catalog_id on public.categories (catalog_id);
create index idx_categories_parent_id on public.categories (parent_category_id);
create index idx_categories_slug on public.categories (slug);
create index idx_categories_name on public.categories (name);
create index idx_categories_sort_order on public.categories (sort_order);
create index idx_categories_is_active on public.categories (is_active);
create index idx_categories_created_at_desc on public.categories (created_at desc);

-- GIN index for efficient JSONB queries
create index idx_categories_metadata_gin on public.categories using gin (metadata);

-- Ensure unique slug per catalog
create unique index idx_categories_catalog_slug_unique on public.categories (catalog_id, slug);

-- Ensure unique name per catalog per parent level
create unique index idx_categories_catalog_parent_name_unique on public.categories (catalog_id, parent_category_id, name);

-- Enable Row Level Security
alter table public.categories enable row level security;

-- RLS Policy: Users can view categories from their own catalogs
create policy "Users can view categories from their own catalogs"
  on public.categories
  for select
  to authenticated
  using (
    catalog_id in (
      select product_catalogs.catalog_id 
      from public.product_catalogs 
      join public.brands on product_catalogs.brand_id = brands.id
      where brands.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can insert categories into their own catalogs
create policy "Users can insert categories into their own catalogs"
  on public.categories
  for insert
  to authenticated
  with check (
    catalog_id in (
      select product_catalogs.catalog_id 
      from public.product_catalogs 
      join public.brands on product_catalogs.brand_id = brands.id
      where brands.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update categories from their own catalogs
create policy "Users can update categories from their own catalogs"
  on public.categories
  for update
  to authenticated
  using (
    catalog_id in (
      select product_catalogs.catalog_id 
      from public.product_catalogs 
      join public.brands on product_catalogs.brand_id = brands.id
      where brands.user_id = auth.uid()
    )
  );

-- RLS Policy: Users can delete categories from their own catalogs
create policy "Users can delete categories from their own catalogs"
  on public.categories
  for delete
  to authenticated
  using (
    catalog_id in (
      select product_catalogs.catalog_id 
      from public.product_catalogs 
      join public.brands on product_catalogs.brand_id = brands.id
      where brands.user_id = auth.uid()
    )
  );

-- Function to update total_categories count in product_catalogs
create or replace function public.update_catalog_categories_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    -- Increment count for the new category's catalog
    update public.product_catalogs 
    set total_categories = total_categories + 1 
    where catalog_id = NEW.catalog_id;
    return NEW;
  elsif TG_OP = 'DELETE' then
    -- Decrement count for the deleted category's catalog
    update public.product_catalogs 
    set total_categories = total_categories - 1 
    where catalog_id = OLD.catalog_id;
    return OLD;
  elsif TG_OP = 'UPDATE' then
    -- Handle catalog_id changes
    if OLD.catalog_id != NEW.catalog_id then
      -- Decrement count from old catalog
      update public.product_catalogs 
      set total_categories = total_categories - 1 
      where catalog_id = OLD.catalog_id;
      -- Increment count for new catalog
      update public.product_catalogs 
      set total_categories = total_categories + 1 
      where catalog_id = NEW.catalog_id;
    end if;
    return NEW;
  end if;
  return null;
end;
$$ language plpgsql;

comment on function public.update_catalog_categories_count() is 'Automatically updates total_categories count in product_catalogs when categories are inserted, updated, or deleted';

-- Triggers to maintain total_categories count
create trigger trigger_categories_count_insert
  after insert on public.categories
  for each row
  execute function public.update_catalog_categories_count();

create trigger trigger_categories_count_update
  after update on public.categories
  for each row
  execute function public.update_catalog_categories_count();

create trigger trigger_categories_count_delete
  after delete on public.categories
  for each row
  execute function public.update_catalog_categories_count();

-- Trigger to automatically update updated_at on categories
create trigger trigger_categories_updated_at
  before update on public.categories
  for each row
  execute function public.handle_updated_at(); 