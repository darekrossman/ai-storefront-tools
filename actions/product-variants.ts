'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/lib/supabase/generated-types'

type ProductVariant = Database['public']['Tables']['product_variants']['Row']
type ProductVariantInsert = Database['public']['Tables']['product_variants']['Insert']
type ProductVariantUpdate = Database['public']['Tables']['product_variants']['Update']
type BrandStatus = Database['public']['Enums']['brand_status']

// Types for variant operations based on generated database types
export type CreateVariantData = Omit<ProductVariantInsert, 'created_at' | 'updated_at'>

export type UpdateVariantData = {
  id: number
} & Partial<Omit<ProductVariantUpdate, 'id' | 'created_at' | 'updated_at'>>

/**
 * Create a new product variant
 */
export async function createProductVariant(data: CreateVariantData) {
  const supabase = await createClient()

  try {
    // Validate user access to product through brand ownership
    const { data: product } = await supabase
      .from('products')
      .select(`
        id,
        product_catalogs (
          id,
          brands (
            id,
            user_id
          )
        )
      `)
      .eq('id', data.product_id)
      .single()

    if (!product?.product_catalogs?.brands?.user_id) {
      throw new Error('Product not found or access denied')
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user || product.product_catalogs.brands.user_id !== user.id) {
      throw new Error('Unauthorized')
    }

    // Validate SKU uniqueness
    const { data: existingVariant } = await supabase
      .from('product_variants')
      .select('id')
      .eq('sku', data.sku)
      .single()

    if (existingVariant) {
      throw new Error('SKU already exists')
    }

    // Create the variant
    const { data: variant, error } = await supabase
      .from('product_variants')
      .insert({
        product_id: data.product_id,
        sku: data.sku,
        barcode: data.barcode,
        price: data.price,
        compare_at_price: data.compare_at_price,
        cost_per_item: data.cost_per_item,
        attributes: data.attributes || {},
        inventory_count: data.inventory_count || 0,
        inventory_policy: data.inventory_policy || 'deny',
        inventory_tracked: data.inventory_tracked ?? true,
        is_active: data.is_active ?? true,
        weight: data.weight,
        weight_unit: data.weight_unit || 'kg',
        status: data.status || 'draft',
        sort_order: data.sort_order || 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating variant:', error)
      throw new Error(error.message)
    }

    revalidatePath('/')
    return { success: true, data: variant }
  } catch (error) {
    console.error('Error in createProductVariant:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Update an existing product variant
 */
export async function updateProductVariant(data: UpdateVariantData) {
  const supabase = await createClient()

  try {
    // Validate user access through brand ownership
    const { data: variant } = await supabase
      .from('product_variants')
      .select(`
        id,
        sku,
        products (
          id,
          product_catalogs (
            id,
            brands (
              id,
              user_id
            )
          )
        )
      `)
      .eq('id', data.id)
      .single()

    if (!variant?.products?.product_catalogs?.brands?.user_id) {
      throw new Error('Variant not found or access denied')
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user || variant.products.product_catalogs.brands.user_id !== user.id) {
      throw new Error('Unauthorized')
    }

    // Validate SKU uniqueness if changing SKU
    if (data.sku && data.sku !== variant.sku) {
      const { data: existingVariant } = await supabase
        .from('product_variants')
        .select('id')
        .eq('sku', data.sku)
        .neq('id', data.id)
        .single()

      if (existingVariant) {
        throw new Error('SKU already exists')
      }
    }

    // Update the variant
    const { id, ...updateData } = data

    const { data: updatedVariant, error } = await supabase
      .from('product_variants')
      .update(updateData)
      .eq('id', data.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating variant:', error)
      throw new Error(error.message)
    }

    revalidatePath('/')
    return { success: true, data: updatedVariant }
  } catch (error) {
    console.error('Error in updateProductVariant:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Delete a product variant
 */
export async function deleteProductVariant(variantId: number) {
  const supabase = await createClient()

  try {
    // Validate user access through brand ownership
    const { data: variant } = await supabase
      .from('product_variants')
      .select(`
        id,
        products (
          id,
          product_catalogs (
            id,
            brands (
              id,
              user_id
            )
          )
        )
      `)
      .eq('id', variantId)
      .single()

    if (!variant?.products?.product_catalogs?.brands?.user_id) {
      throw new Error('Variant not found or access denied')
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user || variant.products.product_catalogs.brands.user_id !== user.id) {
      throw new Error('Unauthorized')
    }

    // Delete the variant (trigger will prevent deletion if it's the last variant)
    const { error } = await supabase.from('product_variants').delete().eq('id', variantId)

    if (error) {
      console.error('Error deleting variant:', error)
      throw new Error(error.message)
    }

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in deleteProductVariant:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Get all variants for a product
 */
export async function getProductVariants(productId: number): Promise<ProductVariant[]> {
  const supabase = await createClient()

  try {
    const { data: variants, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order')
      .order('created_at')

    if (error) {
      console.error('Error fetching variants:', error)
      throw new Error(error.message)
    }

    return variants || []
  } catch (error) {
    console.error('Error in getProductVariants:', error)
    return []
  }
}

/**
 * Get a single variant by ID
 */
export async function getProductVariantById(
  variantId: number,
): Promise<ProductVariant | null> {
  const supabase = await createClient()

  try {
    const { data: variant, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('id', variantId)
      .single()

    if (error) {
      console.error('Error fetching variant:', error)
      return null
    }

    return variant
  } catch (error) {
    console.error('Error in getProductVariantById:', error)
    return null
  }
}

/**
 * Get variants filtered by specific attributes
 */
export async function getVariantsByAttributes(
  productId: number,
  attributeFilters: Record<string, string>,
): Promise<ProductVariant[]> {
  const supabase = await createClient()

  try {
    let query = supabase.from('product_variants').select('*').eq('product_id', productId)

    // Add JSONB contains filter for each attribute
    Object.entries(attributeFilters).forEach(([key, value]) => {
      query = query.contains('attributes', { [key]: value })
    })

    const { data: variants, error } = await query.order('sort_order').order('created_at')

    if (error) {
      console.error('Error fetching filtered variants:', error)
      throw new Error(error.message)
    }

    return variants || []
  } catch (error) {
    console.error('Error in getVariantsByAttributes:', error)
    return []
  }
}

/**
 * Bulk update variant order
 */
export async function updateVariantOrder(
  variantOrders: Array<{ id: number; sort_order: number }>,
) {
  const supabase = await createClient()

  try {
    // Update each variant's sort order
    const updates = variantOrders.map(({ id, sort_order }) =>
      supabase.from('product_variants').update({ sort_order }).eq('id', id),
    )

    const results = await Promise.all(updates)

    // Check if any updates failed
    const errors = results.filter((result) => result.error)
    if (errors.length > 0) {
      console.error('Error updating variant order:', errors)
      throw new Error('Failed to update variant order')
    }

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in updateVariantOrder:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Generate SKU for a new variant based on product and attributes
 */
export async function generateSKU(
  productName: string,
  attributes: Record<string, string>,
): Promise<string> {
  // Create base SKU from product name
  const baseSku = productName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 8)

  // Add attribute codes
  const attributeCodes = Object.entries(attributes)
    .map(([key, value]) => {
      const keyCode = key.substring(0, 3).toUpperCase()
      const valueCode = value.substring(0, 3).toUpperCase()
      return `${keyCode}${valueCode}`
    })
    .join('-')

  return `${baseSku}-${attributeCodes}`
}

/**
 * Validate variant attributes against product attribute definitions
 */
export async function validateVariantAttributes(
  productId: number,
  attributes: Record<string, string>,
): Promise<{ isValid: boolean; errors: string[] }> {
  const supabase = await createClient()

  try {
    // Get product attribute definitions
    const { data: productAttributes, error } = await supabase
      .from('product_attribute_schemas')
      .select('*')
      .eq('product_id', productId)

    if (error) {
      throw new Error(error.message)
    }

    const errors: string[] = []

    // Check required attributes
    productAttributes?.forEach((attr) => {
      if (attr.is_required && !attributes[attr.attribute_key]) {
        errors.push(`Required attribute "${attr.attribute_label}" is missing`)
      }
    })

    // Check valid values
    Object.entries(attributes).forEach(([key, value]) => {
      const attrDef = productAttributes?.find((attr) => attr.attribute_key === key)

      if (!attrDef) {
        errors.push(`Attribute "${key}" is not defined for this product`)
        return
      }

      const validOptions = attrDef.options as Array<{ value: string; label: string }>
      const isValidValue = validOptions.some((option) => option.value === value)

      if (!isValidValue) {
        errors.push(`Invalid value "${value}" for attribute "${attrDef.attribute_label}"`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
    }
  } catch (error) {
    console.error('Error in validateVariantAttributes:', error)
    return {
      isValid: false,
      errors: ['Failed to validate attributes'],
    }
  }
}

/**
 * Get variant display name using database function
 */
export async function getVariantDisplayName(
  variantId: number,
  includeProductName = false,
): Promise<string> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.rpc('get_variant_display_name', {
      p_variant_id: variantId,
      p_include_product_name: includeProductName,
    })

    if (error) {
      console.error('Error getting variant display name:', error)
      throw new Error(error.message)
    }

    return data || `Variant #${variantId}`
  } catch (error) {
    console.error('Error in getVariantDisplayName:', error)
    return `Variant #${variantId}`
  }
}

/**
 * Get effective attributes (base + variant) using database function
 */
export async function getEffectiveAttributes(
  productId: number,
  variantAttributes: Record<string, any> = {},
) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.rpc('get_effective_attributes', {
      p_product_id: productId,
      p_variant_attributes: variantAttributes,
    })

    if (error) {
      console.error('Error getting effective attributes:', error)
      throw new Error(error.message)
    }

    return data || {}
  } catch (error) {
    console.error('Error in getEffectiveAttributes:', error)
    return {}
  }
}
