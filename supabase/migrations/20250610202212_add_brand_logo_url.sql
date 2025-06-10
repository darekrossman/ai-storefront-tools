-- Add logo_url column to brands table for referencing files in brand_assets bucket
alter table "public"."brands" add column "logo_url" text;

-- Add comment for the new column
comment on column public.brands.logo_url is 'URL path to logo file in brand_assets bucket (e.g., "brand-123/logo.png")';