-- Product Variants Table Schema
-- Purchasable product variants with specific attributes, pricing, and SKUs

DROP TABLE IF EXISTS public.product_variants CASCADE;

CREATE TABLE public.product_variants (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  barcode TEXT,
  price DECIMAL(10,2) NOT NULL,
  orderable BOOLEAN NOT NULL DEFAULT true,
  attributes JSONB NOT NULL DEFAULT '{}',
  status public.brand_status NOT NULL DEFAULT 'draft',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON public.product_variants(sku);
CREATE INDEX idx_product_variants_status ON public.product_variants(status);
CREATE INDEX idx_product_variants_orderable ON public.product_variants(orderable);
CREATE INDEX idx_product_variants_attributes_gin ON public.product_variants USING gin(attributes);
CREATE INDEX idx_product_variants_price ON public.product_variants(price);

-- Add table and column comments
COMMENT ON TABLE public.product_variants IS 'Purchasable product variants with specific attributes, pricing, and SKUs';
COMMENT ON COLUMN public.product_variants.product_id IS 'Reference to the master product';
COMMENT ON COLUMN public.product_variants.sku IS 'Unique Stock Keeping Unit for this variant';
COMMENT ON COLUMN public.product_variants.barcode IS 'Optional barcode (UPC, EAN, etc.)';
COMMENT ON COLUMN public.product_variants.price IS 'Independent price for this variant';
COMMENT ON COLUMN public.product_variants.orderable IS 'Whether this variant can be ordered (inventory will be separate table later)';
COMMENT ON COLUMN public.product_variants.attributes IS 'JSONB: Applied attributes like {"color": "red", "size": "large"}';
COMMENT ON COLUMN public.product_variants.status IS 'Variant status: draft, published, archived';
COMMENT ON COLUMN public.product_variants.sort_order IS 'Display order within product variants';

-- Enable Row Level Security
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view variants from their own catalogs"
  ON public.product_variants FOR SELECT
  TO authenticated
  USING (
    product_id IN (
      SELECT products.id FROM public.products
      JOIN public.product_catalogs ON products.catalog_id = product_catalogs.id
      JOIN public.brands ON product_catalogs.brand_id = brands.id
      JOIN public.projects ON brands.project_id = projects.id
      WHERE projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert variants into their own products"
  ON public.product_variants FOR INSERT
  TO authenticated
  WITH CHECK (
    product_id IN (
      SELECT products.id FROM public.products
      JOIN public.product_catalogs ON products.catalog_id = product_catalogs.id
      JOIN public.brands ON product_catalogs.brand_id = brands.id
      JOIN public.projects ON brands.project_id = projects.id
      WHERE projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update variants from their own products"
  ON public.product_variants FOR UPDATE
  TO authenticated
  USING (
    product_id IN (
      SELECT products.id FROM public.products
      JOIN public.product_catalogs ON products.catalog_id = product_catalogs.id
      JOIN public.brands ON product_catalogs.brand_id = brands.id
      JOIN public.projects ON brands.project_id = projects.id
      WHERE projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete variants from their own products"
  ON public.product_variants FOR DELETE
  TO authenticated
  USING (
    product_id IN (
      SELECT products.id FROM public.products
      JOIN public.product_catalogs ON products.catalog_id = product_catalogs.id
      JOIN public.brands ON product_catalogs.brand_id = brands.id
      JOIN public.projects ON brands.project_id = projects.id
      WHERE projects.user_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER trigger_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at(); 