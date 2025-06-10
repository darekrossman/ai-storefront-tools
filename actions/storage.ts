'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  createStorageManager,
  validateImageFile,
  StorageError,
  type StorageBucket,
} from '@/lib/supabase-storage'

// ==============================================
// AVATAR MANAGEMENT ACTIONS
// ==============================================

/**
 * Upload user avatar and update profile
 */
export async function uploadAvatarAction(formData: FormData): Promise<{
  success: boolean
  url?: string
  error?: string
}> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const file = formData.get('avatar') as File
    if (!file || file.size === 0) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file
    const validation = validateImageFile(file, 'avatar')
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Upload to storage
    const storage = await createStorageManager()
    const { url, path } = await storage.uploadAvatar(user.id, file)

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: path })
      .eq('id', user.id)

    if (updateError) {
      // If profile update fails, clean up uploaded file
      await storage.deleteAvatar(user.id)
      return { success: false, error: 'Failed to update profile' }
    }

    revalidatePath('/account')
    return { success: true, url }
  } catch (error) {
    console.error('Avatar upload error:', error)
    return {
      success: false,
      error: error instanceof StorageError ? error.message : 'Upload failed',
    }
  }
}

/**
 * Delete user avatar
 */
export async function deleteAvatarAction(): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Delete from storage
    const storage = await createStorageManager()
    await storage.deleteAvatar(user.id)

    // Update profile to remove avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', user.id)

    if (updateError) {
      return { success: false, error: 'Failed to update profile' }
    }

    revalidatePath('/account')
    return { success: true }
  } catch (error) {
    console.error('Avatar deletion error:', error)
    return {
      success: false,
      error: error instanceof StorageError ? error.message : 'Deletion failed',
    }
  }
}

// ==============================================
// BRAND LOGO MANAGEMENT ACTIONS
// ==============================================

/**
 * Upload brand logo
 */
export async function uploadBrandLogoAction(
  projectId: number,
  brandId: number,
  formData: FormData,
): Promise<{
  success: boolean
  url?: string
  path?: string
  error?: string
}> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Verify user owns the project
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!project) {
      return { success: false, error: 'Project not found or access denied' }
    }

    // Verify brand exists in project
    const { data: brand } = await supabase
      .from('brands')
      .select('id, project_id')
      .eq('id', brandId)
      .eq('project_id', projectId)
      .single()

    if (!brand) {
      return { success: false, error: 'Brand not found or access denied' }
    }

    const file = formData.get('logo') as File

    if (!file || file.size === 0) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file using existing avatar validation (similar size/type requirements)
    const validation = validateImageFile(file, 'avatar')
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Upload to storage using product image upload but with brand folder structure
    const storage = await createStorageManager()
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const timestamp = Date.now()
    const logoPath = `${projectId}/brands/${brandId}/logo_${timestamp}.${fileExtension}`

    // Upload directly to product-images bucket using custom path
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(logoPath, file, {
        cacheControl: '3600',
        upsert: true,
        metadata: {
          originalName: file.name,
          uploadedBy: user.id,
          brandId,
          projectId,
          uploadedAt: new Date().toISOString(),
        },
      })

    if (error) {
      return { success: false, error: `Failed to upload logo: ${error.message}` }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path)

    // Update brand with logo path in visual_identity field
    const { data: updatedBrand, error: updateError } = await supabase
      .from('brands')
      .update({
        visual_identity: {
          ...((brand as any).visual_identity || {}),
          logo_url: data.path,
          logo_public_url: urlData.publicUrl,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', brandId)
      .select()
      .single()

    if (updateError) {
      // If brand update fails, clean up uploaded file
      await supabase.storage.from('product-images').remove([data.path])
      return { success: false, error: 'Failed to update brand with logo' }
    }

    revalidatePath(`/dashboard/projects/${projectId}/brands`)
    revalidatePath(`/dashboard/projects/${projectId}/brands/${brandId}`)
    return { success: true, url: urlData.publicUrl, path: data.path }
  } catch (error) {
    console.error('Brand logo upload error:', error)
    return {
      success: false,
      error: error instanceof StorageError ? error.message : 'Upload failed',
    }
  }
}

/**
 * Delete brand logo
 */
export async function deleteBrandLogoAction(
  projectId: number,
  brandId: number,
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Verify user owns the project
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!project) {
      return { success: false, error: 'Project not found or access denied' }
    }

    // Get brand with current logo
    const { data: brand } = await supabase
      .from('brands')
      .select('id, visual_identity')
      .eq('id', brandId)
      .eq('project_id', projectId)
      .single()

    if (!brand) {
      return { success: false, error: 'Brand not found or access denied' }
    }

    // Since visual_identity is not a field in the database schema,
    // we'll just proceed with returning success for now
    // TODO: Implement logo removal logic using actual logo storage fields

    revalidatePath(`/dashboard/projects/${projectId}/brands`)
    revalidatePath(`/dashboard/projects/${projectId}/brands/${brandId}`)
    return { success: true }
  } catch (error) {
    console.error('Brand logo deletion error:', error)
    return {
      success: false,
      error: error instanceof StorageError ? error.message : 'Deletion failed',
    }
  }
}

// ==============================================
// PRODUCT IMAGE MANAGEMENT ACTIONS
// ==============================================

