'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type {
  ProductAttribute,
  ProductAttributeInsert,
  ProductAttributeUpdate,
  ProductVariant,
} from '@/lib/supabase/database-types'

// Types for attribute operations based on generated database types
export type CreateAttributeData = Omit<
  ProductAttributeInsert,
  'created_at' | 'updated_at'
>

export type UpdateAttributeData = Partial<
  Omit<ProductAttributeUpdate, 'id' | 'created_at' | 'updated_at'>
> & {
  id: number
}

/**
 * Create a new product attribute definition
 */
export async function createProductAttribute(data: CreateAttributeData) {
  const supabase = await createClient()

  try {
    // Validate user access to product
    const { data: product } = await supabase
      .from('products')
      .select(`
        id,
        product_catalogs (
          id,
          brands (
            id,
            projects (
              id,
              user_id
            )
          )
        )
      `)
      .eq('id', data.product_id)
      .single()

    if (!product?.product_catalogs?.brands?.projects?.user_id) {
      throw new Error('Product not found or access denied')
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user || product.product_catalogs.brands.projects.user_id !== user.id) {
      throw new Error('Unauthorized')
    }

    // Validate attribute_id uniqueness for this product
    const { data: existingAttribute } = await supabase
      .from('product_attributes')
      .select('id')
      .eq('product_id', data.product_id)
      .eq('attribute_id', data.attribute_id)
      .single()

    if (existingAttribute) {
      throw new Error('Attribute ID already exists for this product')
    }

    // Create the attribute
    const { data: attribute, error } = await supabase
      .from('product_attributes')
      .insert({
        product_id: data.product_id,
        attribute_id: data.attribute_id,
        attribute_label: data.attribute_label,
        options: data.options,
        is_required: data.is_required || false,
        sort_order: data.sort_order || 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating attribute:', error)
      throw new Error(error.message)
    }

    revalidatePath('/')
    return { success: true, data: attribute }
  } catch (error) {
    console.error('Error in createProductAttribute:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Update an existing product attribute
 */
export async function updateProductAttribute(data: UpdateAttributeData) {
  const supabase = await createClient()

  try {
    // Validate user access
    const { data: attribute } = await supabase
      .from('product_attributes')
      .select(`
        id,
        attribute_id,
        products (
          id,
          product_catalogs (
            id,
            brands (
              id,
              projects (
                id,
                user_id
              )
            )
          )
        )
      `)
      .eq('id', data.id)
      .single()

    if (!attribute?.products?.product_catalogs?.brands?.projects?.user_id) {
      throw new Error('Attribute not found or access denied')
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (
      !user ||
      attribute.products.product_catalogs.brands.projects.user_id !== user.id
    ) {
      throw new Error('Unauthorized')
    }

    // Validate attribute_id uniqueness if changing it
    if (data.attribute_id && data.attribute_id !== attribute.attribute_id) {
      const { data: existingAttribute } = await supabase
        .from('product_attributes')
        .select('id')
        .eq('product_id', data.product_id!)
        .eq('attribute_id', data.attribute_id)
        .neq('id', data.id)
        .single()

      if (existingAttribute) {
        throw new Error('Attribute ID already exists for this product')
      }
    }

    // Update the attribute
    const { id, ...updateData } = data

    const { data: updatedAttribute, error } = await supabase
      .from('product_attributes')
      .update(updateData)
      .eq('id', data.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating attribute:', error)
      throw new Error(error.message)
    }

    revalidatePath('/')
    return { success: true, data: updatedAttribute }
  } catch (error) {
    console.error('Error in updateProductAttribute:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Delete a product attribute
 */
export async function deleteProductAttribute(attributeId: number) {
  const supabase = await createClient()

  try {
    // Validate user access
    const { data: attribute } = await supabase
      .from('product_attributes')
      .select(`
        id,
        products (
          id,
          product_catalogs (
            id,
            brands (
              id,
              projects (
                id,
                user_id
              )
            )
          )
        )
      `)
      .eq('id', attributeId)
      .single()

    if (!attribute?.products?.product_catalogs?.brands?.projects?.user_id) {
      throw new Error('Attribute not found or access denied')
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (
      !user ||
      attribute.products.product_catalogs.brands.projects.user_id !== user.id
    ) {
      throw new Error('Unauthorized')
    }

    // Check if any variants use this attribute
    const { data: variantsUsingAttribute } = await supabase
      .from('product_variants')
      .select('id, attributes')
      .eq('product_id', attribute.products.id)

    const attributeInUse = variantsUsingAttribute?.some(
      (variant) =>
        variant.attributes &&
        Object.keys(variant.attributes as Record<string, any>).length > 0,
    )

    if (attributeInUse) {
      throw new Error('Cannot delete attribute that is used by variants')
    }

    // Delete the attribute
    const { error } = await supabase
      .from('product_attributes')
      .delete()
      .eq('id', attributeId)

    if (error) {
      console.error('Error deleting attribute:', error)
      throw new Error(error.message)
    }

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in deleteProductAttribute:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Get all attributes for a product
 */
export async function getProductAttributes(
  productId: number,
): Promise<ProductAttribute[]> {
  const supabase = await createClient()

  try {
    const { data: attributes, error } = await supabase
      .from('product_attributes')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order')
      .order('created_at')

    if (error) {
      console.error('Error fetching attributes:', error)
      throw new Error(error.message)
    }

    return attributes || []
  } catch (error) {
    console.error('Error in getProductAttributes:', error)
    return []
  }
}

/**
 * Get a single attribute by ID
 */
export async function getProductAttributeById(
  attributeId: number,
): Promise<ProductAttribute | null> {
  const supabase = await createClient()

  try {
    const { data: attribute, error } = await supabase
      .from('product_attributes')
      .select('*')
      .eq('id', attributeId)
      .single()

    if (error) {
      console.error('Error fetching attribute:', error)
      return null
    }

    return attribute
  } catch (error) {
    console.error('Error in getProductAttributeById:', error)
    return null
  }
}

/**
 * Bulk update attribute order
 */
export async function updateAttributeOrder(
  attributeOrders: Array<{ id: number; sort_order: number }>,
) {
  const supabase = await createClient()

  try {
    // Update each attribute's sort order
    const updates = attributeOrders.map(({ id, sort_order }) =>
      supabase.from('product_attributes').update({ sort_order }).eq('id', id),
    )

    const results = await Promise.all(updates)

    // Check if any updates failed
    const errors = results.filter((result) => result.error)
    if (errors.length > 0) {
      console.error('Error updating attribute order:', errors)
      throw new Error('Failed to update attribute order')
    }

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in updateAttributeOrder:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Add option to an existing attribute
 */
export async function addAttributeOption(
  attributeId: number,
  option: { id: string; label: string },
) {
  const supabase = await createClient()

  try {
    // Get current attribute
    const { data: attribute, error: fetchError } = await supabase
      .from('product_attributes')
      .select('*')
      .eq('id', attributeId)
      .single()

    if (fetchError || !attribute) {
      throw new Error('Attribute not found')
    }

    // Check if option ID already exists
    const existingOptions = attribute.options as Array<{ id: string; label: string }>
    const optionExists = existingOptions.some((existing) => existing.id === option.id)

    if (optionExists) {
      throw new Error('Option ID already exists')
    }

    // Add the new option
    const updatedOptions = [...existingOptions, option]

    const { error } = await supabase
      .from('product_attributes')
      .update({ options: updatedOptions })
      .eq('id', attributeId)

    if (error) {
      console.error('Error adding attribute option:', error)
      throw new Error(error.message)
    }

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in addAttributeOption:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Remove option from an existing attribute
 */
export async function removeAttributeOption(attributeId: number, optionId: string) {
  const supabase = await createClient()

  try {
    // Get current attribute
    const { data: attribute, error: fetchError } = await supabase
      .from('product_attributes')
      .select('*')
      .eq('id', attributeId)
      .single()

    if (fetchError || !attribute) {
      throw new Error('Attribute not found')
    }

    // Remove the option
    const existingOptions = attribute.options as Array<{ id: string; label: string }>
    const updatedOptions = existingOptions.filter((option) => option.id !== optionId)

    if (updatedOptions.length === existingOptions.length) {
      throw new Error('Option not found')
    }

    // Check if any variants use this option
    const { data: variants } = await supabase
      .from('product_variants')
      .select('id, attributes')
      .eq('product_id', attribute.product_id)

    const optionInUse = variants?.some((variant) => {
      const attrs = variant.attributes as Record<string, string>
      return attrs && attrs[attribute.attribute_id] === optionId
    })

    if (optionInUse) {
      throw new Error('Cannot remove option that is used by variants')
    }

    const { error } = await supabase
      .from('product_attributes')
      .update({ options: updatedOptions })
      .eq('id', attributeId)

    if (error) {
      console.error('Error removing attribute option:', error)
      throw new Error(error.message)
    }

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in removeAttributeOption:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Get all available attribute combinations for a product
 */
export async function getAttributeCombinations(
  productId: number,
): Promise<Record<string, string[]>> {
  const supabase = await createClient()

  try {
    const attributes = await getProductAttributes(productId)
    const combinations: Record<string, string[]> = {}

    attributes.forEach((attr) => {
      const options = attr.options as Array<{ id: string; label: string }>
      combinations[attr.attribute_id] = options.map((option) => option.id)
    })

    return combinations
  } catch (error) {
    console.error('Error in getAttributeCombinations:', error)
    return {}
  }
}

/**
 * Generate all possible attribute combinations
 */
export async function generateVariantCombinations(
  attributes: Record<string, string[]>,
): Promise<Array<Record<string, string>>> {
  const keys = Object.keys(attributes)
  const combinations: Array<Record<string, string>> = []

  function generateCombination(
    currentCombination: Record<string, string>,
    depth: number,
  ) {
    if (depth === keys.length) {
      combinations.push({ ...currentCombination })
      return
    }

    const currentKey = keys[depth]
    if (!currentKey) return

    const values = attributes[currentKey]

    if (values) {
      for (const value of values) {
        currentCombination[currentKey] = value
        generateCombination(currentCombination, depth + 1)
      }
    }
  }

  generateCombination({}, 0)
  return combinations
}
