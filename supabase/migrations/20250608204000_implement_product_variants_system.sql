-- Migration: Implement Product Variants System
-- This migration transforms products into master products with variants and attributes

-- =====================================================
-- STEP 1: UPDATE PRODUCTS TABLE (MASTER PRODUCTS)
-- =====================================================

-- Remove old columns that are no longer needed in the master product structure
ALTER TABLE public.products DROP COLUMN IF EXISTS inventory;
ALTER TABLE public.products DROP COLUMN IF EXISTS pricing;
ALTER TABLE public.products DROP COLUMN IF EXISTS marketing;
ALTER TABLE public.products DROP COLUMN IF EXISTS relations;
ALTER TABLE public.products DROP COLUMN IF EXISTS specifications;
ALTER TABLE public.products DROP COLUMN IF EXISTS short_description;
ALTER TABLE public.products DROP COLUMN IF EXISTS is_featured;

-- Update category relationship to be optional (nullable)
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_primary_category_id_fkey;
ALTER TABLE public.products DROP COLUMN IF EXISTS primary_category_id;
ALTER TABLE public.products DROP COLUMN IF EXISTS subcategory_id;
ALTER TABLE public.products ADD COLUMN category_id BIGINT REFERENCES public.categories(id) ON DELETE SET NULL;

-- Add new fields for master product structure
ALTER TABLE public.products ADD COLUMN attributes JSONB DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN min_price DECIMAL(10,2);
ALTER TABLE public.products ADD COLUMN max_price DECIMAL(10,2);
ALTER TABLE public.products ADD COLUMN total_inventory INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN meta_title TEXT;
ALTER TABLE public.products ADD COLUMN meta_description TEXT;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_attributes_gin ON public.products USING gin(attributes);
CREATE INDEX IF NOT EXISTS idx_products_min_price ON public.products(min_price);
CREATE INDEX IF NOT EXISTS idx_products_max_price ON public.products(max_price);
CREATE INDEX IF NOT EXISTS idx_products_total_inventory ON public.products(total_inventory);

-- Update table comment
COMMENT ON TABLE public.products IS 'Master products containing shared information. Variants hold specific SKUs, pricing, and attributes.';
COMMENT ON COLUMN public.products.category_id IS 'Optional category assignment';
COMMENT ON COLUMN public.products.attributes IS 'JSONB: General product attributes that apply to all variants';
COMMENT ON COLUMN public.products.min_price IS 'Minimum price across all variants (auto-calculated)';
COMMENT ON COLUMN public.products.max_price IS 'Maximum price across all variants (auto-calculated)';
COMMENT ON COLUMN public.products.total_inventory IS 'Total count of orderable variants (auto-calculated)';
COMMENT ON COLUMN public.products.meta_title IS 'SEO meta title';
COMMENT ON COLUMN public.products.meta_description IS 'SEO meta description';

-- =====================================================
-- STEP 2: CREATE PRODUCT VARIANTS TABLE
-- =====================================================

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

-- Add indexes for performance
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON public.product_variants(sku);
CREATE INDEX idx_product_variants_status ON public.product_variants(status);
CREATE INDEX idx_product_variants_orderable ON public.product_variants(orderable);
CREATE INDEX idx_product_variants_attributes_gin ON public.product_variants USING gin(attributes);
CREATE INDEX idx_product_variants_price ON public.product_variants(price);

-- Add comments
COMMENT ON TABLE public.product_variants IS 'Purchasable product variants with specific attributes, pricing, and SKUs';
COMMENT ON COLUMN public.product_variants.sku IS 'Unique Stock Keeping Unit for this variant';
COMMENT ON COLUMN public.product_variants.price IS 'Independent price for this variant';
COMMENT ON COLUMN public.product_variants.orderable IS 'Whether this variant can be ordered (inventory will be separate table later)';
COMMENT ON COLUMN public.product_variants.attributes IS 'JSONB: Applied attributes like {"color": "red", "size": "large"}';

-- =====================================================
-- STEP 3: CREATE PRODUCT ATTRIBUTES TABLE
-- =====================================================

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

-- Add indexes
CREATE INDEX idx_product_attributes_product_id ON public.product_attributes(product_id);
CREATE INDEX idx_product_attributes_attribute_id ON public.product_attributes(attribute_id);
CREATE INDEX idx_product_attributes_options_gin ON public.product_attributes USING gin(options);

