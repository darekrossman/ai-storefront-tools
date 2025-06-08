// ==============================================
// Supabase Storage Utilities
// ==============================================
// Handles file uploads, downloads, and management for Supabase Storage
// Supports avatars and product images with proper security and validation

import { createClient } from './supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './supabase/types'

// ==============================================
// STORAGE CONFIGURATION
// ==============================================

export const STORAGE_CONFIG = {
  buckets: {
    avatars: 'avatars',
    productImages: 'product-images',
  },
  limits: {
    avatar: {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxDimensions: { width: 1024, height: 1024 },
    },
    productImage: {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxDimensions: { width: 2048, height: 2048 },
    },
  },
} as const

export type StorageBucket = keyof typeof STORAGE_CONFIG.buckets
export type FileValidationResult = {
  valid: boolean
  error?: string
}

// ==============================================
// STORAGE MANAGER CLASS
// ==============================================

export class SupabaseStorageManager {
  private supabase: SupabaseClient

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
  }

  // ==============================================
  // AVATAR MANAGEMENT
  // ==============================================

  /**
   * Upload user avatar with validation and automatic cleanup
   */
  async uploadAvatar(
    userId: string,
    file: File,
    options?: { quality?: number },
  ): Promise<{ url: string; path: string }> {
    // Validate file
    const validation = this.validateFile(file, 'avatar')
    if (!validation.valid) {
      throw new StorageError(validation.error || 'Invalid file')
    }

    // Generate file path
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filePath = `${userId}/avatar.${fileExtension}`

    try {
      // Upload file to storage
      const { data, error } = await this.supabase.storage
        .from(STORAGE_CONFIG.buckets.avatars)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Replace existing avatar
        })

      if (error) {
        throw new StorageError(`Failed to upload avatar: ${error.message}`)
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(STORAGE_CONFIG.buckets.avatars)
        .getPublicUrl(data.path)

      return {
        url: urlData.publicUrl,
        path: data.path,
      }
    } catch (error) {
      throw new StorageError(`Avatar upload failed: ${error}`)
    }
  }

  /**
   * Delete user avatar
   */
  async deleteAvatar(userId: string): Promise<void> {
    try {
      // List all files in user's avatar folder
      const { data: files, error: listError } = await this.supabase.storage
        .from(STORAGE_CONFIG.buckets.avatars)
        .list(userId)

      if (listError) {
        throw new StorageError(`Failed to list avatar files: ${listError.message}`)
      }

      if (files && files.length > 0) {
        // Delete all avatar files for the user
        const filePaths = files.map((file) => `${userId}/${file.name}`)
        const { error: deleteError } = await this.supabase.storage
          .from(STORAGE_CONFIG.buckets.avatars)
          .remove(filePaths)

        if (deleteError) {
          throw new StorageError(`Failed to delete avatar: ${deleteError.message}`)
        }
      }
    } catch (error) {
      throw new StorageError(`Avatar deletion failed: ${error}`)
    }
  }

  // ==============================================
  // PRODUCT IMAGE MANAGEMENT
  // ==============================================

  /**
   * Upload product image with validation and metadata
   */
  async uploadProductImage(
    projectId: number,
    productId: number,
    file: File,
    imageType:
      | 'hero'
      | 'gallery'
      | 'thumbnail'
      | 'lifestyle'
      | 'detail'
      | 'variant' = 'gallery',
    metadata?: Record<string, any>,
  ): Promise<{ url: string; path: string }> {
    // Validate file
    const validation = this.validateFile(file, 'productImage')
    if (!validation.valid) {
      throw new StorageError(validation.error || 'Invalid file')
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const sanitizedOriginalName = this.sanitizeFilename(
      file.name.replace(/\.[^/.]+$/, ''),
    )
    const filePath = `${projectId}/products/${productId}/${imageType}_${timestamp}_${sanitizedOriginalName}.${fileExtension}`

    try {
      // Prepare metadata
      const fileMetadata = {
        originalName: file.name,
        imageType,
        uploadedAt: new Date().toISOString(),
        ...metadata,
      }

      // Upload file to storage
      const { data, error } = await this.supabase.storage
        .from(STORAGE_CONFIG.buckets.productImages)
        .upload(filePath, file, {
          cacheControl: '3600',
          metadata: fileMetadata,
        })

      if (error) {
        throw new StorageError(`Failed to upload product image: ${error.message}`)
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(STORAGE_CONFIG.buckets.productImages)
        .getPublicUrl(data.path)

      return {
        url: urlData.publicUrl,
        path: data.path,
      }
    } catch (error) {
      throw new StorageError(`Product image upload failed: ${error}`)
    }
  }

  /**
   * Upload multiple product images in batch
   */
  async uploadProductImages(
    projectId: number,
    productId: number,
    files: File[],
    imageType:
      | 'hero'
      | 'gallery'
      | 'thumbnail'
      | 'lifestyle'
      | 'detail'
      | 'variant' = 'gallery',
  ): Promise<Array<{ url: string; path: string; originalName: string }>> {
    const results = []

    for (const file of files) {
      try {
        const result = await this.uploadProductImage(
          projectId,
          productId,
          file,
          imageType,
        )
        results.push({
          ...result,
          originalName: file.name,
        })
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error)
        // Continue with other files, but you might want to collect errors
      }
    }

    return results
  }

  /**
   * List product images for a specific product
   */
  async listProductImages(
    projectId: number,
    productId: number,
  ): Promise<Array<{ name: string; url: string; metadata: any }>> {
    try {
      const folderPath = `${projectId}/products/${productId}`

      const { data: files, error } = await this.supabase.storage
        .from(STORAGE_CONFIG.buckets.productImages)
        .list(folderPath)

      if (error) {
        throw new StorageError(`Failed to list product images: ${error.message}`)
      }

      if (!files) return []

      return files.map((file) => {
        const { data: urlData } = this.supabase.storage
          .from(STORAGE_CONFIG.buckets.productImages)
          .getPublicUrl(`${folderPath}/${file.name}`)

        return {
          name: file.name,
          url: urlData.publicUrl,
          metadata: file.metadata || {},
        }
      })
    } catch (error) {
      throw new StorageError(`Failed to list product images: ${error}`)
    }
  }

  /**
   * Delete product image
   */
  async deleteProductImage(filePath: string): Promise<void> {
    try {
      const { error } = await this.supabase.storage
        .from(STORAGE_CONFIG.buckets.productImages)
        .remove([filePath])

      if (error) {
        throw new StorageError(`Failed to delete product image: ${error.message}`)
      }
    } catch (error) {
      throw new StorageError(`Product image deletion failed: ${error}`)
    }
  }

  /**
   * Delete all product images for a product
   */
  async deleteAllProductImages(projectId: number, productId: number): Promise<void> {
    try {
      const folderPath = `${projectId}/products/${productId}`

      const { data: files, error: listError } = await this.supabase.storage
        .from(STORAGE_CONFIG.buckets.productImages)
        .list(folderPath)

      if (listError) {
        throw new StorageError(`Failed to list product images: ${listError.message}`)
      }

      if (files && files.length > 0) {
        const filePaths = files.map((file) => `${folderPath}/${file.name}`)
        const { error: deleteError } = await this.supabase.storage
          .from(STORAGE_CONFIG.buckets.productImages)
          .remove(filePaths)

        if (deleteError) {
          throw new StorageError(
            `Failed to delete product images: ${deleteError.message}`,
          )
        }
      }
    } catch (error) {
      throw new StorageError(`Product images deletion failed: ${error}`)
    }
  }

  // ==============================================
  // FILE VALIDATION & UTILITIES
  // ==============================================

  /**
   * Validate file based on type constraints
   */
  private validateFile(
    file: File,
    type: 'avatar' | 'productImage',
  ): FileValidationResult {
    const config = STORAGE_CONFIG.limits[type]

    // Check file size
    if (file.size > config.maxSize) {
      return {
        valid: false,
        error: `File size ${this.formatFileSize(file.size)} exceeds limit of ${this.formatFileSize(config.maxSize)}`,
      }
    }

    // Check file type
    if (!config.allowedTypes.includes(file.type as any)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${config.allowedTypes.join(', ')}`,
      }
    }

    return { valid: true }
  }

  /**
   * Sanitize filename for storage
   */
  private sanitizeFilename(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_+|_+$/g, '')
  }

  /**
   * Format file size for human reading
   */
  private formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  // ==============================================
  // SIGNED URLS & DOWNLOADS
  // ==============================================

  /**
   * Create signed URL for private access
   */
  async createSignedUrl(
    bucket: StorageBucket,
    filePath: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      const { data, error } = await this.supabase.storage
        .from(STORAGE_CONFIG.buckets[bucket])
        .createSignedUrl(filePath, expiresIn)

      if (error) {
        throw new StorageError(`Failed to create signed URL: ${error.message}`)
      }

      return data.signedUrl
    } catch (error) {
      throw new StorageError(`Signed URL creation failed: ${error}`)
    }
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(bucket: StorageBucket, filePath: string): string {
    const { data } = this.supabase.storage
      .from(STORAGE_CONFIG.buckets[bucket])
      .getPublicUrl(filePath)

    return data.publicUrl
  }
}

// ==============================================
// GLOBAL UTILITY FUNCTIONS
// ==============================================

/**
 * Create storage manager instance
 */
export async function createStorageManager(): Promise<SupabaseStorageManager> {
  const supabase = await createClient()
  return new SupabaseStorageManager(supabase)
}

/**
 * Quick avatar upload function
 */
export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<{ url: string; path: string }> {
  const storage = await createStorageManager()
  return storage.uploadAvatar(userId, file)
}

/**
 * Quick product image upload function
 */
export async function uploadProductImage(
  projectId: number,
  productId: number,
  file: File,
  imageType?: 'hero' | 'gallery' | 'thumbnail' | 'lifestyle' | 'detail' | 'variant',
): Promise<{ url: string; path: string }> {
  const storage = await createStorageManager()
  return storage.uploadProductImage(projectId, productId, file, imageType)
}

/**
 * Validate image file before upload
 */
export function validateImageFile(
  file: File,
  type: 'avatar' | 'productImage',
): { valid: boolean; error?: string } {
  const config = STORAGE_CONFIG.limits[type]

  if (file.size > config.maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${Math.round(config.maxSize / 1024 / 1024)}MB limit`,
    }
  }

  if (!config.allowedTypes.includes(file.type as any)) {
    return {
      valid: false,
      error: 'File type not supported. Please use JPEG, PNG, or WebP.',
    }
  }

  return { valid: true }
}

// ==============================================
// ERROR HANDLING
// ==============================================

export class StorageError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message)
    this.name = 'StorageError'
  }
}

// ==============================================
// STORAGE CONSTANTS
// ==============================================

export const STORAGE_LIMITS = STORAGE_CONFIG.limits
export const STORAGE_BUCKETS = STORAGE_CONFIG.buckets
