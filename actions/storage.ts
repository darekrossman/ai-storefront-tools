'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ProductImageInsert } from '@/lib/supabase/database-types'
import { GeneratedImageResponse } from '@/lib/types'

// Placeholder storage actions for brand logo operations
// These need to be implemented with actual Supabase storage logic

type UploadResult = {
  success: boolean
  error?: string
  url?: string
}

export async function uploadBrandLogoAction(
  brandId: number,
  formData: FormData,
): Promise<UploadResult> {
  // TODO: Implement actual upload logic
  return {
    success: false,
    error: 'Brand logo upload not yet implemented',
  }
}

export async function deleteBrandLogoAction(
  brandId: number,
  logoUrl: string,
): Promise<UploadResult> {
  // TODO: Implement actual delete logic
  return {
    success: false,
    error: 'Brand logo delete not yet implemented',
  }
}

/**
 * Store a generated image (base64) to Supabase storage and create a product_images record
 */
export async function storeGeneratedImageAction(
  productId: number,
  imageData: GeneratedImageResponse,
  attributes: Record<string, string | number | boolean>,
  imageType:
    | 'hero'
    | 'gallery'
    | 'thumbnail'
    | 'lifestyle'
    | 'detail'
    | 'variant' = 'gallery',
): Promise<UploadResult & { imageRecord?: ProductImageInsert }> {
  try {
    const supabase = await createClient()

    const image = imageData.images[0]

    if (!image) {
      console.error('No image data found')
      return {
        success: false,
        error: 'No image data found',
      }
    }

    // Convert base64 to buffer
    const base64String = image.url.replace(/^data:image\/[a-z]+;base64,/, '')

    const buffer = Buffer.from(base64String, 'base64')

    // Generate unique filename
    const timestamp = Date.now()
    const attributesString = Object.values(attributes).join('_')
    const filename = `${timestamp}_${attributesString}.${image.content_type.split('/')[1]}`
    const storagePath = `${productId}/${filename}`

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product_images')
      .upload(storagePath, buffer, {
        contentType: image.content_type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return {
        success: false,
        error: `Failed to upload image: ${uploadError.message}`,
      }
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('product_images')
      .getPublicUrl(storagePath)

    if (!urlData?.publicUrl) {
      console.error('Failed to get public URL')
      return {
        success: false,
        error: 'Failed to get image URL',
      }
    }

    // Create product_images record
    const imageRecord: ProductImageInsert = {
      product_id: productId,
      url: urlData.publicUrl,
      alt_text: `${imageType} image for ${productId}, ${attributesString}`,
      type: imageType,
      sort_order: 0,
      width: image.width,
      height: image.height,
      seed: imageData.seed,
      prompt: imageData.prompt,
      attribute_filters: attributes,
    }

    const { data: dbData, error: dbError } = await supabase
      .from('product_images')
      .insert(imageRecord)
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Try to clean up the uploaded file
      await supabase.storage.from('product_images').remove([storagePath])
      return {
        success: false,
        error: `Failed to save image record: ${dbError.message}`,
      }
    }

    return {
      success: true,
      url: urlData.publicUrl,
      imageRecord: imageRecord,
    }
  } catch (error) {
    console.error('Error in storeGeneratedImageAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Delete a product image from both database and storage
 */
export async function deleteProductImageAction(imageId: number): Promise<UploadResult> {
  try {
    const supabase = await createClient()

    // Get the image record first to validate ownership and get storage path
    const { data: image, error: fetchError } = await supabase
      .from('product_images')
      .select(`
        id,
        url,
        product_id,
        products (
          id,
          product_catalogs (
            catalog_id,
            brands (
              id,
              user_id
            )
          )
        )
      `)
      .eq('id', imageId)
      .single()

    if (fetchError || !image) {
      console.error('Error fetching image:', fetchError)
      return {
        success: false,
        error: 'Image not found',
      }
    }

    // Validate user ownership
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const brandUserId = image.products?.product_catalogs?.brands?.user_id
    if (!user || !brandUserId) {
      return {
        success: false,
        error: 'Access denied',
      }
    }

    if (brandUserId !== user.id) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    // Extract storage path from URL
    // URL format: https://[project-id].supabase.co/storage/v1/object/public/product_images/[path]
    const urlParts = image.url.split('/product_images/')
    if (urlParts.length !== 2) {
      console.error('Invalid image URL format:', image.url)
      return {
        success: false,
        error: 'Invalid image URL format',
      }
    }
    const storagePath = urlParts[1]!

    // Delete from database first
    const { error: dbError } = await supabase
      .from('product_images')
      .delete()
      .eq('id', imageId)

    if (dbError) {
      console.error('Database delete error:', dbError)
      return {
        success: false,
        error: `Failed to delete image record: ${dbError.message}`,
      }
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('product_images')
      .remove([storagePath])

    if (storageError) {
      console.error('Storage delete error:', storageError)
      // Note: We continue even if storage deletion fails since DB record is already deleted
      // This prevents orphaned database records
    }

    // Revalidate the page to reflect the changes
    revalidatePath('/')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error in deleteProductImageAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