-- Add comments
COMMENT ON TABLE public.product_attributes IS 'Defines available attributes and their options for products';
COMMENT ON COLUMN public.product_attributes.attribute_id IS 'Attribute identifier like "color", "size", "material"';
COMMENT ON COLUMN public.product_attributes.attribute_label IS 'Human-readable label like "Color", "Size", "Material"';
COMMENT ON COLUMN public.product_attributes.options IS 'JSONB: Available options like [{"id": "red", "label": "Red"}]';

-- =====================================================
-- STEP 4: CREATE PRODUCT IMAGES TABLE
-- =====================================================

-- Create product images table
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

-- Add indexes for performance
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

-- RLS Policies for product_images
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

-- =====================================================
-- STEP 5: VALIDATION FUNCTIONS
-- =====================================================

-- Function to validate variant attributes match product attributes
CREATE OR REPLACE FUNCTION public.validate_variant_attributes()
RETURNS TRIGGER AS $$
DECLARE
  required_attrs TEXT[];
  available_options JSONB;
  attr_key TEXT;
  attr_value TEXT;
  valid_option BOOLEAN;
BEGIN
  -- Check each attribute in the variant
  FOR attr_key, attr_value IN SELECT * FROM jsonb_each_text(NEW.attributes)
  LOOP
    -- Check if attribute exists for this product
    SELECT options INTO available_options
    FROM public.product_attributes 
    WHERE product_id = NEW.product_id AND attribute_id = attr_key;
    
    IF available_options IS NULL THEN
      RAISE EXCEPTION 'Attribute "%" is not defined for this product', attr_key;
    END IF;
    
    -- Check if the value is valid for this attribute
    SELECT EXISTS(
      SELECT 1 FROM jsonb_array_elements(available_options) AS option
      WHERE option->>'id' = attr_value
    ) INTO valid_option;
    
    IF NOT valid_option THEN
      RAISE EXCEPTION 'Invalid value "%" for attribute "%"', attr_value, attr_key;
    END IF;
  END LOOP;
  
  -- Check all required attributes are present
  SELECT ARRAY_AGG(attribute_id) INTO required_attrs
  FROM public.product_attributes 
  WHERE product_id = NEW.product_id AND is_required = true;
  
  IF required_attrs IS NOT NULL THEN
    FOR attr_key IN SELECT unnest(required_attrs)
    LOOP
      IF NOT (NEW.attributes ? attr_key) THEN
        RAISE EXCEPTION 'Required attribute "%" is missing', attr_key;
      END IF;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update master product aggregates
CREATE OR REPLACE FUNCTION public.update_product_aggregates()
RETURNS TRIGGER AS $$
DECLARE
  target_product_id BIGINT;
BEGIN
  -- Get the product ID from the variant
  target_product_id := COALESCE(NEW.product_id, OLD.product_id);
  
  -- Update min/max price and total inventory
  UPDATE public.products SET
    min_price = (
      SELECT MIN(price) FROM public.product_variants 
      WHERE product_id = target_product_id
    ),
    max_price = (
      SELECT MAX(price) FROM public.product_variants 
      WHERE product_id = target_product_id
    ),
    total_inventory = (
      SELECT COUNT(*) FROM public.product_variants 
      WHERE product_id = target_product_id AND orderable = true
    ),
    updated_at = NOW()
  WHERE id = target_product_id;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to ensure products have at least one variant
CREATE OR REPLACE FUNCTION public.validate_product_has_variants()
RETURNS TRIGGER AS $$
BEGIN
  -- Only check on DELETE operations
  IF TG_OP = 'DELETE' THEN
    -- Check if this was the last variant
    IF NOT EXISTS (
      SELECT 1 FROM public.product_variants 
      WHERE product_id = OLD.product_id AND id != OLD.id
    ) THEN
      RAISE EXCEPTION 'Products must have at least one variant';
    END IF;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 6: CREATE TRIGGERS
-- =====================================================

-- Trigger to validate variant attributes
CREATE TRIGGER validate_variant_attributes_trigger
  BEFORE INSERT OR UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.validate_variant_attributes();

-- Trigger to maintain product aggregates
CREATE TRIGGER update_product_aggregates_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.update_product_aggregates();

-- Trigger to ensure products have variants
CREATE TRIGGER validate_product_has_variants_trigger
  BEFORE DELETE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.validate_product_has_variants();

-- Trigger for updated_at on variants
CREATE TRIGGER trigger_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for updated_at on attributes
CREATE TRIGGER trigger_product_attributes_updated_at
  BEFORE UPDATE ON public.product_attributes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- STEP 7: ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_variants
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

-- RLS Policies for product_attributes
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