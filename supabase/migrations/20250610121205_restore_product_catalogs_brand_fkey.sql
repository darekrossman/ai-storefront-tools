-- =====================================================
-- Migration: Restore Product Catalogs Brand Foreign Key
-- =====================================================
-- Purpose: Restore the foreign key constraint between product_catalogs and brands tables
-- Affected Tables: public.product_catalogs (add foreign key constraint)
-- Background: The brands table restructure migration (20250610120000) dropped the foreign key
-- constraint when it dropped and recreated the brands table. This migration restores that connection.
-- =====================================================

-- step 1: add the foreign key constraint from product_catalogs to brands
-- this ensures that every product_catalog.brand_id references a valid brands.id
alter table public.product_catalogs 
add constraint product_catalogs_brand_id_fkey 
foreign key (brand_id) references public.brands (id) on delete cascade;

-- step 2: validate the constraint to ensure data integrity
-- this will fail if there are any orphaned product_catalogs records
alter table public.product_catalogs 
validate constraint product_catalogs_brand_id_fkey;

-- migration completed successfully
-- product_catalogs are now properly linked to brands with referential integrity 