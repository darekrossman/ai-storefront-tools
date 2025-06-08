-- Product Attributes Table Schema
-- Defines available attributes and their options for products

DROP TABLE IF EXISTS public.product_attributes CASCADE;

CREATE TABLE public.product_attributes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  attribute_id TEXT NOT NULL,
  attribute_label TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  is_required BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_product_attribute UNIQUE(product_id, attribute_id)
);

-- Create indexes for performance
CREATE INDEX idx_product_attributes_product_id ON public.product_attributes(product_id);
CREATE INDEX idx_product_attributes_attribute_id ON public.product_attributes(attribute_id);
CREATE INDEX idx_product_attributes_options_gin ON public.product_attributes USING gin(options);
CREATE INDEX idx_product_attributes_is_required ON public.product_attributes(is_required);

-- Add table and column comments
COMMENT ON TABLE public.product_attributes IS 'Defines available attributes and their options for products';
COMMENT ON COLUMN public.product_attributes.product_id IS 'Reference to the master product';
COMMENT ON COLUMN public.product_attributes.attribute_id IS 'Attribute identifier like "color", "size", "material"';
COMMENT ON COLUMN public.product_attributes.attribute_label IS 'Human-readable label like "Color", "Size", "Material"';
COMMENT ON COLUMN public.product_attributes.options IS 'JSONB: Available options like [{"id": "red", "label": "Red"}, {"id": "blue", "label": "Blue"}]';
COMMENT ON COLUMN public.product_attributes.is_required IS 'Whether this attribute is required for all variants';
COMMENT ON COLUMN public.product_attributes.sort_order IS 'Display order for attribute selection interface';

-- Enable Row Level Security
ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view attributes from their own products"
  ON public.product_attributes FOR SELECT
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

CREATE POLICY "Users can insert attributes into their own products"
  ON public.product_attributes FOR INSERT
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

CREATE POLICY "Users can update attributes from their own products"
  ON public.product_attributes FOR UPDATE
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

CREATE POLICY "Users can delete attributes from their own products"
  ON public.product_attributes FOR DELETE
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
CREATE TRIGGER trigger_product_attributes_updated_at
  BEFORE UPDATE ON public.product_attributes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at(); 