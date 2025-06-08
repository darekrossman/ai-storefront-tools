import type { Database, Tables, TablesInsert, TablesUpdate, Enums } from './types'

// ==============================================
// DATABASE TYPE EXPORTS
// ==============================================

// Table row types
export type Profile = Tables<'profiles'>
export type Project = Tables<'projects'>
export type Brand = Tables<'brands'>
export type ProductCatalog = Tables<'product_catalogs'>
export type Category = Tables<'categories'>
export type Product = Tables<'products'>
export type ProductAttribute = Tables<'product_attributes'>
export type ProductImage = Tables<'product_images'>
export type ProductVariant = Tables<'product_variants'>

// Insert types for creating new records
export type ProfileInsert = TablesInsert<'profiles'>
export type ProjectInsert = TablesInsert<'projects'>
export type BrandInsert = TablesInsert<'brands'>
export type ProductCatalogInsert = TablesInsert<'product_catalogs'>
export type CategoryInsert = TablesInsert<'categories'>
export type ProductInsert = TablesInsert<'products'>
export type ProductAttributeInsert = TablesInsert<'product_attributes'>
export type ProductImageInsert = TablesInsert<'product_images'>
export type ProductVariantInsert = TablesInsert<'product_variants'>

// Update types for modifying existing records
export type ProfileUpdate = TablesUpdate<'profiles'>
export type ProjectUpdate = TablesUpdate<'projects'>
export type BrandUpdate = TablesUpdate<'brands'>
export type ProductCatalogUpdate = TablesUpdate<'product_catalogs'>
export type CategoryUpdate = TablesUpdate<'categories'>
export type ProductUpdate = TablesUpdate<'products'>
export type ProductAttributeUpdate = TablesUpdate<'product_attributes'>
export type ProductImageUpdate = TablesUpdate<'product_images'>
export type ProductVariantUpdate = TablesUpdate<'product_variants'>

// Enum types
export type BrandStatus = Enums<'brand_status'>
export type SessionStatus = Enums<'session_status'>

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
