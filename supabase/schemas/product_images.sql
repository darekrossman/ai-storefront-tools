-- Product Images Table Schema
-- Stores product images with structured naming for variants and attribute filtering

DROP TABLE IF EXISTS public.product_images CASCADE;

CREATE TABLE public.product_images (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  type TEXT NOT NULL DEFAULT 'gallery',
  color_id TEXT,
  attribute_filters JSONB DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX idx_product_images_type ON public.product_images(type);
CREATE INDEX idx_product_images_color_id ON public.product_images(color_id);
CREATE INDEX idx_product_images_attribute_filters_gin ON public.product_images USING gin(attribute_filters);
CREATE INDEX idx_product_images_sort_order ON public.product_images(sort_order);

-- Add table and column comments
COMMENT ON TABLE public.product_images IS 'Product images with structured naming for variants and attribute filtering';
COMMENT ON COLUMN public.product_images.product_id IS 'Reference to the master product';
COMMENT ON COLUMN public.product_images.url IS 'Image URL in Supabase Storage';
COMMENT ON COLUMN public.product_images.alt_text IS 'Alt text for accessibility';
COMMENT ON COLUMN public.product_images.type IS 'Image type: hero, gallery, thumbnail, lifestyle, detail, variant';
COMMENT ON COLUMN public.product_images.color_id IS 'Color ID for structured image naming: {masterId}_{colorId}_{index}.{ext}';
COMMENT ON COLUMN public.product_images.attribute_filters IS 'JSONB: Attributes that determine which variants show this image';
COMMENT ON COLUMN public.product_images.sort_order IS 'Display order within type group';

-- Add constraints for image types
ALTER TABLE public.product_images ADD CONSTRAINT check_image_type 
  CHECK (type IN ('hero', 'gallery', 'thumbnail', 'lifestyle', 'detail', 'variant'));

-- Enable Row Level Security
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view images from their own products"
  ON public.product_images FOR SELECT
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

CREATE POLICY "Users can insert images into their own products"
  ON public.product_images FOR INSERT
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

CREATE POLICY "Users can update images from their own products"
  ON public.product_images FOR UPDATE
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

CREATE POLICY "Users can delete images from their own products"
  ON public.product_images FOR DELETE
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
CREATE TRIGGER trigger_product_images_updated_at
  BEFORE UPDATE ON public.product_images
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at(); 