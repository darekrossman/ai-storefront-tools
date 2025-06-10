-- =====================================================
-- Product Attributes Table Schema
-- =====================================================
-- Purpose: Defines available attributes and their options for products
-- Dependencies: Requires public.products table
-- RLS: User can only access attributes from their own catalogs/brands
-- =====================================================

-- Create product attributes table
create table if not exists public.product_attributes (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  attribute_id text not null,
  attribute_label text not null,
  options jsonb not null default '[]',
  is_required boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_product_attribute unique(product_id, attribute_id)
);

comment on table public.product_attributes is 'Defines available attributes and their options for products';

-- Add column comments for clarity
comment on column public.product_attributes.product_id is 'Reference to the master product';
comment on column public.product_attributes.attribute_id is 'Attribute identifier like "color", "size", "material"';
comment on column public.product_attributes.attribute_label is 'Human-readable label like "Color", "Size", "Material"';
comment on column public.product_attributes.options is 'JSONB: Available options like [{"id": "red", "label": "Red"}, {"id": "blue", "label": "Blue"}]';
comment on column public.product_attributes.is_required is 'Whether this attribute is required for all variants';
comment on column public.product_attributes.sort_order is 'Display order for attribute selection interface';

-- Create indexes for performance
create index if not exists idx_product_attributes_product_id on public.product_attributes(product_id);
create index if not exists idx_product_attributes_attribute_id on public.product_attributes(attribute_id);
create index if not exists idx_product_attributes_options_gin on public.product_attributes using gin(options);
create index if not exists idx_product_attributes_is_required on public.product_attributes(is_required);
create index if not exists idx_product_attributes_sort_order on public.product_attributes(sort_order);

-- Enable Row Level Security
alter table public.product_attributes enable row level security;

-- RLS Policy: Users can view attributes from their own products
do $$ begin
    create policy "Users can view attributes from their own products"
      on public.product_attributes for select
      to authenticated
      using (
        product_id in (
          select products.id from public.products
          join public.product_catalogs on products.catalog_id = product_catalogs.catalog_id
          join public.brands on product_catalogs.brand_id = brands.id
          join public.projects on brands.project_id = projects.id
          where projects.user_id = auth.uid()
        )
      );
exception
    when duplicate_object then null;
end $$;

-- RLS Policy: Users can insert attributes into their own products
do $$ begin
    create policy "Users can insert attributes into their own products"
      on public.product_attributes for insert
      to authenticated
      with check (
        product_id in (
          select products.id from public.products
          join public.product_catalogs on products.catalog_id = product_catalogs.catalog_id
          join public.brands on product_catalogs.brand_id = brands.id
          join public.projects on brands.project_id = projects.id
          where projects.user_id = auth.uid()
        )
      );
exception
    when duplicate_object then null;
end $$;

-- RLS Policy: Users can update attributes from their own products
do $$ begin
    create policy "Users can update attributes from their own products"
      on public.product_attributes for update
      to authenticated
      using (
        product_id in (
          select products.id from public.products
          join public.product_catalogs on products.catalog_id = product_catalogs.catalog_id
          join public.brands on product_catalogs.brand_id = brands.id
          join public.projects on brands.project_id = projects.id
          where projects.user_id = auth.uid()
        )
      );
exception
    when duplicate_object then null;
end $$;

-- RLS Policy: Users can delete attributes from their own products
do $$ begin
    create policy "Users can delete attributes from their own products"
      on public.product_attributes for delete
      to authenticated
      using (
        product_id in (
          select products.id from public.products
          join public.product_catalogs on products.catalog_id = product_catalogs.catalog_id
          join public.brands on product_catalogs.brand_id = brands.id
          join public.projects on brands.project_id = projects.id
          where projects.user_id = auth.uid()
        )
      );
exception
    when duplicate_object then null;
end $$;

-- Trigger to automatically update updated_at on product_attributes
do $$ begin
    create trigger trigger_product_attributes_updated_at
      before update on public.product_attributes
      for each row execute function public.handle_updated_at();
exception
    when duplicate_object then null;
end $$; 