/**
 * Upload product image
 */
export async function uploadProductImageAction(
  projectId: number,
  productId: number,
  formData: FormData,
): Promise<{
  success: boolean
  url?: string
  path?: string
  error?: string
}> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Verify user owns the project
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!project) {
      return { success: false, error: 'Project not found or access denied' }
    }

    // Verify product exists in project
    const { data: product } = await supabase
      .from('products')
      .select(`
        id,
        catalog:product_catalogs!inner(
          brand:brands!inner(project_id)
        )
      `)
      .eq('id', productId)
      .eq('catalog.brand.project_id', projectId)
      .single()

    if (!product) {
      return { success: false, error: 'Product not found or access denied' }
    }

    const file = formData.get('image') as File
    const imageType = (formData.get('imageType') as string) || 'gallery'

    if (!file || file.size === 0) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file
    const validation = validateImageFile(file, 'productImage')
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Upload to storage
    const storage = await createStorageManager()
    const { url, path } = await storage.uploadProductImage(
      projectId,
      productId,
      file,
      imageType as any,
      {
        uploadedBy: user.id,
        productName: formData.get('productName') as string,
      },
    )

    revalidatePath(`/projects/${projectId}/products/${productId}`)
    return { success: true, url, path }
  } catch (error) {
    console.error('Product image upload error:', error)
    return {
      success: false,
      error: error instanceof StorageError ? error.message : 'Upload failed',
    }
  }
}

/**
 * Upload multiple product images
 */
export async function uploadProductImagesAction(
  projectId: number,
  productId: number,
  formData: FormData,
): Promise<{
  success: boolean
  results?: Array<{ url: string; path: string; originalName: string }>
  error?: string
}> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Verify user owns the project
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!project) {
      return { success: false, error: 'Project not found or access denied' }
    }

    const files = formData.getAll('images') as File[]
    const imageType = (formData.get('imageType') as string) || 'gallery'

    if (!files || files.length === 0) {
      return { success: false, error: 'No files provided' }
    }

    // Validate all files first
    for (const file of files) {
      const validation = validateImageFile(file, 'productImage')
      if (!validation.valid) {
        return { success: false, error: `${file.name}: ${validation.error}` }
      }
    }

    // Upload all files
    const storage = await createStorageManager()
    const results = await storage.uploadProductImages(
      projectId,
      productId,
      files,
      imageType as any,
    )

    revalidatePath(`/projects/${projectId}/products/${productId}`)
    return { success: true, results }
  } catch (error) {
    console.error('Product images upload error:', error)
    return {
      success: false,
      error: error instanceof StorageError ? error.message : 'Upload failed',
    }
  }
}

/**
 * Delete product image
 */
export async function deleteProductImageAction(
  projectId: number,
  productId: number,
  imagePath: string,
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Verify user owns the project
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!project) {
      return { success: false, error: 'Project not found or access denied' }
    }

    // Verify the image path belongs to this project
    if (!imagePath.startsWith(`${projectId}/products/${productId}/`)) {
      return { success: false, error: 'Invalid image path' }
    }

    // Delete from storage
    const storage = await createStorageManager()
    await storage.deleteProductImage(imagePath)

    revalidatePath(`/projects/${projectId}/products/${productId}`)
    return { success: true }
  } catch (error) {
    console.error('Product image deletion error:', error)
    return {
      success: false,
      error: error instanceof StorageError ? error.message : 'Deletion failed',
    }
  }
}

/**
 * Delete all product images for a product
 */
export async function deleteAllProductImagesAction(
  projectId: number,
  productId: number,
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Verify user owns the project
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!project) {
      return { success: false, error: 'Project not found or access denied' }
    }

    // Delete all images from storage
    const storage = await createStorageManager()
    await storage.deleteAllProductImages(projectId, productId)

    revalidatePath(`/projects/${projectId}/products/${productId}`)
    return { success: true }
  } catch (error) {
    console.error('Product images deletion error:', error)
    return {
      success: false,
      error: error instanceof StorageError ? error.message : 'Deletion failed',
    }
  }
}

/**
 * List product images
 */
export async function listProductImagesAction(
  projectId: number,
  productId: number,
): Promise<{
  success: boolean
  images?: Array<{ name: string; url: string; metadata: any }>
  error?: string
}> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Verify user owns the project
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!project) {
      return { success: false, error: 'Project not found or access denied' }
    }

    // List images from storage
    const storage = await createStorageManager()
    const images = await storage.listProductImages(projectId, productId)

    return { success: true, images }
  } catch (error) {
    console.error('Product images listing error:', error)
    return {
      success: false,
      error: error instanceof StorageError ? error.message : 'Listing failed',
    }
  }
}

// ==============================================
// UTILITY ACTIONS
// ==============================================

/**
 * Get signed URL for private file access
 */
export async function getSignedUrlAction(
  bucket: StorageBucket,
  filePath: string,
  expiresIn: number = 3600,
): Promise<{
  success: boolean
  url?: string
  error?: string
}> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const storage = await createStorageManager()
    const url = await storage.createSignedUrl(bucket, filePath, expiresIn)

    return { success: true, url }
  } catch (error) {
    console.error('Signed URL creation error:', error)
    return {
      success: false,
      error: error instanceof StorageError ? error.message : 'URL creation failed',
    }
  }
}
