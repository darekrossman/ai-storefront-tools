-- Master Products Table Schema
-- Contains shared product information, with variants holding specific SKUs, pricing, and attributes

DROP TABLE IF EXISTS public.products CASCADE;

CREATE TABLE public.products (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  catalog_id BIGINT NOT NULL REFERENCES public.product_catalogs(id) ON DELETE CASCADE,
  category_id BIGINT REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  attributes JSONB DEFAULT '{}',
  
  -- Aggregated pricing and inventory (auto-calculated from variants)
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  total_inventory INTEGER DEFAULT 0,
  
  -- Metadata
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[] DEFAULT '{}',
  status public.brand_status NOT NULL DEFAULT 'draft',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_products_catalog_id ON public.products(catalog_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_name ON public.products(name);
CREATE INDEX idx_products_tags_gin ON public.products USING gin(tags);
CREATE INDEX idx_products_attributes_gin ON public.products USING gin(attributes);
CREATE INDEX idx_products_min_price ON public.products(min_price);
CREATE INDEX idx_products_max_price ON public.products(max_price);
CREATE INDEX idx_products_total_inventory ON public.products(total_inventory);

-- Add table and column comments
COMMENT ON TABLE public.products IS 'Master products containing shared information. Variants hold specific SKUs, pricing, and attributes.';
COMMENT ON COLUMN public.products.name IS 'Product name/title';
COMMENT ON COLUMN public.products.description IS 'Product description';
COMMENT ON COLUMN public.products.attributes IS 'JSONB: General product attributes that apply to all variants';
COMMENT ON COLUMN public.products.min_price IS 'Minimum price across all variants (auto-calculated)';
COMMENT ON COLUMN public.products.max_price IS 'Maximum price across all variants (auto-calculated)';
COMMENT ON COLUMN public.products.total_inventory IS 'Total count of orderable variants (auto-calculated)';
COMMENT ON COLUMN public.products.meta_title IS 'SEO meta title';
COMMENT ON COLUMN public.products.meta_description IS 'SEO meta description';
COMMENT ON COLUMN public.products.tags IS 'Array of product tags for search and categorization';
COMMENT ON COLUMN public.products.status IS 'Product status: draft, published, archived';
COMMENT ON COLUMN public.products.sort_order IS 'Display order within category';

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view products from their own catalogs"
  ON public.products FOR SELECT
  TO authenticated
  USING (
    catalog_id IN (
      SELECT product_catalogs.id FROM public.product_catalogs
      JOIN public.brands ON product_catalogs.brand_id = brands.id
      JOIN public.projects ON brands.project_id = projects.id
      WHERE projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert products into their own catalogs"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (
    catalog_id IN (
      SELECT product_catalogs.id FROM public.product_catalogs
      JOIN public.brands ON product_catalogs.brand_id = brands.id
      JOIN public.projects ON brands.project_id = projects.id
      WHERE projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (
    catalog_id IN (
      SELECT product_catalogs.id FROM public.product_catalogs
      JOIN public.brands ON product_catalogs.brand_id = brands.id
      JOIN public.projects ON brands.project_id = projects.id
      WHERE projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own products"
  ON public.products FOR DELETE
  TO authenticated
  USING (
    catalog_id IN (
      SELECT product_catalogs.id FROM public.product_catalogs
      JOIN public.brands ON product_catalogs.brand_id = brands.id
      JOIN public.projects ON brands.project_id = projects.id
      WHERE projects.user_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at(); 