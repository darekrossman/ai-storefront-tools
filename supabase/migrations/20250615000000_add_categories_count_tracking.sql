-- =====================================================
-- Migration: Add Categories Count Tracking
-- =====================================================
-- Purpose: Add total_categories column to product_catalogs and create triggers 
--          to automatically maintain the count when categories are modified
-- Date: 2025-06-15
-- =====================================================

-- Add total_categories column to product_catalogs table
alter table public.product_catalogs 
add column total_categories integer not null default 0;

-- Add column comment
comment on column public.product_catalogs.total_categories is 'Automatically calculated count of categories in this catalog';

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

-- Create triggers to maintain total_categories count
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

-- Initialize total_categories count for existing catalogs
-- This ensures any existing data has the correct count
update public.product_catalogs 
set total_categories = (
  select count(*)
  from public.categories 
  where categories.catalog_id = product_catalogs.catalog_id
); 