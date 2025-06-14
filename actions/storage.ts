'use server'

import { createClient } from '@/lib/supabase/server'
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
