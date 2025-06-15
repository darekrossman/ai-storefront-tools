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
export type Job = Tables<'job_queue'>
export type JobProgress = Tables<'job_progress'>

// Insert types for creating new records
export type ProfileInsert = TablesInsert<'profiles'>
export type BrandInsert = TablesInsert<'brands'>
export type ProductCatalogInsert = TablesInsert<'product_catalogs'>
export type CategoryInsert = TablesInsert<'categories'>
export type ProductInsert = TablesInsert<'products'>
export type ProductAttributeSchemaInsert = TablesInsert<'product_attribute_schemas'>
export type ProductImageInsert = TablesInsert<'product_images'>
export type ProductVariantInsert = TablesInsert<'product_variants'>
export type JobInsert = TablesInsert<'job_queue'>
export type JobProgressInsert = TablesInsert<'job_progress'>

// Update types for modifying existing records
export type ProfileUpdate = TablesUpdate<'profiles'>
export type BrandUpdate = TablesUpdate<'brands'>
export type ProductCatalogUpdate = TablesUpdate<'product_catalogs'>
export type CategoryUpdate = TablesUpdate<'categories'>
export type ProductUpdate = TablesUpdate<'products'>
export type ProductAttributeSchemaUpdate = TablesUpdate<'product_attribute_schemas'>
export type ProductImageUpdate = TablesUpdate<'product_images'>
export type ProductVariantUpdate = TablesUpdate<'product_variants'>
export type JobUpdate = TablesUpdate<'job_queue'>
export type JobProgressUpdate = TablesUpdate<'job_progress'>

// Enum types
export type BrandStatus = Enums<'brand_status'>

// ==============================================
// JOB PROCESSING TYPES
// ==============================================

// Job type constants (from database constraints)
export type JobType =
  | 'product_generation'
  | 'image_generation'
  | 'catalog_export'
  | 'batch_processing'
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
export type JobStepStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'skipped'

// Job input data interfaces for type safety
export interface ProductGenerationJobInput {
  catalogId: string
  categoryIds: string[]
  count: number
  priority?: number
}

export interface ImageGenerationJobInput {
  productIds: string[]
  imageType: 'main' | 'gallery' | 'variant'
  priority?: number
}

export interface CatalogExportJobInput {
  catalogId: string
  format: 'shopify_csv' | 'woocommerce_csv' | 'json'
  includeImages?: boolean
  priority?: number
}

export interface BatchProcessingJobInput {
  operations: Array<{
    type: 'product_generation' | 'image_generation'
    data: Record<string, any>
  }>
  priority?: number
}

// Job creation request type
export interface CreateJobRequest {
  job_type: JobType
  input_data:
    | ProductGenerationJobInput
    | ImageGenerationJobInput
    | CatalogExportJobInput
    | BatchProcessingJobInput
  priority?: number
  catalog_id?: string
  estimated_duration_seconds?: number
}

// Job with progress details
export interface JobWithProgress extends Job {
  progress_steps?: JobProgress[]
}

// Real-time update notification type
export interface JobUpdateNotification {
  job_id: string
  user_id: string
  status: JobStatus
  progress_percent: number
  progress_message?: string
}

// Job processing result
export interface JobResult<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: Record<string, any>
  }
}

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

// Job queue statistics
export interface JobQueueStats {
  pending: number
  processing: number
  completed: number
  failed: number
  cancelled: number
  total: number
}
