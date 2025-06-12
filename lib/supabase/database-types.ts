import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
} from './generated-types'

// ==============================================
// DATABASE TYPE EXPORTS
// ==============================================

// Table row types
export type Profile = Tables<'profiles'>
export type Brand = Tables<'brands'>
export type ProductCatalog = Tables<'product_catalogs'>
export type Category = Tables<'categories'>
export type Product = Tables<'products'>
export type ProductAttributeSchema = Tables<'product_attribute_schemas'>
export type ProductImage = Tables<'product_images'>
export type ProductVariant = Tables<'product_variants'>

// Insert types for creating new records
export type ProfileInsert = TablesInsert<'profiles'>
export type BrandInsert = TablesInsert<'brands'>
export type ProductCatalogInsert = TablesInsert<'product_catalogs'>
export type CategoryInsert = TablesInsert<'categories'>
export type ProductInsert = TablesInsert<'products'>
export type ProductAttributeSchemaInsert = TablesInsert<'product_attribute_schemas'>
export type ProductImageInsert = TablesInsert<'product_images'>
export type ProductVariantInsert = TablesInsert<'product_variants'>

// Update types for modifying existing records
export type ProfileUpdate = TablesUpdate<'profiles'>
export type BrandUpdate = TablesUpdate<'brands'>
export type ProductCatalogUpdate = TablesUpdate<'product_catalogs'>
export type CategoryUpdate = TablesUpdate<'categories'>
export type ProductUpdate = TablesUpdate<'products'>
export type ProductAttributeSchemaUpdate = TablesUpdate<'product_attribute_schemas'>
export type ProductImageUpdate = TablesUpdate<'product_images'>
export type ProductVariantUpdate = TablesUpdate<'product_variants'>

// Enum types
export type BrandStatus = Enums<'brand_status'>

// ==============================================
// TYPED SUPABASE CLIENT
// ==============================================

export type SupabaseClient = import('@supabase/supabase-js').SupabaseClient<Database>

// ==============================================
// CONVENIENCE HELPERS
// ==============================================

// API Response wrapper
export interface DatabaseResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Paginated response wrapper
export interface PaginatedDatabaseResponse<T> extends DatabaseResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasMore: boolean
  }
}
