-- Migration: Setup Supabase Storage buckets for avatars and product images
-- This creates secure storage buckets with proper access policies

-- =====================================================
-- STORAGE BUCKETS SETUP
-- =====================================================

-- Create avatars bucket for user profile pictures
insert into storage.buckets (id, name, public)
values 
  ('avatars', 'avatars', true),
  ('product-images', 'product-images', true);

-- =====================================================
-- AVATAR STORAGE POLICIES
-- =====================================================

-- Policy: Users can view all avatars (since bucket is public)
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Policy: Users can upload their own avatar
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can update their own avatar
create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own avatar
create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- =====================================================
-- PRODUCT IMAGES STORAGE POLICIES
-- =====================================================

-- Policy: Product images are publicly accessible
create policy "Product images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Policy: Users can upload product images for their own projects
create policy "Users can upload product images for their own projects"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and exists (
      select 1 from public.projects
      where projects.user_id = auth.uid()
      and projects.id::text = (storage.foldername(name))[1]
    )
  );

-- Policy: Users can update product images for their own projects
create policy "Users can update product images for their own projects"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and exists (
      select 1 from public.projects
      where projects.user_id = auth.uid()
      and projects.id::text = (storage.foldername(name))[1]
    )
  );

-- Policy: Users can delete product images for their own projects
create policy "Users can delete product images for their own projects"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and exists (
      select 1 from public.projects
      where projects.user_id = auth.uid()
      and projects.id::text = (storage.foldername(name))[1]
    )
  );

-- =====================================================
-- HELPER FUNCTIONS FOR STORAGE
-- =====================================================

-- Function to generate avatar file path for a user
create or replace function public.get_avatar_path(user_id uuid, file_extension text)
returns text as $$
begin
  return user_id::text || '/avatar.' || file_extension;
end;
$$ language plpgsql security definer;

-- Function to generate product image path
create or replace function public.get_product_image_path(
  project_id bigint, 
  product_id bigint, 
  image_type text, 
  file_extension text
)
returns text as $$
begin
  return project_id::text || '/products/' || product_id::text || '/' || image_type || '.' || file_extension;
end;
$$ language plpgsql security definer;

-- Function to clean up old avatar when new one is uploaded
create or replace function public.cleanup_old_avatar()
returns trigger as $$
begin
  -- Delete old avatar file from storage when avatar_url changes
  if old.avatar_url is not null and old.avatar_url != new.avatar_url then
    -- Extract the file path from the old URL
    perform storage.delete_object('avatars', old.avatar_url);
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to cleanup old avatars on profile update
drop trigger if exists trigger_cleanup_old_avatar on public.profiles;
create trigger trigger_cleanup_old_avatar
  before update on public.profiles
  for each row
  when (old.avatar_url is distinct from new.avatar_url)
  execute function public.cleanup_old_avatar(); 