-- Migration: Add image metadata columns to product_images table
-- Date: 2025-01-14
-- Description: Add width, height, computed aspect_ratio, seed, and prompt columns for AI-generated image metadata

-- Add new columns to product_images table
alter table public.product_images 
add column if not exists width integer,
add column if not exists height integer,
add column if not exists seed bigint,
add column if not exists prompt text;

-- Add computed aspect_ratio column
alter table public.product_images 
add column if not exists aspect_ratio decimal generated always as (
  case 
    when height > 0 then round((width::decimal / height::decimal), 4)
    else null 
  end
) stored;

-- Add column comments
comment on column public.product_images.width is 'Image width in pixels';
comment on column public.product_images.height is 'Image height in pixels';
comment on column public.product_images.aspect_ratio is 'Computed aspect ratio (width/height) rounded to 4 decimal places';
comment on column public.product_images.seed is 'AI generation seed number for reproducible results';
comment on column public.product_images.prompt is 'AI generation prompt used to create the image'; 