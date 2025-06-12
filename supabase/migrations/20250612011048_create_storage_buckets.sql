-- =====================================================
-- Storage Buckets and Policies
-- =====================================================
-- Purpose: Create storage buckets for brand and product assets
-- and apply row-level security to protect them.
-- Updated for direct user->brand ownership (no projects)
-- =====================================================

-- 1. Create storage buckets
-- These buckets are created with public read access.
insert into storage.buckets (id, name, public)
values
  ('brand_assets', 'brand_assets', true),
  ('product_images', 'product_images', true),
  ('product_swatches', 'product_swatches', true)
on conflict (id) do nothing;


-- 2. Brand Assets Bucket Policies
-- Policies for the 'brand_assets' bucket, which stores logos and other brand-specific images.
-- The user must be authenticated and own the brand.

-- Allow authenticated users to view all brand assets (public read access is already on)
create policy "Allow read access to all brand assets"
  on storage.objects for select
  to authenticated
  using ( bucket_id = 'brand_assets' );

-- Restrict uploads to brand owners. Path is expected to be 'brand_id/file_name'
create policy "Allow uploads for brand owners in brand_assets"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'brand_assets' and
    (storage.foldername(name))[1]::bigint in (
      select b.id
      from public.brands b
      where b.user_id = auth.uid()
    )
  );

-- Restrict updates to brand owners.
create policy "Allow updates for brand owners in brand_assets"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'brand_assets' and
    (storage.foldername(name))[1]::bigint in (
      select b.id
      from public.brands b
      where b.user_id = auth.uid()
    )
  );

-- Restrict deletes to brand owners.
create policy "Allow deletes for brand owners in brand_assets"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'brand_assets' and
    (storage.foldername(name))[1]::bigint in (
      select b.id
      from public.brands b
      where b.user_id = auth.uid()
    )
  );

-- 3. Product Images Bucket Policies
-- Policies for the 'product_images' bucket.
-- User must be authenticated and own the brand that contains the product.

-- Allow authenticated users to view all product images
create policy "Allow read access to all product images"
  on storage.objects for select
  to authenticated
  using ( bucket_id = 'product_images' );

-- Restrict uploads to brand owners. Path is expected to be 'product_id/file_name'
create policy "Allow uploads for brand owners in product_images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product_images' and
    (storage.foldername(name))[1]::bigint in (
      select prod.id
      from public.products prod
      join public.product_catalogs pc on prod.catalog_id = pc.catalog_id
      join public.brands b on pc.brand_id = b.id
      where b.user_id = auth.uid()
    )
  );

-- Restrict updates to brand owners.
create policy "Allow updates for brand owners in product_images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'product_images' and
    (storage.foldername(name))[1]::bigint in (
      select prod.id
      from public.products prod
      join public.product_catalogs pc on prod.catalog_id = pc.catalog_id
      join public.brands b on pc.brand_id = b.id
      where b.user_id = auth.uid()
    )
  );

-- Restrict deletes to brand owners.
create policy "Allow deletes for brand owners in product_images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'product_images' and
    (storage.foldername(name))[1]::bigint in (
      select prod.id
      from public.products prod
      join public.product_catalogs pc on prod.catalog_id = pc.catalog_id
      join public.brands b on pc.brand_id = b.id
      where b.user_id = auth.uid()
    )
  );

-- 4. Product Swatches Bucket Policies
-- Policies for the 'product_swatches' bucket.
-- Permissions are identical to product_images.

-- Allow authenticated users to view all product swatches
create policy "Allow read access to all product swatches"
  on storage.objects for select
  to authenticated
  using ( bucket_id = 'product_swatches' );

-- Restrict uploads to brand owners. Path is expected to be 'product_id/file_name'
create policy "Allow uploads for brand owners in product_swatches"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product_swatches' and
    (storage.foldername(name))[1]::bigint in (
      select prod.id
      from public.products prod
      join public.product_catalogs pc on prod.catalog_id = pc.catalog_id
      join public.brands b on pc.brand_id = b.id
      where b.user_id = auth.uid()
    )
  );

-- Restrict updates to brand owners.
create policy "Allow updates for brand owners in product_swatches"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'product_swatches' and
    (storage.foldername(name))[1]::bigint in (
      select prod.id
      from public.products prod
      join public.product_catalogs pc on prod.catalog_id = pc.catalog_id
      join public.brands b on pc.brand_id = b.id
      where b.user_id = auth.uid()
    )
  );

-- Restrict deletes to brand owners.
create policy "Allow deletes for brand owners in product_swatches"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'product_swatches' and
    (storage.foldername(name))[1]::bigint in (
      select prod.id
      from public.products prod
      join public.product_catalogs pc on prod.catalog_id = pc.catalog_id
      join public.brands b on pc.brand_id = b.id
      where b.user_id = auth.uid()
    )
  ); 