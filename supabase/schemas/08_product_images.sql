-- =====================================================
-- Product Images Table Schema
-- =====================================================
-- Purpose: Product images with structured naming for variants and attribute filtering
-- Dependencies: Requires public.products table
-- RLS: User can only access images from their own catalogs/brands
-- =====================================================

-- Create product images table
create table if not exists public.product_images (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  url text not null,
  alt_text text,
  type text not null default 'gallery',
  color_id text,
  attribute_filters jsonb default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.product_images is 'Product images with structured naming for variants and attribute filtering';

-- Add column comments for clarity
comment on column public.product_images.product_id is 'Reference to the master product';
comment on column public.product_images.url is 'Image URL in Supabase Storage';
comment on column public.product_images.alt_text is 'Alt text for accessibility';
comment on column public.product_images.type is 'Image type: hero, gallery, thumbnail, lifestyle, detail, variant';
comment on column public.product_images.color_id is 'Color ID for structured image naming: {masterId}_{colorId}_{index}.{ext}';
comment on column public.product_images.attribute_filters is 'JSONB: Attributes that determine which variants show this image';
comment on column public.product_images.sort_order is 'Display order within type group';

-- Add constraints for image types
do $$ begin
    alter table public.product_images add constraint check_image_type 
      check (type in ('hero', 'gallery', 'thumbnail', 'lifestyle', 'detail', 'variant'));
exception
    when duplicate_object then null;
end $$;

-- Create indexes for performance
create index if not exists idx_product_images_product_id on public.product_images(product_id);
create index if not exists idx_product_images_type on public.product_images(type);
create index if not exists idx_product_images_color_id on public.product_images(color_id);
create index if not exists idx_product_images_attribute_filters_gin on public.product_images using gin(attribute_filters);
create index if not exists idx_product_images_sort_order on public.product_images(sort_order);

-- Enable Row Level Security
alter table public.product_images enable row level security;

-- RLS Policy: Users can view images from their own products
do $$ begin
    create policy "Users can view images from their own products"
      on public.product_images for select
      to authenticated
      using (
        product_id in (
          select products.id from public.products
          join public.product_catalogs on products.catalog_id = product_catalogs.id
          join public.brands on product_catalogs.brand_id = brands.id
          join public.projects on brands.project_id = projects.id
          where projects.user_id = auth.uid()
        )
      );
exception
    when duplicate_object then null;
end $$;

-- RLS Policy: Users can insert images into their own products
do $$ begin
    create policy "Users can insert images into their own products"
      on public.product_images for insert
      to authenticated
      with check (
        product_id in (
          select products.id from public.products
          join public.product_catalogs on products.catalog_id = product_catalogs.id
          join public.brands on product_catalogs.brand_id = brands.id
          join public.projects on brands.project_id = projects.id
          where projects.user_id = auth.uid()
        )
      );
exception
    when duplicate_object then null;
end $$;

-- RLS Policy: Users can update images from their own products
do $$ begin
    create policy "Users can update images from their own products"
      on public.product_images for update
      to authenticated
      using (
        product_id in (
          select products.id from public.products
          join public.product_catalogs on products.catalog_id = product_catalogs.id
          join public.brands on product_catalogs.brand_id = brands.id
          join public.projects on brands.project_id = projects.id
          where projects.user_id = auth.uid()
        )
      );
exception
    when duplicate_object then null;
end $$;

-- RLS Policy: Users can delete images from their own products
do $$ begin
    create policy "Users can delete images from their own products"
      on public.product_images for delete
      to authenticated
      using (
        product_id in (
          select products.id from public.products
          join public.product_catalogs on products.catalog_id = product_catalogs.id
          join public.brands on product_catalogs.brand_id = brands.id
          join public.projects on brands.project_id = projects.id
          where projects.user_id = auth.uid()
        )
      );
exception
    when duplicate_object then null;
end $$;

-- Trigger to automatically update updated_at on product_images
do $$ begin
    create trigger trigger_product_images_updated_at
      before update on public.product_images
      for each row execute function public.handle_updated_at();
exception
    when duplicate_object then null;
end $$; 