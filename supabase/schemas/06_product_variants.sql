-- =====================================================
-- Product Variants Table Schema
-- =====================================================
-- Purpose: Purchasable product variants with specific attributes, pricing, and SKUs
-- Dependencies: Requires public.products table
-- RLS: User can only access variants from their own catalogs/brands
-- =====================================================

-- Create product variants table
create table if not exists public.product_variants (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  sku text not null unique,
  barcode text,
  price decimal(10,2) not null,
  orderable boolean not null default true,
  attributes jsonb not null default '{}',
  status public.brand_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.product_variants is 'Purchasable product variants with specific attributes, pricing, and SKUs';

-- Add column comments for clarity
comment on column public.product_variants.product_id is 'Reference to the master product';
comment on column public.product_variants.sku is 'Unique Stock Keeping Unit for this variant';
comment on column public.product_variants.barcode is 'Optional barcode (UPC, EAN, etc.)';
comment on column public.product_variants.price is 'Independent price for this variant';
comment on column public.product_variants.orderable is 'Whether this variant can be ordered (inventory will be separate table later)';
comment on column public.product_variants.attributes is 'JSONB: Applied attributes like {"color": "red", "size": "large"}';
comment on column public.product_variants.status is 'Variant status: draft, published, archived';
comment on column public.product_variants.sort_order is 'Display order within product variants';

-- Create indexes for performance
create index if not exists idx_product_variants_product_id on public.product_variants(product_id);
create index if not exists idx_product_variants_sku on public.product_variants(sku);
create index if not exists idx_product_variants_status on public.product_variants(status);
create index if not exists idx_product_variants_orderable on public.product_variants(orderable);
create index if not exists idx_product_variants_attributes_gin on public.product_variants using gin(attributes);
create index if not exists idx_product_variants_price on public.product_variants(price);
create index if not exists idx_product_variants_sort_order on public.product_variants(sort_order);

-- Enable Row Level Security
alter table public.product_variants enable row level security;

-- RLS Policy: Users can view variants from their own catalogs
do $$ begin
    create policy "Users can view variants from their own catalogs"
      on public.product_variants for select
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

-- RLS Policy: Users can insert variants into their own products
do $$ begin
    create policy "Users can insert variants into their own products"
      on public.product_variants for insert
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

-- RLS Policy: Users can update variants from their own products
do $$ begin
    create policy "Users can update variants from their own products"
      on public.product_variants for update
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

-- RLS Policy: Users can delete variants from their own products
do $$ begin
    create policy "Users can delete variants from their own products"
      on public.product_variants for delete
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

-- Trigger to automatically update updated_at on product_variants
do $$ begin
    create trigger trigger_product_variants_updated_at
      before update on public.product_variants
      for each row execute function public.handle_updated_at();
exception
    when duplicate_object then null;
end $$; 